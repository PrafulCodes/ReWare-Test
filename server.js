// server.js
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model("Contact", contactSchema);

// ✅ Handle contact form POST
app.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Name, email, and message are required." });
  }

  try {
    await Contact.create({ name, email, subject, message });
    res.status(200).json({ success: true, message: "Message saved successfully." });
  } catch (err) {
    console.error("Contact save error:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// ✅ Upload product endpoint
app.post("/upload", upload.single("image"), (req, res) => {
  try {
    const { name, price } = req.body;
    const image = req.file?.filename;

    if (!name || !price || !image) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const product = { name, price, image };
    const filePath = path.join(__dirname, "products.json");
    let products = [];

    if (fs.existsSync(filePath)) {
      products = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }

    products.push(product);
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

    res.status(200).json({ message: "Product uploaded successfully!" });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Get all products
app.get("/products", (req, res) => {
  const filePath = path.join(__dirname, "products.json");
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    res.status(200).json(data);
  } else {
    res.status(200).json([]);
  }
});

// ✅ Static folders
app.use(express.static(path.join(__dirname, "Templates")));
app.use(express.static(path.join(__dirname, "Static")));
app.use('/static', express.static(path.join(__dirname, 'Static')));
app.use('/images', express.static(path.join(__dirname, 'Images')));
app.use('/templates', express.static(path.join(__dirname, 'Templates')));

// ✅ Default index.html route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Templates", "index.html"));
});

// ✅ Fixed route: use .html extension to avoid conflict with API routes
app.get("/:page.html", (req, res) => {
  const filePath = path.join(__dirname, "Templates", `${req.params.page}.html`);
  res.sendFile(filePath, function (err) {
    if (err) {
      res.status(404).send("Page not found");
    }
  });
});

// ✅ Optional: fallback 404 route
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 App is running on port ${PORT}`);
});
