// Sử dụng 'import'
import mongoose from 'mongoose';

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
});

const Genre = mongoose.model('Genre', genreSchema);

// Sử dụng 'export default'
export default Genre;