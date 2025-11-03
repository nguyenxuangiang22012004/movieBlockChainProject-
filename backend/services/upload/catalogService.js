import Movie from "../../models/movie.model.js";
import TVSeries from "../../models/tvSeries.model.js";
import User from "../../models/user.model.js";
export const getCatalogByCategory = async (type = "all", genre = "", page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;

    let movies = [];
    let tvSeries = [];
    let total = 0;

    // Regex để không phân biệt hoa thường (dành cho type)
    const typeRegex = type && type !== "all" ? new RegExp(`^${type}$`, "i") : null;

    // ==== MOVIE ====
    if (!typeRegex || typeRegex.test("movie")) {
      const movieQuery = {};

      // Lọc theo thể loại (match chính xác, không phân biệt hoa thường)
      if (genre) {
        movieQuery.genres = { $regex: `^${genre}$`, $options: "i" };
      }

      const movieCount = await Movie.countDocuments(movieQuery);
      const movieData = await Movie.find(movieQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      total += movieCount;
      movies = movieData.map((m) => ({
        id: m._id,
        title: m.title,
        description: m.description,
        cover_image_url: m.cover_image_url,
        background_image_url: m.background_image_url,
        release_year: m.release_year,
        running_time: m.running_time,
        genres: m.genres,
        director: m.director,
        actors: m.actors,
        country: m.country,
        age_rating: m.age_rating,
        quality: m.quality,
        imdb_rating: m.imdb_rating,
        views: m.views,
        category: "movie",
        status: m.status,
        createdAt: m.createdAt,
      }));
    }

    // ==== TV SERIES ====
    if (!typeRegex || typeRegex.test("tvseries")) {
      const tvQuery = {};

      if (genre) {
        tvQuery.genres = { $regex: `^${genre}$`, $options: "i" };
      }

      const tvCount = await TVSeries.countDocuments(tvQuery);
      const tvData = await TVSeries.find(tvQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      total += tvCount;
      tvSeries = tvData.map((s) => ({
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
        seasons: s.seasons?.length || 0,
        age_rating: s.age_rating,
        category: "tvseries",
        status: s.status,
        createdAt: s.createdAt,
      }));
    }

    // ==== GỘP DỮ LIỆU ====
    let data = [];
    if (typeRegex?.test("movie")) data = movies;
    else if (typeRegex?.test("tvseries")) data = tvSeries;
    else data = [...movies, ...tvSeries];

    // ==== TRẢ KẾT QUẢ ====
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
    console.error("❌ getCatalogByCategory error:", error);
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

export const getCatalogItemById = async (id, userId) => {
  try {
    const user = await User.findById(userId).lean();
    const planName = user?.subscriptionCache?.planName || "Basic";
    const isActive = user?.subscriptionCache?.isActive || false;
    
    // Tìm Movie hoặc TVSeries
    let item = await Movie.findById(id).lean();
    if (!item) item = await TVSeries.findById(id).lean();
    if (!item) return { success: false, message: "Item not found" };

    // Nếu chưa kích hoạt subscription thì không cho xem video
    if (!isActive) {
      return {
        success: false,
        message: "Gói đăng ký chưa kích hoạt. Hãy mua hoặc gia hạn gói của bạn.",
      };
    }

    // Lọc video_source theo planName
    if (item.video_source) {
      const filteredSources = filterSourcesByPlan(item.video_source.sources, planName);
      item.video_source.sources = filteredSources;
    }

    return { success: true, data: { ...item, category: item.category || "Unknown" } };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const filterSourcesByPlan = (sources, planName) => {
  switch (planName) {
    case "Basic":
      return { "480p": sources["480p"] };
    case "Premium":
      return { "480p": sources["480p"], "720p": sources["720p"] };
    case "Cinematic":
      return {
        "480p": sources["480p"],
        "720p": sources["720p"],
        "1080p": sources["1080p"],
        "hls": sources["hls"],
      };
    default:
      return { "480p": sources["480p"] };
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

