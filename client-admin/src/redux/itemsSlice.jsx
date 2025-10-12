// redux/itemsSlice.jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { create } from 'kubo-rpc-client';
import axios from '../config/axios.js';
import { catalogService } from '../services/catalogService.js';

const ipfs = create({ url: 'http://127.0.0.1:5001/api/v0' });

export const fetchItems = createAsyncThunk("items/fetchItems", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get("/catalog");
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data.message);
        } else {
            return rejectWithValue(error.message || "Failed to fetch catalog");
        }
    }
});

/**
 * Update status (Visible/Hidden) cho Movie
 */
export const updateItemStatus = createAsyncThunk(
    "items/updateItemStatus",
    async ({ type, id, status }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`/${type}/${id}/status`, { status });
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message || "Failed to update status");
            }
        }
    }
);

/**
 * Helper function to upload video sources to IPFS
 */
const uploadVideoSources = async (videoSources) => {
    const sources = {};
    
    // Upload 1080p
    if (videoSources['1080p']) {
        const result = await ipfs.add(videoSources['1080p']);
        sources['1080p'] = result.cid.toString();
    }
    
    // Upload 720p
    if (videoSources['720p']) {
        const result = await ipfs.add(videoSources['720p']);
        sources['720p'] = result.cid.toString();
    }
    
    // Upload 480p
    if (videoSources['480p']) {
        const result = await ipfs.add(videoSources['480p']);
        sources['480p'] = result.cid.toString();
    }
    
    // Upload HLS
    if (videoSources['hls']) {
        const result = await ipfs.add(videoSources['hls']);
        sources['hls'] = result.cid.toString();
    }
    
    return sources;
};

/**
 * Add Movie with multiple quality support
 */
export const addNewMovie = createAsyncThunk('items/addNewMovie', async (formData, { rejectWithValue }) => {
    try {
        // Upload cover image
        let coverImageCid = null;
        if (formData.coverImage) {
            const result = await ipfs.add(formData.coverImage);
            coverImageCid = result.cid;
        }

        // Upload video sources (multiple qualities)
        const videoSources = await uploadVideoSources(formData.videoSources);
        
        // Check if at least one video source is uploaded
        if (Object.keys(videoSources).length === 0) {
            return rejectWithValue('At least one video quality is required for a movie.');
        }

        const moviePayload = {
            title: formData.title,
            description: formData.description,
            cover_image_url: coverImageCid ? `http://127.0.0.1:8080/ipfs/${coverImageCid}` : '',
            background_image_url: formData.backgroundLink,
            release_year: formData.release_year,
            running_time: parseInt(formData.runningTime, 10) || 0,
            age_rating: formData.age,
            quality: formData.quality,
            genres: formData.genres, // Array
            director: formData.director, // String for Movie
            actors: formData.actors, // Array
            country: formData.country, // String for Movie
            video_source: {
                type: 'ipfs',
                sources: videoSources,
                subtitles: []
            },
            status: formData.status || 'Visible'
        };

        const response = await axios.post('/movies', moviePayload);
        const savedItem = response.data;
        return { ...savedItem, id: savedItem._id };

    } catch (error) {
        console.error("Error adding new movie:", error);
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data.message);
        } else {
            return rejectWithValue(error.message || 'A network error occurred while adding the movie.');
        }
    }
});

/**
 * Add TV Series with multiple quality support
 */
export const addNewTVSeries = createAsyncThunk('items/addNewTVSeries', async (formData, { rejectWithValue }) => {
    try {
        // Upload cover image
        let coverImageCid = null;
        if (formData.coverImage) {
            const result = await ipfs.add(formData.coverImage);
            coverImageCid = result.cid;
        }

        // Process seasons and episodes
        const seasonsPayload = await Promise.all(
            formData.seasons.map(async (season, seasonIndex) => {
                const episodesPayload = await Promise.all(
                    season.episodes.map(async (episode, episodeIndex) => {
                        // Upload video sources for each episode
                        const videoSources = await uploadVideoSources(episode.videoSources);
                        
                        // Check if at least one video source is uploaded
                        if (Object.keys(videoSources).length === 0) {
                            throw new Error(`At least one video quality is required for Season ${seasonIndex + 1}, Episode ${episodeIndex + 1}.`);
                        }
                        
                        return {
                            episode_number: episodeIndex + 1,
                            title: episode.title,
                            air_date: episode.airDate,
                            video_source: {
                                type: 'ipfs',
                                sources: videoSources,
                                subtitles: []
                            }
                        };
                    })
                );
                
                return {
                    season_number: seasonIndex + 1,
                    title: season.title,
                    info: season.info,
                    episodes: episodesPayload
                };
            })
        );

        const tvSeriesPayload = {
            title: formData.title,
            description: formData.description,
            cover_image_url: coverImageCid ? `http://127.0.0.1:8080/ipfs/${coverImageCid.toString()}` : '',
            background_image_url: formData.backgroundLink,
            release_year: formData.release_year,
            running_time: parseInt(formData.runningTime, 10) || 0,
            age_rating: formData.age,
            genres: formData.genres, // Array
            directors: formData.directors, // Array for TVSeries
            actors: formData.actors, // Array
            seasons: seasonsPayload,
            status: formData.status || 'Visible'
        };

        const response = await axios.post('/tvseries', tvSeriesPayload);
        const savedItem = response.data;
        return { ...savedItem, id: savedItem._id };

    } catch (error) {
        console.error("Error adding new TV series:", error);
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data.message);
        } else {
            return rejectWithValue(error.message || 'A network error occurred while adding the TV series.');
        }
    }
});

export const updateItem = createAsyncThunk(
    "items/updateItem",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await axios.put(`/catalog/${id}`, data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update item");
        }
    }
);

export const deleteItem = createAsyncThunk(
    "items/deleteItem",
    async (id, { rejectWithValue }) => {
        try {
            await catalogService.deleteItem(id);
            return id;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message || "Failed to delete item");
            }
        }
    }
);

const itemsSlice = createSlice({
    name: 'items',
    initialState: {
        data: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchItems.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateItemStatus.fulfilled, (state, action) => {
                const index = state.data.findIndex((i) => i._id === action.payload._id);
                if (index !== -1) {
                    state.data[index].status = action.payload.status;
                }
            })
            .addCase(updateItem.fulfilled, (state, action) => {
                const idx = state.data.findIndex(
                    (i) => i._id === action.payload._id
                );
                if (idx !== -1) {
                    state.data[idx] = { ...state.data[idx], ...action.payload };
                }
            })
            .addCase(deleteItem.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteItem.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = state.data.filter(item => 
                    (item.id || item._id) !== action.payload
                );
            })
            .addCase(deleteItem.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addMatcher(
                (action) => action.type === addNewMovie.pending.type || action.type === addNewTVSeries.pending.type || action.type === updateItem.pending.type,
                (state) => {
                    state.status = 'loading';
                }
            )
            .addMatcher(
                (action) => action.type === addNewMovie.fulfilled.type || action.type === addNewTVSeries.fulfilled.type,
                (state, action) => {
                    state.status = 'succeeded';
                    state.data.unshift(action.payload);
                }
            )
            .addMatcher(
                (action) => action.type === addNewMovie.rejected.type || action.type === addNewTVSeries.rejected.type || action.type === updateItem.rejected.type,
                (state, action) => {
                    state.status = 'failed';
                    state.error = action.payload;
                }
            )
    }
});

export default itemsSlice.reducer;