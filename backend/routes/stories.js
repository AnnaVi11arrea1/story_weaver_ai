import express from 'express';
import  { authenticateToken } from '../middleware/auth.js';
import Story from '../models/Story.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';

const router = express.Router();

// @route   POST api/stories
// @desc    Create a new story
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { titlePage, slides, tags } = req.body;
        const newStory = new Story({
            owner: req.user.id,
            titlePage,
            slides,
            tags: tags || [],
            isPublic: false,
        });
        const story = await newStory.save();
        res.json(story);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/stories/:id
// @desc    Update an existing story
// @access  Private
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { titlePage, slides, isPublic, tags } = req.body;
        let story = await Story.findById(req.params.id);

        if (!story) return res.status(404).json({ msg: 'Story not found' });

        // Make sure user owns the story
        if (story.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        story = await Story.findByIdAndUpdate(
            req.params.id,
            { $set: { titlePage, slides, isPublic, tags } },
            { new: true }
        );

        res.json(story);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/stories/feed/public
// @desc    Get all public stories for the feed
// @access  Public
router.get('/feed/public', async (req, res) => {
    try {
        const stories = await Story.find({ isPublic: true })
            .populate('owner', ['username', '_id'])
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'username'
                }
            })
            .sort({ createdAt: -1 });
        res.json(stories);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/stories/:id
// @desc    Get a specific story
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const story = await Story.findById(req.params.id)
            .populate('owner', ['username', '_id'])
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'username _id'
                }
            });
            
        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }
        res.json(story);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route   POST api/stories/:id/share
// @desc    Make a story public
// @access  Private
router.post('/:id/share', authenticateToken, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id);
        if (!story) return res.status(404).json({ msg: 'Story not found' });
        if (story.owner.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        story.isPublic = true;
        await story.save();
        res.json(story);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/stories/:id/like
// @desc    Like or unlike a story
// @access  Private
router.post('/:id/like', authenticateToken, async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) return res.status(404).json({ msg: 'Story not found' });

        // Check if the post has already been liked by this user
        if (story.likes.some(like => like.toString() === req.user.id)) {
            // Unlike
            story.likes = story.likes.filter(like => like.toString() !== req.user.id);
        } else {
            // Like
            story.likes.push(req.user.id);
        }

        await story.save();
        res.json(story.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/stories/:id/comment
// @desc    Comment on a story
// @access  Private
router.post('/:id/comment', authenticateToken, async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) return res.status(404).json({ msg: 'Story not found' });

        const newComment = new Comment({
            text: req.body.text,
            author: req.user.id,
            story: req.params.id // FIX: Add reference to the story
        });
        
        await newComment.save();

        story.comments.unshift(newComment._id);
        await story.save();
        
        // Populate author details for the response
        const populatedComment = await Comment.findById(newComment._id).populate('author', ['username', '_id']);
        
        res.json(populatedComment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;