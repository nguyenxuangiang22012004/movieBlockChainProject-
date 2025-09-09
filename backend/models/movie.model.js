// Sử dụng 'import'
import mongoose from 'mongoose';

const { Schema } = mongoose;

const movieSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        default: "Movie"
    },
    cover_image_url: String,
    background_image_url: String,
    release_year: Number,
    running_time: Number, 
    age_rating: String,
    quality: {
        type: String,
        enum: ['HD 1080', 'HD 720', 'DVD', 'TS', 'FullHD'],
    },
    genres: [{
        type: Schema.Types.ObjectId,
        ref: 'Genre' // Tham chiếu đến model Genre
    }],
    director: {
        type: Schema.Types.ObjectId,
        ref: 'Actor' // Tham chiếu đến model Actor
    },
    cast: [{
        type: Schema.Types.ObjectId,
        ref: 'Actor' // Tham chiếu đến model Actor
    }],
    country: String,
    imdb_rating: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
    // ---- Phần quan trọng cho IPFS ----
    video_source: {
        type: {
            type: String,
            default: 'ipfs'
        },
        cid: { // Trường để lưu CID của file video chính
            type: String,
            required: true,
        },
        subtitles: [{ // Mảng lưu CID cho các file phụ đề
            language: String,
            cid: String,
        }]
    },
    // ------------------------------------
    status: {
        type: String,
        enum: ['Visible', 'Hidden'],
        default: 'Visible',
    },
}, {
    timestamps: true
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;