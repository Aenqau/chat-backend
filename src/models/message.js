import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Message = new Schema({
    author: { type: Schema.Types.ObjectId, default: process.env.USER_ID },
    chat: { type: Schema.Types.ObjectId, required: true },
    body: { type: String, required: true },
    updated: { type: Date, default: Date.now },
    reads: [{userId: Schema.Types.ObjectId, seen: Boolean}]
});


export default mongoose.model('message', Message);
