import * as catalogService from "../../services/upload/catalogService.js";


export const getCatalogByCategory = async (req, res) => {
  try {
    const { type = "all", genre = "", page = 1, limit = 10 } = req.query;

    const result = await catalogService.getCatalogByCategory(type, genre, Number(page), Number(limit));

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error("❌ getCatalogByCategory controller error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getCatalog = async (req, res) => {
  const result = await catalogService.getCatalog();
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json({ message: result.message });
  }
};

export const getCatalogItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await catalogService.getCatalogItemById(id);

    if (result.success) {
      // ✅ FIX: Trả về cả object result thay vì chỉ result.data
      res.status(200).json(result);
    } else {
      res.status(404).json({ success: false, message: result.message });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStatusCatalog = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { status } = req.body;

    const updatedItem = await catalogService.updateStatusCatalog(type, id, status);

    res.json(updatedItem);
  } catch (err) {
    console.error("Update status error:", err.message);
    if (err.message.includes("not found")) {
      return res.status(404).json({ message: err.message });
    }
    if (err.message.includes("Invalid type")) {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCatalogItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const result = await catalogService.updateCatalogItem(id, updateData);

    if (result.success) {
      // ✅ Có thể trả về result hoặc result.data, tùy frontend xử lý
      res.status(200).json(result);
    } else {
      res.status(404).json({ success: false, message: result.message });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCatalogItem = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await catalogService.deleteCatalogItem(id);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ success: false, message: result.message });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


