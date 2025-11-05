// Sử dụng 'import'
import mongoose from 'mongoose';

const { Schema } = mongoose;

const videoSourceSchema = new Schema({
  type: { type: String, default: 'ipfs' },
  sources: {
    '1080p': String,
    '720p': String,
    '480p': String,
    'hls': String, 
  },
  subtitles: [
    {
      language: String,
      cid: String,
    },
  ],
});

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
    release_year: {
        type: Date, 
        required: true,
    },
    running_time: {
        type: Number, 
        required: true,
        min: 1
    },
    age_rating: String,
    quality: {
        type: String,
        enum: ['HD 1080', 'HD 720', 'DVD', 'TS', 'FullHD'],
    },
    // ---- THAY ĐỔI BẮT ĐẦU TỪ ĐÂY ----
    genres: [String], // THAY ĐỔI: Chấp nhận một mảng các chuỗi tên thể loại

    director: String, // THAY ĐỔI: Chấp nhận một chuỗi tên đạo diễn (hoặc nhiều tên nối lại)

    actors: [String],   // THAY ĐỔI: Chấp nhận một mảng các chuỗi tên diễn viên
    // ---- THAY ĐỔI KẾT THÚC TẠI ĐÂY ----
    country: String,
    rating: {
        type: Number,
        default: 8,
    },
    views: {
        type: Number,
        default: 0,
    },
    video_source: videoSourceSchema,
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