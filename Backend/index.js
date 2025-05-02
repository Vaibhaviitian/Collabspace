import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./src/DB/index.db.js";
import { DocumentModel } from "./src/Models/Document.model.js";
import { app } from "./app.js";
import axios from "axios";
import { access } from "fs";

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
const usersInRoom = {};
io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);
  console.log("getting quill content");
  // joining room
  socket.on("join-room", ({ docid, email, username, access }) => {
    socket.join(docid);
    console.log(docid, email, username, access);
    console.log(`User ${socket.id} joined room ${docid}`);
    if (!usersInRoom[docid]) usersInRoom[docid] = [];

    const isAlreadyPresent = usersInRoom[docid].some(
      (user) => user.socketId === socket.id
    );

    console.log(access);
    console.log(usersInRoom);
    if (!isAlreadyPresent) {
      usersInRoom[docid].push({ socketId: socket.id, username, email, access });
    } else {
      usersInRoom[docid].some((user) =>
        user.socketId === socket.id ? (user.access = access) : user.access
      );
    }
    console.log(usersInRoom);
    socket.to(docid).emit("user-joined", { username, email, access });
    io.to(docid).emit("online-users", usersInRoom[docid]);
  });

  socket.on("disconnect", () => {
    // Find which room the socket was in
    for (const docid in usersInRoom) {
      usersInRoom[docid] = usersInRoom[docid].filter((user) => {
        if (user.socketId === socket.id) {
          // Notify others in room
          socket.to(docid).emit("user-left", user.username);
          return false;
        }
        return true;
      });

      io.to(docid).emit("online-users", usersInRoom[docid]);
    }
  });

  // quill content save
  socket.on("quill-content-save", async ({ content, docid }) => {
    console.log(docid);
    try {
      const response = await axios.post(
        `http://localhost:1000/api/user/autosave`,
        {
          docid,
          content,
        }
      );
      console.log(response.data.message);
      socket.to(docid).emit("broadcast-content", content);
    } catch (error) {
      console.log(error);
    }
  });

  // quill broadcasting data

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    socket.removeAllListeners("join-room");
    socket.removeAllListeners("quill-content-save");
  });
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
