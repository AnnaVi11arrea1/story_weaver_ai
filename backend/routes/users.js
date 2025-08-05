import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// @route   GET api/users/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        // req.user is populated by auth middleware
        res.json(req.user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/users/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
             return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/users/:id/follow
// @desc    Follow or unfollow a user
// @access  Private
router.post('/:id/follow', auth, async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToFollow || !currentUser) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        if (userToFollow.id === currentUser.id) {
            return res.status(400).json({ msg: 'You cannot follow yourself' });
        }

        // Check if already following
        if (currentUser.following.includes(userToFollow.id)) {
            // Unfollow
            currentUser.following = currentUser.following.filter(id => id.toString() !== userToFollow.id);
            userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== currentUser.id);
        } else {
            // Follow
            currentUser.following.push(userToFollow.id);
            userToFollow.followers.push(currentUser.id);
        }

        await currentUser.save();
        await userToFollow.save();

        res.json({ following: currentUser.following });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
