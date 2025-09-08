import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { create } from 'kubo-rpc-client';
import axios from '../config/axios.js';

const ipfs = create({ url: 'http://127.0.0.1:5001/api/v0' });

export const fetchItems = createAsyncThunk('items/fetchItems', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/movies');
        return response.data.map(item => ({ ...item, id: item._id }));
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data.message || 'Could not fetch items');
        } else {
            return rejectWithValue(error.message || 'Network error or server is not responding');
        }
    }
});

export const addNewMovie = createAsyncThunk('items/addNewMovie', async (formData, { rejectWithValue }) => {
    try {
        // 1. Upload ảnh bìa lên IPFS
        let coverImageCid = null;
        if (formData.coverImage) {
            const result = await ipfs.add(formData.coverImage);
            coverImageCid = result.cid;
        }

        // 2. Upload video chính của phim lên IPFS
        let videoCid = null;
        if (formData.video) {
            const result = await ipfs.add(formData.video);
            videoCid = result.cid;
        } else {
            // Nếu schema backend yêu cầu phải có video, bạn phải báo lỗi ở đây
            return rejectWithValue('Video file is required for a movie.');
        }

        // 3. Chuẩn bị payload để gửi lên backend theo movieSchema
        const moviePayload = {
            title: formData.title,
            description: formData.description,
            cover_image_url: coverImageCid ? `http://127.0.0.1:8080/ipfs/${coverImageCid}` : '',
            background_image_url: formData.backgroundLink,
            release_year: new Date(formData.premiereDate).getFullYear() || new Date().getFullYear(),
            running_time: parseInt(formData.runningTime, 10) || 0,
            age_rating: formData.age,
            quality: formData.quality, // phải là 1 trong ['HD 1080','HD 720','DVD','TS','FULLHD']
            genres: formData.genres, // ở đây phải là mảng ObjectId, không phải string
            director: formData.directorId, // phải là 1 ObjectId hợp lệ
            cast: formData.castIds, // mảng ObjectId hợp lệ
            country: formData.countries.join(', '),
            video_source: { cid: videoCid.toString() },
            status: 'Visible'
        };

        // 4. Gửi payload lên API endpoint cho movie
        const response = await axios.post('/movies', moviePayload);
        const savedItem = response.data;
        return { ...savedItem, id: savedItem._id };

    } catch (error) {
        // Xử lý lỗi an toàn
        console.error("Error adding new movie:", error);
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data.message);
        } else {
            return rejectWithValue(error.message || 'A network error occurred while adding the movie.');
        }
    }
});

/**
 * Thunk MỚI: Chỉ để thêm TV Series
 */
export const addNewTVSeries = createAsyncThunk('items/addNewTVSeries', async (formData, { rejectWithValue }) => {
    try {
        // 1. Upload ảnh bìa chính của TV Series
        let coverImageCid = null;
        if (formData.coverImage) {
            const result = await ipfs.add(formData.coverImage);
            coverImageCid = result.cid;
        }

        // 2. Xử lý upload video cho từng tập phim và tạo cấu trúc seasons
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
                            video_source: {
                                cid: result.cid.toString()
                            }
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

        // 3. Chuẩn bị payload chính cho TV Series
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

        // 4. Gửi payload lên API endpoint cho TV Series
        // LƯU Ý: Endpoint có thể là '/tvseries' hoặc tương tự
        const response = await axios.post('/tvseries', tvSeriesPayload);
        const savedItem = response.data;
        return { ...savedItem, id: savedItem._id };

    } catch (error) {
        // Xử lý lỗi an toàn
        console.error("Error adding new TV series:", error);
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data.message);
        } else {
            return rejectWithValue(error.message || 'A network error occurred while adding the TV series.');
        }
    }
});


const itemsSlice = createSlice({
    name: 'items',
    initialState: {
        data: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers(builder) {
        builder
            // Xử lý fetchItems
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