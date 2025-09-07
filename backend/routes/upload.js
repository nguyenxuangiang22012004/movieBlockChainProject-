// routes/upload.js
import express from "express";
import fs from "fs";
import upload from "../middleware/upload.js";
import ipfs from "../services/ipfs.js";

const router = express.Router();

router.post("/", upload.single("video"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileData = fs.readFileSync(filePath);

    // Upload lên IPFS
    const result = await ipfs.add(fileData);

    // Xóa file local
    fs.unlinkSync(filePath);

    res.json({
      cid: result.cid.toString(),
      url: `http://127.0.0.1:8080/ipfs/${result.cid.toString()}`, // Local gateway
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload thất bại" });
  }
});

export default router;
