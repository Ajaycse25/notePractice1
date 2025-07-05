const mongoose = require('mongoose');
const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;
