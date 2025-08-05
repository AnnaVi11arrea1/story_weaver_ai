import mongoose from 'mongoose';
const { Schema } = mongoose;

const StorySlideSchema = new Schema({
    id: { type: String, required: true },
    imageUrl: String,
    imagePrompt: String,
    storyText: { type: String, required: true },
    isGeneratingStory: { type: Boolean, default: false }
}, { _id: false });

const TitlePageSchema = new Schema({
    title: { type: String, required: true },
    authors: String,
    description: String,
    coverImageUrl: String,
    coverImagePrompt: String,
}, { _id: false });

const StorySchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    titlePage: {
        type: TitlePageSchema,
        required: true,
    },
    slides: {
        type: [StorySlideSchema],
        required: true,
    },
    tags: {
        type: [String],
        default: []
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Story = mongoose.model('Story', StorySchema);

export default Story;