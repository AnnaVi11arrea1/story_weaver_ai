import express from 'express';
import auth from '../middleware/auth.js';
import Group from '../models/Group.js';
import Story from '../models/Story.js';

const router = express.Router();

// @route   POST api/groups
// @desc    Create a new group
// @access  Private
router.post('/', auth, async (req, res) => {
    const { name, description, isPrivate } = req.body;
    try {
        const newGroup = new Group({
            name,
            description,
            isPrivate,
            owner: req.user.id,
            members: [req.user.id] // Owner is the first member
        });

        const group = await newGroup.save();
        res.json(group);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/groups/my-groups
// @desc    Get all groups for the logged in user
// @access  Private
router.get('/my-groups', auth, async (req, res) => {
    try {
        const groups = await Group.find({ members: req.user.id }).populate('owner', ['username']);
        res.json(groups);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/groups/public
// @desc    Get all public groups
// @access  Public
router.get('/public', async (req, res) => {
    try {
        const groups = await Group.find({ isPrivate: false }).populate('owner', ['username']);
        res.json(groups);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/groups/:id/join
// @desc    Join a group
// @access  Private
router.post('/:id/join', auth, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ msg: 'Group not found' });
        if (group.isPrivate) return res.status(403).json({ msg: 'This group is private' });
        if (group.members.includes(req.user.id)) return res.status(400).json({ msg: 'Already a member' });

        group.members.push(req.user.id);
        await group.save();
        res.json(group.members);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/groups/:groupId/share/:storyId
// @desc    Share a story to a group
// @access  Private
router.post('/:groupId/share/:storyId', auth, async (req, res) => {
     try {
        const group = await Group.findById(req.params.groupId);
        const story = await Story.findById(req.params.storyId);

        if (!group) return res.status(404).json({ msg: 'Group not found' });
        if (!story) return res.status(404).json({ msg: 'Story not found' });

        // User must be a member of the group and owner of the story
        if (!group.members.includes(req.user.id)) return res.status(403).json({ msg: 'Must be a member to share' });
        if (story.owner.toString() !== req.user.id) return res.status(403).json({ msg: 'Must be the story owner to share' });

        if (group.stories.includes(story.id)) return res.status(400).json({ msg: 'Story already shared in this group' });

        group.stories.push(story.id);
        await group.save();
        res.json(group);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


export default router;
