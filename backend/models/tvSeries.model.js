// models/TVSeries.js
import mongoose from "mongoose";

const { Schema } = mongoose;


const videoSourceSchema = new Schema({
  type: { type: String, default: "ipfs" },
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

const episodeSchema = new Schema({
  episode_number: { type: Number, required: true },
  title: { type: String, required: true },
  air_date: Date,
  video_source: videoSourceSchema,
});

const seasonSchema = new Schema({
  season_number: { type: Number, required: true },
  title: String,
  info: { type: String, required: true },
  episodes: [episodeSchema],
});

const tvSeriesSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  background_image_url: String,
  cover_image_url: String,
  release_year: { type: Date, required: true },
  running_time: { type: Number, required: true, min: 1 },
  genres: [String],
  directors: [String],
  actors: [String],
  seasons: [seasonSchema],
  category: { type: String, default: "TVSeries" },
  age_rating: String,
  imdb_rating: {
    type: Number,
    default: 7,
  },
  status: {
    type: String,
    enum: ["Visible", "Hidden"],
    default: "Visible",
  },
}, { timestamps: true });


const TVSeries = mongoose.model("TVSeries", tvSeriesSchema);
export default TVSeries;