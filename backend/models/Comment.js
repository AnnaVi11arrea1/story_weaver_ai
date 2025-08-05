import mongoose from 'mongoose';
const { Schema } = mongoose;

const CommentSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    story: {
        type: Schema.Types.ObjectId,
        ref: 'Story',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;
