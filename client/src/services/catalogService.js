import api from "../config/axios.js";

export const getAll = async () => {
  try {
    console.log('📡 catalogService.getAll() called');
    
    const response = await api.get("/catalog");
    console.log('📨 Full API response:', JSON.stringify(response, null, 2));
    console.log('📊 Response status:', response.status);
    console.log('📦 Response data:', response.data);
    
    // Nếu response.data là mảng, chuyển thành định dạng { success: true, data: [...] }
    if (Array.isArray(response.data)) {
      return { success: true, data: response.data };
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