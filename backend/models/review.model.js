import mongoose from 'mongoose';

const { Schema } = mongoose; // Lấy Schema từ mongoose

const reviewSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    item_id: { type: Schema.Types.ObjectId, required: true }, // ID của Movie hoặc TVSeries
    item_type: { type: String, required: true, enum: ['Movie', 'TVSeries'] },
    rating: { type: Number, required: true, min: 1, max: 10 },
    title: String,
    content: { type: String, required: true },
}, {
    timestamps: true
});

const Review = mongoose.model('Review', reviewSchema);

// Sử dụng 'export default' thay cho 'module.exports'
export default Review;