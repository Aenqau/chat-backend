import mongoose from 'mongoose';

import autoIncrement from 'mongoose-auto-increment';

autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;

// GET /users

const schema = new Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

schema.plugin(autoIncrement.plugin, 'message');

export default mongoose.model('user', schema);
