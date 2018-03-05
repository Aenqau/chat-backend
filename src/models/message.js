import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// GET /messages?userId=userId

const messageSchema = new Schema({
    _id: Schema.Types.ObjectId,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    userId: { type: Schema.Types.ObjectId, required: true },
    body: { type: String, required: true },
    updated: { type: Date, default: Date.now },
    seen: Boolean
});


export default mongoose.model('message', messageSchema);
