import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Character, StorySlide, Rendition, TitlePage, SocialUser, Story } from './types';
import { generateImage, generateStoryForImage } from './services/geminiService';
import { exportStoryAsPdf } from './services/exportService';
import { login, signup, logout } from './services/authService';
import { saveStory, getStoryById, shareStoryToFeed } from './services/storyService';
import { getMe } from './services/userService';
import Header from './components/Header';
import AssetLibrary from './components/AssetLibrary';
import SlideViewer from './components/SlideViewer';
import TitlePageEditor from './components/TitlePageEditor';
import { CharacterEditor } from './components/CharacterEditor';
import { PresentationView } from './components/PresentationView';
import Navigation from './components/Navigation';
import { AuthModal } from './components/AuthModal';
import { ShareModal } from './components/ShareModal';
import SocialPage from './pages/SocialPage';
import { getToken } from './services/authService';

type AppView = 'story' | 'editor' | 'presenting' | 'public_story' | 'social';
type AuthMode = 'login' | 'signup';

const newStory: Story = {
  titlePage: {
    title: 'My AI Story',
    authors: 'A Creative Human',
    description: 'An adventure woven with words and pixels.',
    coverImageUrl: null,
    coverImagePrompt: null,
  },
  slides: [],
  tags: [],
};


function App(): React.ReactNode {
  const [story, setStory] = useState<Story>(newStory);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentDisplayIndex, setCurrentDisplayIndex] = useState(0); // 0 for title, 1+ for slides
  const [isGenerating, setIsGenerating] = useState(false);
  const [view, setView] = useState<AppView>('story');
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(null);
  
  const [currentUser, setCurrentUser] = useState<SocialUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  
  const [publicStory, setPublicStory] = useState<Story | null>(null);

  // Auth check on initial load
  useEffect(() => {
    const checkAuth = async () => {
      setAuthLoading(true);
      try {
        const token = getToken();
        if (!token) {
          console.log('No token found');
          return;
        }

        const userData = await getMe();
        setCurrentUser(userData);
        console.log('User authenticated:', userData);
      } catch (error) {
        console.log('Authentication check failed:', error.message);
        // Clear any invalid token
        localStorage.removeItem('token');
        setCurrentUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Public story routing
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/story/')) {
        const storyId = path.split('/')[2];
        if (storyId) {
            setView('public_story');
            getStoryById(storyId).then(storyData => {
              if (storyData) {
                setPublicStory(storyData);
              } else {
                setPublicStory({
                  titlePage: { title: 'Story Not Found', authors: '', description: `The story with ID ${storyId} could not be found.`, coverImageUrl: null, coverImagePrompt: null},
                  slides: []
                });
              }
            }).catch(err => console.error(err));
        }
    }
  }, []);

  const handleUpdateSlide = useCallback((slideId: string, updates: Partial<StorySlide>) => {
    setStory(prevStory => ({
      ...prevStory,
      slides: prevStory.slides.map(s => s.id === slideId ? { ...s, ...updates } : s)
    }));
  }, []);

  const handleUpdateTitlePage = useCallback((updates: Partial<TitlePage>) => {
    setStory(prevStory => ({
      ...prevStory,
      titlePage: { ...prevStory.titlePage, ...updates }
    }));
  }, []);

  const handleUpdateTags = useCallback((newTags: string[]) => {
    setStory(prevStory => ({
      ...prevStory,
      tags: newTags,
    }));
  }, []);
  
  const generateStoryForSlide = useCallback(async (slideId: string, prompt: string) => {
    handleUpdateSlide(slideId, { isGeneratingStory: true });
    try {
      const storyText = await generateStoryForImage(prompt);
      handleUpdateSlide(slideId, { storyText: storyText, isGeneratingStory: false });
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      handleUpdateSlide(slideId, { storyText: `Error generating story: ${errorMessage}`, isGeneratingStory: false });
    }
  }, [handleUpdateSlide]);

  const handleCreateCharacter = useCallback(async (prompt: string) => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const imageUrl = await generateImage(prompt, story.tags);
      const newCharacter: Character = { id: crypto.randomUUID(), prompt, imageUrl };
      setCharacters(prev => [newCharacter, ...prev]);
    } catch (error) {
      console.error(error);
      alert("Failed to create character. See console for details.");
    } finally {
      setIsGenerating(false);
    }
  }, [story.tags]);

  const handleGenerateCoverImage = useCallback(async (prompt: string) => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const imageUrl = await generateImage(prompt, story.tags);
      handleUpdateTitlePage({ coverImageUrl: imageUrl, coverImagePrompt: prompt });
    } catch (error) {
       console.error(error);
      alert("Failed to generate cover image. See console for details.");
    } finally {
      setIsGenerating(false);
    }
  }, [handleUpdateTitlePage, story.tags]);
  
  const handleSaveRenditionAsNewCharacter = useCallback((rendition: Rendition) => {
    const newCharacter: Character = { id: crypto.randomUUID(), ...rendition };
    setCharacters(prev => [newCharacter, ...prev]);
  }, []);

  const handleUpdateCharacter = useCallback((characterId: string, updates: Partial<Omit<Character, 'id'>>) => {
      setCharacters(prev => prev.map(c => c.id === characterId ? { ...c, ...updates } : c));
  }, []);

  const handleAddImageToPage = useCallback(async (imageUrl: string, prompt: string) => {
    if (currentDisplayIndex === 0) {
      handleUpdateTitlePage({ coverImageUrl: imageUrl, coverImagePrompt: prompt });
    } else {
      const slideIndex = currentDisplayIndex - 1;
      const currentSlide = story.slides[slideIndex];
      if (currentSlide) {
        handleUpdateSlide(currentSlide.id, { imageUrl, imagePrompt: prompt, storyText: 'Generating story...' });
        await generateStoryForSlide(currentSlide.id, prompt);
      }
    }
  }, [story.slides, currentDisplayIndex, handleUpdateTitlePage, handleUpdateSlide, generateStoryForSlide]);
  
  const handleAddSlide = () => {
    const newSlide: StorySlide = { 
      id: crypto.randomUUID(), 
      imageUrl: null, 
      imagePrompt: null, 
      storyText: 'Add an image or write your next chapter...', 
      isGeneratingStory: false 
    };
    setStory(prev => ({...prev, slides: [...prev.slides, newSlide]}));
    setCurrentDisplayIndex(story.slides.length + 1);
  };

  const handleRemovePage = () => {
    if (currentDisplayIndex > 0) {
        const slideIndexToRemove = currentDisplayIndex - 1;
        setStory(prev => ({...prev, slides: prev.slides.filter((_, index) => index !== slideIndexToRemove)}));
        setCurrentDisplayIndex(prev => Math.max(0, prev - 1));
    }
  };

  const handleReorderSlide = (direction: 'left' | 'right') => {
    if (currentDisplayIndex > 0) {
      const fromIndex = currentDisplayIndex - 1;
      const toIndex = direction === 'left' ? fromIndex - 1 : fromIndex + 1;

      if (toIndex >= 0 && toIndex < story.slides.length) {
        const newSlides = [...story.slides];
        [newSlides[fromIndex], newSlides[toIndex]] = [newSlides[toIndex], newSlides[fromIndex]];
        setStory(prev => ({...prev, slides: newSlides}));
        setCurrentDisplayIndex(toIndex + 1);
      }
    }
  };
  
  const handlePrevPage = () => setCurrentDisplayIndex(prev => Math.max(0, prev - 1));
  const handleNextPage = () => setCurrentDisplayIndex(prev => Math.min(story.slides.length, prev + 1));
  
  const handleEditCharacter = (characterId: string) => {
    setEditingCharacterId(characterId);
    setView('editor');
  };
  
  const handleExitEditor = () => {
    setEditingCharacterId(null);
    setView('story');
  }

  const handleDownload = async () => {
    alert("Preparing PDF. This may take a moment...");
    try {
      await exportStoryAsPdf(story);
    } catch(error) {
      console.error("PDF Export failed:", error);
      alert("Could not generate PDF. Please see the console for details.");
    }
  };

  const handleAuthAction = async (email: string, password: string, username?: string) => {
    try {
        const action = authMode === 'login' ? () => login(email, password) : () => signup(email, password, username!);
        const user = await action();
        setCurrentUser(user);
        setShowAuthModal(false);
    } catch (error) {
        alert(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleLogout = () => {
      logout();
      setCurrentUser(null);
      setStory(newStory); // Reset to a new story on logout
      console.log("User logged out.");
  };

  const handleSaveStory = async () => {
    if (!currentUser) {
      alert("Please log in to save your story.");
      return;
    }
    try {
        const saved = await saveStory(story);
        setStory(saved); // Update story with ID from backend
        alert(`Story saved!`);
        setShowShareModal(true);
    } catch (error) {
        alert(`Failed to save story: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  const handleShareToFeed = async () => {
    if (!story._id) return;
    try {
      await shareStoryToFeed(story._id);
      alert("Story shared to the public feed!");
      setShowShareModal(false);
    } catch (error) {
      alert(`Failed to share story: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const editingCharacter = useMemo(() => characters.find(c => c.id === editingCharacterId), [characters, editingCharacterId]);

  if (authLoading) {
    return <div className="w-full h-screen flex items-center justify-center text-xl font-orbitron">Initializing Story Weaver AI...</div>;
  }
  
  if (view === 'public_story') {
    if (!publicStory) {
      return <div className="w-full h-screen flex items-center justify-center text-xl">Loading story...</div>
    }
    return <PresentationView story={publicStory} onExit={() => window.location.href = '/'} isPublicView={true} />;
  }
  
  if (view === 'presenting') {
    return <PresentationView story={story} onExit={() => setView('story')} />;
  }

  if (view === 'editor' && editingCharacter) {
    return <CharacterEditor character={editingCharacter} onUpdateCharacter={handleUpdateCharacter} onSaveNewCharacter={handleSaveRenditionAsNewCharacter} onExit={handleExitEditor} tags={story.tags || []} />;
  }
  
  const renderMainContent = () => {
    if(view === 'social') {
      return <SocialPage currentUser={currentUser} />;
    }
    
    const isTitlePage = currentDisplayIndex === 0;
    const currentSlide = isTitlePage ? null : story.slides[currentDisplayIndex - 1];

    return (
      <main className="flex-grow grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 overflow-hidden">
        <div className="md:col-span-2 lg:col-span-3 h-full flex flex-col bg-brand-secondary rounded-lg shadow-lg">
          <div className="flex-grow p-6 overflow-y-auto">
            {isTitlePage ? (
              <TitlePageEditor 
                titlePage={story.titlePage}
                onUpdate={handleUpdateTitlePage}
                onGenerateCover={handleGenerateCoverImage}
                isGenerating={isGenerating}
              />
            ) : (
              currentSlide && <SlideViewer slide={currentSlide} onUpdate={handleUpdateSlide} />
            )}
          </div>
          <Navigation
            onAddSlide={handleAddSlide}
            onPrev={handlePrevPage}
            onNext={handleNextPage}
            onRemove={handleRemovePage}
            onReorder={handleReorderSlide}
            currentIndex={currentDisplayIndex}
            totalItems={story.slides.length + 1}
            canNavigatePrev={currentDisplayIndex > 0}
            canNavigateNext={currentDisplayIndex < story.slides.length}
            isSlide={!isTitlePage}
          />
        </div>
        <div className="h-full flex flex-col">
          <AssetLibrary
            characters={characters}
            onCreateCharacter={handleCreateCharacter}
            onSelectCharacter={handleAddImageToPage}
            onEditCharacter={handleEditCharacter}
            isGeneratingImage={isGenerating}
            tags={story.tags || []}
            onUpdateTags={handleUpdateTags}
          />
        </div>
      </main>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-brand-primary font-sans">
      <Header 
        onDownload={handleDownload} 
        onPresent={() => setView('presenting')}
        onSocialClick={() => setView(view === 'social' ? 'story' : 'social')}
        isSocialView={view === 'social'}
        user={currentUser}
        onLoginClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
        onSignupClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}
        onLogout={handleLogout}
        onSave={handleSaveStory}
        onShare={() => setShowShareModal(true)}
        isStorySaved={!!story._id}
      />
      {showAuthModal && (
        <AuthModal 
          mode={authMode} 
          onClose={() => setShowAuthModal(false)} 
          onSubmit={handleAuthAction}
          onSwitchMode={(newMode) => setAuthMode(newMode)}
        />
      )}
      {showShareModal && story._id && (
        <ShareModal
          storyId={story._id}
          onClose={() => setShowShareModal(false)}
          onShareToFeed={handleShareToFeed}
        />
      )}
      {renderMainContent()}
    </div>
  );
}

export default App;