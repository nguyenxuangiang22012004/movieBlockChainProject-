// models/TVSeries.js
import mongoose from "mongoose";

const { Schema } = mongoose;

// Schema con cho từng tập phim
const episodeSchema = new Schema({
  episode_number: { type: Number, required: true },
  title: { type: String, required: true },
  air_date: Date,
  video_source: {
    type: { type: String, default: "ipfs" },
    cid: { type: String, required: true },
    subtitles: [
      {
        language: String,
        cid: String,
      },
    ],
  },
});

// Schema con cho từng mùa
const seasonSchema = new Schema({
  season_number: { type: Number, required: true },
  title: String,
  episodes: [episodeSchema], // Mảng các tập phim
});

// Schema chính cho phim bộ
const tvSeriesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    cover_image_url: String,
    release_year: Number,
    genres: [String],
    cast: [String],
    seasons: [seasonSchema],
    category: {
      type: String,
      default: "TVSeries",
    },
    status: {
      type: String,
      enum: ["Visible", "Hidden"],
      default: "Visible",
    },
  },
  {
    timestamps: true,
  }
);

const TVSeries = mongoose.model("TVSeries", tvSeriesSchema);

export default TVSeries;
