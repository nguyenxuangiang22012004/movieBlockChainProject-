import * as uploadService from "../../services/upload/uploadMovieService.js";

export const createMovie = async (req, res) => {
    try {
        const movieData = req.body;
        const result = await uploadService.createMovie(movieData);
        if (result.success) {
            res.status(201).json(result.data);
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error creating movie:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMovie = async (req, res) => {
    const result = await uploadService.getMovie();
    if (result.success) {
        res.status(200).json(result.data);
    } else {
        res.status(500).json({ message: result.message });
    }
};