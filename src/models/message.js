import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;

// GET /messages?userId=userId

const schema = new Schema({
    id: { type: Number, required: true },
    userId: { type: Number, required: true },
    body: { type: String, required: true },
    status: { type: String, required: true }
});

schema.plugin(autoIncrement.plugin, 'message');

export default mongoose.model('message', schema);
