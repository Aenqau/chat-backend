import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ChatRoom = new Schema({
    name: { type: String, default: '' },
    users: [{_id: Schema.Types.ObjectId}],
    messages: [{_id: Schema.Types.ObjectId}],
    createdAt: { type: Date, default: Date.now },
    isGroup: { type: Boolean, default: false }
});


export default mongoose.model('chatroom', ChatRoom);
