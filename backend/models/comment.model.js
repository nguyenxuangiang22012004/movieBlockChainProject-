// Sử dụng 'import'
import mongoose from 'mongoose';

const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    user_id: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    item_id: { 
      type: Schema.Types.ObjectId, 
      required: true 
    },
    item_type: { 
      type: String, 
      enum: ['Movie', 'TVSeries'], 
      required: true 
    },
    content: { 
      type: String, 
      required: true, 
      trim: true 
    },
    parent_comment_id: { 
      type: Schema.Types.ObjectId, 
      ref: 'Comment', 
      default: null 
    },
    likes: { 
      type: Number, 
      default: 0, 
      min: 0 
    },
    dislikes: { 
      type: Number, 
      default: 0, 
      min: 0 
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    versionKey: false // bỏ __v
  }
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;