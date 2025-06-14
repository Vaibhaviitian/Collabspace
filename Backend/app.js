import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "50mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);
// console.log("aaya hu app.js ");

app.use(cookieParser());

console.log("We had injected cookie parser");
app.use(express.static("Public"));

import userrouter from "./src/Routes/user.routes.js";
app.use("/api/user", userrouter);
console.log("aaya hu app.js ");

import collabroutes from "./src/Routes/other.routes.js";
app.use("/api/collabs", collabroutes);
console.log("aaya hu otherroutes ke section mein maa ke khane ki kasam ");

export { app }; 
