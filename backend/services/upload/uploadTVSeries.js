import TVSeries from "../../models/tvSeries.model.js";

export const createTVSeries = async (seriesData) => {
    try {
        const newSeries = new TVSeries(seriesData);
        await newSeries.save();
        return { success: true, data: newSeries };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const getAllTVSeries = async () => {
    try {
        const series = await TVSeries.find().sort({ createdAt: -1 });
        return { success: true, data: series };
    } catch (error) {
        return { success: false, message: error.message };
    }
};
