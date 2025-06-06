const mongoose = require('mongoose');
const { Schema, model} = mongoose;

const ProfileSchema = new Schema({
    id: { type: String, required: true },
    user: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    hotel: { type: String, required: true },
    rooms: { type: Number, required: false },
    address: { type: String, required: true },
});

module.exports = model("Profile", ProfileSchema);