import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { create } from 'kubo-rpc-client';

// Dữ liệu ban đầu (bạn có thể lấy từ API sau này)
const initialItemsData = [
    { id: 11, title: 'I Dream in Another Language', rating: 7.9, category: 'Movie', views: 1392, status: 'Visible', created: '05.02.2023' },
    { id: 12, title: 'The Forgotten Road', rating: 7.1, category: 'Movie', views: 1093, status: 'Hidden', created: '05.02.2023' },
    // ... các phim còn lại
];

// Kết nối đến API của IPFS Desktop
const ipfs = create({ url: 'http://127.0.0.1:5001/api/v0' });

// --- Async Thunks ---
// Thunk để fetch dữ liệu ban đầu (giả lập gọi API)
export const fetchItems = createAsyncThunk('items/fetchItems', async () => {
    // Trong thực tế, bạn sẽ gọi API ở đây:
    // const response = await fetch('/api/movies');
    // return await response.json();
    return Promise.resolve(initialItemsData);
});

// Thunk để thêm một item mới (bao gồm cả upload IPFS và gọi API)
export const addNewItem = createAsyncThunk('items/addNewItem', async (formData) => {
    // 1. Upload file lên IPFS
    let coverImageCid = null;
    if (formData.coverImage) {
        const result = await ipfs.add(formData.coverImage);
        coverImageCid = result.cid;
    }
    
    let videoCid = null;
    if (formData.itemType === 'movie' && formData.video) {
        const result = await ipfs.add(formData.video);
        videoCid = result.cid;
    }

    // 2. Chuẩn bị dữ liệu để gửi lên backend
    const moviePayload = {
        title: formData.title,
        description: formData.description,
        cover_image_url: coverImageCid ? `http://127.0.0.1:8080/ipfs/${coverImageCid.toString()}` : '',
        video_source: { cid: videoCid ? videoCid.toString() : '' },
        status: 'Visible',
        // ... các trường khác từ formData
    };

    // 3. Gọi API backend để lưu phim
    // const response = await fetch('/api/movies', { method: 'POST', ... });
    // const savedItem = await response.json();
    // return savedItem;

    // --- Giả lập dữ liệu trả về từ backend ---
    const savedItemForUI = {
        id: Date.now(),
        title: moviePayload.title,
        rating: 0,
        category: formData.itemType === 'movie' ? 'Movie' : 'TV Series',
        views: 0,
        status: 'Visible',
        created: new Date().toLocaleDateString('en-GB'), // dd.mm.yyyy
    };
    
    return savedItemForUI;
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
            .addCase(fetchItems.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Xử lý addNewItem
            .addCase(addNewItem.pending, (state, action) => {
                // Bạn có thể set một trạng thái submitting riêng nếu muốn
                state.status = 'loading';
            })
            .addCase(addNewItem.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Thêm item mới vào đầu mảng
                state.data.unshift(action.payload);
            })
            .addCase(addNewItem.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default itemsSlice.reducer;