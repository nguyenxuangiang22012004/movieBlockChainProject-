import api from "../config/axios.js";

export const getAll = async () => {
  try {
    console.log('📡 catalogService.getAll() called');
    
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
    console.log('📡 catalogService.getCatalogItemById() called for ID:', id);
    
    const response = await api.get(`/catalog/${id}`);
    
    // ✅ LOG CHI TIẾT
    console.log('📥 Raw API response:', response);
    console.log('📦 response.data:', JSON.stringify(response.data, null, 2));
    console.log('🎯 Type of response.data:', typeof response.data);
    console.log('🔑 Keys in response.data:', Object.keys(response.data || {}));

    // Kiểm tra response có hợp lệ không
    if (!response?.data || typeof response.data !== 'object') {
      console.error('❌ Response or response.data is invalid');
      throw new Error('API response is invalid or empty');
    }

    // ✅ FIX: Kiểm tra xem response.data có phải là object với success và data không
    // Nếu response.data ĐÃ có success: true và data thì trả về
    if (response.data.success === true && response.data.data) {
      console.log('✅ Valid response format: { success: true, data: {...} }');
      return response.data;
    }
    
    // Nếu response.data TRỰC TIẾP chứa dữ liệu movie (_id, title, etc.)
    // thì wrap nó vào format { success: true, data: ... }
    if (response.data._id || response.data.title) {
      console.log('🔄 Wrapping direct data into { success: true, data: ... }');
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

export const getCatalog = async ({ page = 1, limit = 8, type = "all" }) => {
  try {
    console.log("📡 catalogService.getCatalog() called with:", { page, limit, type });

    const params = { page, limit };
    if (type !== "all") params.type = type;

    const response = await api.get("/catalog-bycategory", { params });

    console.log("📥 Raw response:", response);

    // ✅ Kiểm tra response có hợp lệ không
    if (!response?.data || typeof response.data !== "object") {
      throw new Error("API response is invalid or empty");
    }

    // ✅ Trường hợp chuẩn { success: true, data: [...], pagination: {...} }
    if (response.data.success && Array.isArray(response.data.data)) {
      console.log("✅ Valid catalog response format detected");
      return response.data;
    }

    // ✅ Trường hợp API trả về mảng trực tiếp
    if (Array.isArray(response.data)) {
      console.log("🔄 Wrapping array data into standard format");
      return {
        success: true,
        data: response.data,
        pagination: { totalPages: 1 },
      };
    }

    // ✅ Trường hợp trả về { items: [], pagination: {} }
    if (Array.isArray(response.data.items)) {
      console.log("🔄 Wrapping 'items' data into standard format");
      return {
        success: true,
        data: response.data.items,
        pagination: response.data.pagination || { totalPages: 1 },
      };
    }

    console.error("📢 Unexpected response format:", response.data);
    throw new Error("API response does not contain valid data array");

  } catch (error) {
    console.error("💥 API Error in catalogService.getCatalog:", error.message);
    console.error("🔍 Error details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack,
    });

    throw new Error(error.response?.data?.message || error.message || "Lỗi không xác định khi gọi API catalog");
  }
};