import * as catalogService from "../../services/upload/catalogService.js";

export const getCatalog = async (req, res) => {
  const result = await catalogService.getCatalog();
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json({ message: result.message });
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