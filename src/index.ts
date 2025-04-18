import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route";
import productRoute from "./routes/product.route";
import categoryRoute from "./routes/category.route";
import workspaceRoute from "./routes/workspace.route";
import headerRoute from "./routes/header.route";
import attrpclRoute from "./routes/attrpcl.route";
import assetRoute from "./routes/asset.route";
// Load environment variables
dotenv.config();

// Initialize express app and HTTP server
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/auth", authRoute);
app.use("/product", productRoute);
app.use("/category", categoryRoute);
app.use("/workspace", workspaceRoute);
app.use("/header", headerRoute);
app.use("/atp", attrpclRoute);
app.use("/assets", assetRoute);

// Start server
server.listen(3000, () => {
  console.log("listen....");
});
