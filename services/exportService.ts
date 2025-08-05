import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Story, TitlePage, StorySlide } from '../types';

const createPageElement = (content: HTMLElement, isDarkMode: boolean): HTMLElement => {
  const page = document.createElement('div');
  page.style.width = '210mm';
  page.style.height = '297mm';
  page.style.position = 'absolute';
  page.style.left = '-210mm'; // Position off-screen
  page.style.top = '0';
  page.style.padding = '20mm';
  page.style.display = 'flex';
  page.style.flexDirection = 'column';
  page.style.fontFamily = 'Inter, sans-serif';
  if(isDarkMode) {
    page.style.backgroundColor = '#111111'; // brand-primary
    page.style.color = '#e5e7eb'; // brand-text
  } else {
    page.style.backgroundColor = '#ffffff';
    page.style.color = '#000000';
  }
  
  page.appendChild(content);
  document.body.appendChild(page);
  return page;
};

const createTitlePageContent = (titlePage: TitlePage): HTMLElement => {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.textAlign = 'center';
    container.style.height = '100%';
    
    if (titlePage.coverImageUrl) {
        const img = document.createElement('img');
        img.src = titlePage.coverImageUrl;
        img.crossOrigin = 'anonymous';
        img.style.maxWidth = '120mm';
        img.style.maxHeight = '120mm';
        img.style.marginBottom = '10mm';
        img.style.objectFit = 'cover';
        container.appendChild(img);
    }

    const title = document.createElement('h1');
    title.innerText = titlePage.title;
    title.style.fontSize = '24pt';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '4mm';
    container.appendChild(title);
    
    const authors = document.createElement('p');
    authors.innerText = `by ${titlePage.authors}`;
    authors.style.fontSize = '14pt';
    authors.style.fontStyle = 'italic';
    authors.style.marginBottom = '8mm';
    container.appendChild(authors);

    const description = document.createElement('p');
    description.innerText = titlePage.description;
    description.style.fontSize = '12pt';
    container.appendChild(description);

    return container;
};

const createSlideContent = (slide: StorySlide, slideNumber: number): HTMLElement => {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.height = '100%';

    if (slide.imageUrl) {
        const img = document.createElement('img');
        img.src = slide.imageUrl;
        img.crossOrigin = 'anonymous';
        img.style.width = '170mm';
        img.style.height = '170mm';
        img.style.objectFit = 'cover';
        img.style.marginBottom = '10mm';
        container.appendChild(img);
    }

    const text = document.createElement('p');
    text.innerText = slide.storyText;
    text.style.fontSize = '12pt';
    text.style.lineHeight = '1.6';
    text.style.flexGrow = '1';
    container.appendChild(text);

    const footer = document.createElement('p');
    footer.innerText = `Page ${slideNumber}`;
    footer.style.textAlign = 'center';
    footer.style.fontSize = '10pt';
    footer.style.marginTop = 'auto';
    container.appendChild(footer);

    return container;
};

export const exportStoryAsPdf = async (story: Story): Promise<void> => {
  const { titlePage, slides } = story;
  const pdf = new jsPDF('p', 'mm', 'a4');
  const isDarkMode = true; // Use app's theme for PDF
  const bgColor = isDarkMode ? '#111111' : '#ffffff';

  // Title Page
  const titlePageContent = createTitlePageContent(titlePage);
  const titlePageElement = createPageElement(titlePageContent, isDarkMode);
  const titleCanvas = await html2canvas(titlePageElement, { useCORS: true, backgroundColor: bgColor });
  document.body.removeChild(titlePageElement);
  const titleImgData = titleCanvas.toDataURL('image/png');
  pdf.addImage(titleImgData, 'PNG', 0, 0, 210, 297);

  // Story Slides
  for (let i = 0; i < slides.length; i++) {
    pdf.addPage();
    const slide = slides[i];
    const slideContent = createSlideContent(slide, i + 1);
    const slideElement = createPageElement(slideContent, isDarkMode);
    const slideCanvas = await html2canvas(slideElement, { useCORS: true, backgroundColor: bgColor });
    document.body.removeChild(slideElement);
    const slideImgData = slideCanvas.toDataURL('image/png');
    pdf.addImage(slideImgData, 'PNG', 0, 0, 210, 297);
  }

  pdf.save(`${titlePage.title.replace(/\s/g, '_') || 'story'}.pdf`);
};