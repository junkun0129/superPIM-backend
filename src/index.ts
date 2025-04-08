import express from "express";
import http from "http";
import cors from "cors";
import path from "path";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route";
import productRoute from "./routes/product.route";
// Load environment variables
dotenv.config();

// Initialize express app and HTTP server
const app = express();
const server = http.createServer(app);

// Middleware
app.use(fileUpload());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes

app.use("/auth", authRoute);
app.use("/product", productRoute);

// Start server
server.listen(3000, () => {
  console.log("listen....");
});
