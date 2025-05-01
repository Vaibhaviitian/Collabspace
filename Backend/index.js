import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./src/DB/index.db.js";
import { DocumentModel } from "./src/Models/Document.model.js";
import { app } from "./app.js";

dotenv.config();
app.use(cors());
app.use(express.json());

const services = createServer(app);
const io = new Server(services, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

connectDB()
  .then(() => {
    services.listen(process.env.PORT || 1000, () => {
      console.log(`⚙️ Server is running at port: ${process.env.PORT || 1000}`);
    });
  })
  .catch((err) => {
    console.error(`MongoDB connection error: ${err}`);
  });
