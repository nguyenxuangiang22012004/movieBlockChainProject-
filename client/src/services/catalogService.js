import api from "../config/axios.js";

export const getAll = async () => {
  try {
    
    const response = await api.get("/catalog");
    
    // Nếu response.data là mảng, chuyển thành định dạng { success: true, data: [...] }
    if (Array.isArray(response.data)) {
      return { success: true, data: response.data};
    }
    
    // Kiểm tra response có hợp lệ không
    if (!response?.data || typeof response.data !== 'object') {
      throw new Error('API response is invalid or empty');
    }
    
    // Kiểm tra success và data
    if (!response.data.success || !Array.isArray(response.data.data)) {
      throw new Error('API response does not contain valid data array');
    }
    
    return response.data;
    
  } catch (error) {
    console.error('💥 API Error in catalogService:', error.message);
    console.error('🔍 Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack,
    });
    
    throw new Error(error.response?.data?.message || error.message || 'Lỗi không xác định khi gọi API');
  }
};


export const getCatalogItemById = async (id) => {
  try {
    
    const response = await api.get(`/catalog/${id}`);

    // Kiểm tra response có hợp lệ không
    if (!response?.data || typeof response.data !== 'object') {
      console.error('❌ Response or response.data is invalid');
      throw new Error('API response is invalid or empty');
    }

    // ✅ FIX: Kiểm tra xem response.data có phải là object với success và data không
    // Nếu response.data ĐÃ có success: true và data thì trả về
    if (response.data.success === true && response.data.data) {
      return response.data;
    }
    
    // Nếu response.data TRỰC TIẾP chứa dữ liệu movie (_id, title, etc.)
    // thì wrap nó vào format { success: true, data: ... }
    if (response.data._id || response.data.title) {
      return { success: true, data: response.data };
    }

    // Nếu không match case nào
    console.error('📢 Unexpected response format:', response.data);
    console.error('📢 Full response.data:', JSON.stringify(response.data, null, 2));
    throw new Error('API response does not contain valid data');

  } catch (error) {
    console.error('💥 API Error in getCatalogItemById:', error.message);
    console.error('🔍 Error details:', {
      id,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
      stack: error.stack,
    });

    throw new Error(error.response?.data?.message || error.message || 'Lỗi không xác định khi lấy phim theo ID');
  }
};

export const getCatalog = async ({
  page = 1,
  limit = 8,
  type = "all",
  genre = "",
}) => {
  try {
    console.log("📡 getCatalog() called with:", { page, limit, type, genre });

    const params = { page, limit };
    if (type !== "all") params.type = type;
    if (genre) params.genre = genre;
    
    const response = await api.get("/catalog-bycategory", { params });

    console.log("📥 Raw response:", response);

    // ✅ Dữ liệu hợp lệ
    if (response.data?.success && Array.isArray(response.data.data)) {
      return response.data;
    }

    // ✅ Nếu server trả mảng trực tiếp
    if (Array.isArray(response.data)) {
      return {
        success: true,
        data: response.data,
        pagination: { totalPages: 1 },
      };
    }

    // ✅ Nếu server trả { items: [], pagination: {} }
    if (Array.isArray(response.data.items)) {
      return {
        success: true,
        data: response.data.items,
        pagination: response.data.pagination || { totalPages: 1 },
      };
    }

    console.error("📢 Unexpected response format:", response.data);
    throw new Error("API response does not contain valid data array");
  } catch (error) {
    console.error("💥 API Error in getCatalog:", error.message);
    console.error("🔍 Error details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack,
    });

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Lỗi không xác định khi gọi API catalog"
    );
  }
};
