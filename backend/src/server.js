import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import loanRoutes from "./routes/loanRoutes.js";
import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);



dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use("/loans", loanRoutes);

// test route
app.get("/", (req, res) => {
  res.status(200).send("Personal Loan Planners Backend running");
});

const PORT = process.env.PORT || 5555;

// connect DB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port: ${PORT}`);
    console.log(`🌐 http://localhost:${PORT}`);
  });
});
