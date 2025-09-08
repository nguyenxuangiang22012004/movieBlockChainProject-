import Movie from '../../models/movie.model.js';

export const createMovie = async (movieData) => {
    try {
        const newMovie = new Movie(movieData);
        await newMovie.save();
        return { success: true, data: newMovie };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const getMovie = async () => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 });
        return { success: true, data: movies };
    } catch (error) {
        return { success: false, message: error.message };
    }
}