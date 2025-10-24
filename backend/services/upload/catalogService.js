import Movie from "../../models/movie.model.js";
import TVSeries from "../../models/tvSeries.model.js";

export const getCatalogByCategory = async (type, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    let movies = [];
    let tvSeries = [];
    let total = 0;


    // ✅ Nếu có type, tạo regex để không phân biệt hoa thường
    const typeRegex = type ? new RegExp(`^${type}$`, "i") : null;

    // ✅ Nếu type = movie → chỉ lấy từ Movie
    if (!type || typeRegex.test("movie")) {
      const movieQuery = type ? { category: typeRegex } : {};
      const movieCount = await Movie.countDocuments(movieQuery);
      const movieData = await Movie.find(movieQuery)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 })
        .lean();

      total += movieCount;
      movies = movieData;
    }

    // ✅ Nếu type = tvseries → chỉ lấy từ TVSeries
    if (!type || typeRegex.test("tvseries")) {
      const tvQuery = type ? { category: typeRegex } : {};
      const tvCount = await TVSeries.countDocuments(tvQuery);
      const tvData = await TVSeries.find(tvQuery)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 })
        .lean();

      total += tvCount;
      tvSeries = tvData;
    }

    // ✅ Format dữ liệu trả về
    const formattedMovies = movies.map((m) => ({
      id: m._id,
      title: m.title,
      description: m.description,
      cover_image_url: m.cover_image_url,
      background_image_url: m.background_image_url,
      release_year: m.release_year,
      running_time: m.running_time,
      age_rating: m.age_rating,
      quality: m.quality,
      genres: m.genres,
      actors: m.actors,
      director: m.director,
      country: m.country,
      video_source: m.video_source,
      imdb_rating: m.imdb_rating || 0,
      category: "movie",
      views: m.views || 0,
      status: m.status,
      createdAt: m.createdAt,
    }));

    const formattedSeries = tvSeries.map((s) => ({
      id: s._id,
      title: s.title,
      description: s.description,
      cover_image_url: s.cover_image_url,
      background_image_url: s.background_image_url,
      release_year: s.release_year,
      running_time: s.running_time,
      genres: s.genres,
      directors: s.directors,
      actors: s.actors,
      seasons: s.seasons,
      age_rating: s.age_rating,
      rating: 0,
      category: "tvseries",
      views: 0,
      status: s.status,
      createdAt: s.createdAt,
    }));

    // ✅ Gộp dữ liệu tuỳ theo type
    let data = [];
    if (typeRegex?.test("movie")) data = formattedMovies;
    else if (typeRegex?.test("tvseries")) data = formattedSeries;
    else data = [...formattedMovies, ...formattedSeries];

    // ✅ Trả về kết quả
    return {
      success: true,
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("❌ getCatalog error:", error);
    return { success: false, message: error.message };
  }
};

export const getCatalog = async () => {
  try {
    const movies = await Movie.find().lean();
    const tvSeries = await TVSeries.find().lean();

    const formattedMovies = movies.map((m) => ({
      id: m._id,
      title: m.title,
      description: m.description,
      cover_image_url: m.cover_image_url,
      background_image_url: m.background_image_url,
      release_year: m.release_year,
      running_time: m.running_time,
      age_rating: m.age_rating,
      quality: m.quality,
      genres: m.genres, // Array of strings
      actors: m.actors, // Array of strings
      director: m.director, // Single string
      country: m.country,
      video_source: m.video_source,
      imdb_rating: m.imdb_rating || 0,
      category: "Movie",
      views: m.views || 0,
      status: m.status,
      createdAt: m.createdAt,
    }));

    const formattedSeries = tvSeries.map((s) => ({
      id: s._id,
      title: s.title,
      description: s.description,
      background_image_url: s.background_image_url,
      cover_image_url: s.cover_image_url,
      release_year: s.release_year,
      running_time: s.running_time,
      genres: s.genres, // Array of strings
      directors: s.directors, // Array of strings (khác với Movie)
      actors: s.actors, // Array of strings
      seasons: s.seasons,
      age_rating: s.age_rating,
      rating: 0,
      category: "TVSeries",
      views: 0,
      status: s.status,
      createdAt: s.createdAt,
    }));

    return { success: true, data: [...formattedMovies, ...formattedSeries] };
  } catch (error) {
    return { success: false, message: error.message };
  }
};


export const updateStatusCatalog = async (type, id, status) => {
  let Model;

  if (type === "movies") {
    Model = Movie;
  } else if (type === "tvseries") {
    Model = TVSeries;
  } else {
    throw new Error("Invalid type");
  }

  const updatedItem = await Model.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: false }
  );

  if (!updatedItem) {
    throw new Error(`${type} not found`);
  }

  return updatedItem;
};

export const getCatalogItemById = async (id) => {
  try {
    let item = await Movie.findById(id).lean();
    if (item) {
      return { success: true, data: { ...item, category: "Movie" } };
    }
    item = await TVSeries.findById(id).lean();
    if (item) {
      return { success: true, data: { ...item, category: "TVSeries" } };
    }
    return { success: false, message: "Item not found" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateCatalogItem = async (id, updateData) => {
  try {
    let item = await Movie.findById(id);
    if (item) {
      Object.assign(item, updateData);
      await item.save();
      return { success: true, data: item };
    }
    item = await TVSeries.findById(id);
    if (item) {
      Object.assign(item, updateData);
      await item.save();
      return { success: true, data: item };
    }
    return { success: false, message: "Item not found" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const deleteCatalogItem = async (id) => {
  try {
    let item = await Movie.findByIdAndDelete(id);
    if (item) {
      return { success: true, data: { ...item.toObject(), category: "Movie" } };
    }
    item = await TVSeries.findByIdAndDelete(id);
    if (item) {
      return { success: true, data: { ...item.toObject(), category: "TVSeries" } };
    }
    return { success: false, message: "Item not found" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

