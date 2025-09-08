import * as tvSeriesService from "../../services/upload/uploadTVSeries.js";

export const createTVSeries = async (req, res) => {
    try {
        const tvSeriesData = req.body;
        const result = await tvSeriesService.createTVSeries(tvSeriesData);
        if (result.success) {
            res.status(201).json(result.data);
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error creating TV Series:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllTVSeries = async (req, res) => {
    const result = await tvSeriesService.getAllTVSeries();
    if (result.success) {
        res.status(200).json(result.data);
    } else {
        res.status(500).json({ message: result.message });
    }
};