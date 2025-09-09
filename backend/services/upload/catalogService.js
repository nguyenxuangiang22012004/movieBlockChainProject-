import Movie from "../../models/movie.model.js";
import TVSeries from "../../models/tvSeries.model.js";

export const getCatalog = async () => {
  try {
    const movies = await Movie.find().lean();
    const tvSeries = await TVSeries.find().lean();

    // Chuẩn hóa dữ liệu về chung 1 dạng
    const formattedMovies = movies.map((m) => ({
      id: m._id,
      title: m.title,
      rating: m.rating || 0,
      category: "Movie",
      views: m.views || 0,
      status: m.status,
      createdAt: m.createdAt,
    }));

    const formattedSeries = tvSeries.map((s) => ({
      id: s._id,
      title: s.title,
      rating: 0, // TVSeries không có rating thì để mặc định
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
    { new: true, runValidators: false } // new: true trả về bản ghi sau khi update
  );

  if (!updatedItem) {
    throw new Error(`${type} not found`);
  }

  return updatedItem;
};
