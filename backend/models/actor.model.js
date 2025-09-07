// Sử dụng 'import'
import mongoose from 'mongoose';

const actorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    career: String,
    height: String,
    birth_date: Date,
    birth_place: String,
    zodiac: String,
    avatar_url: String,
    photos: [String], 
}, {
    timestamps: true
});

const Actor = mongoose.model('Actor', actorSchema);

// Sử dụng 'export default'
export default Actor;