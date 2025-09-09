import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { create } from 'kubo-rpc-client';
import axios from '../config/axios.js';

const ipfs = create({ url: 'http://127.0.0.1:5001/api/v0' });

/**
 * Fetch danh sách items
 */
export const fetchItems = createAsyncThunk("items/fetchItems", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get("/catalog");
        return response.data;
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
 * Add Movie
 */
export const addNewMovie = createAsyncThunk('items/addNewMovie', async (formData, { rejectWithValue }) => {
    try {
        let coverImageCid = null;
        if (formData.coverImage) {
            const result = await ipfs.add(formData.coverImage);
            coverImageCid = result.cid;
        }

        let videoCid = null;
        if (formData.video) {
            const result = await ipfs.add(formData.video);
            videoCid = result.cid;
        } else {
            return rejectWithValue('Video file is required for a movie.');
        }

        const moviePayload = {
            title: formData.title,
            description: formData.description,
            cover_image_url: coverImageCid ? `http://127.0.0.1:8080/ipfs/${coverImageCid}` : '',
            background_image_url: formData.backgroundLink,
            release_year: new Date(formData.premiereDate).getFullYear() || new Date().getFullYear(),
            running_time: parseInt(formData.runningTime, 10) || 0,
            age_rating: formData.age,
            quality: formData.quality,
            genres: formData.genres,
            director: formData.directorId,
            cast: formData.castIds,
            country: formData.countries.join(', '),
            video_source: { cid: videoCid.toString() },
            status: 'Visible'
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

export const addNewTVSeries = createAsyncThunk('items/addNewTVSeries', async (formData, { rejectWithValue }) => {
    try {
        let coverImageCid = null;
        if (formData.coverImage) {
            const result = await ipfs.add(formData.coverImage);
            coverImageCid = result.cid;
        }

        const seasonsPayload = await Promise.all(
            formData.seasons.map(async (season, seasonIndex) => {
                const episodesPayload = await Promise.all(
                    season.episodes.map(async (episode, episodeIndex) => {
                        if (!episode.video) {
                            throw new Error(`Video for Season ${seasonIndex + 1}, Episode ${episodeIndex + 1} is missing.`);
                        }
                        const result = await ipfs.add(episode.video);
                        return {
                            episode_number: episodeIndex + 1,
                            title: episode.title,
                            air_date: episode.airDate,
                            video_source: { cid: result.cid.toString() }
                        };
                    })
                );
                return {
                    season_number: seasonIndex + 1,
                    title: season.title,
                    episodes: episodesPayload
                };
            })
        );

        const tvSeriesPayload = {
            title: formData.title,
            description: formData.description,
            cover_image_url: coverImageCid ? `http://127.0.0.1:8080/ipfs/${coverImageCid.toString()}` : '',
            release_year: new Date(formData.premiereDate).getFullYear() || new Date().getFullYear(),
            genres: formData.genres,
            cast: formData.actors,
            seasons: seasonsPayload,
            status: 'Visible'
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
            const res = await axios.put(`/items/${id}`, data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update item");
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
            // fetchItems
            .addCase(fetchItems.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // updateItemStatus
            .addCase(updateItemStatus.fulfilled, (state, action) => {
                const index = state.data.findIndex((i) => i._id === action.payload._id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            // ✅ đưa updateItem.fulfilled lên đây
            .addCase(updateItem.fulfilled, (state, action) => {
                const idx = state.data.findIndex(
                    (i) => i.id === action.payload.id || i._id === action.payload._id
                );
                if (idx !== -1) {
                    state.data[idx] = action.payload;
                }
            })
            // add movie/tv
            .addMatcher(
                (action) => action.type === addNewMovie.pending.type || action.type === addNewTVSeries.pending.type,
                (state) => {
                    state.status = 'loading';
                    state.error = null;
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
                (action) => action.type === addNewMovie.rejected.type || action.type === addNewTVSeries.rejected.type,
                (state, action) => {
                    state.status = 'failed';
                    state.error = action.payload;
                }
            );
        }
});

export default itemsSlice.reducer;
