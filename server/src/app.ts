import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import { connectToDatabase } from "./config/db";

import indexRouter from "./routes/index";
import usersRouter from "./routes/users";
import authHandler from "./routes/auth/authHandler";
import spotifyHandler from "./routes/spotify/spotifyHandler";
import youtubeHandler from "./routes/spotify/youtube";
import cveHandler from "./routes/cve/cveHandler";

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "Content-Disposition"],
  exposedHeaders: ["Content-Disposition"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests
app.use(express.json());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authHandler);
app.use("/spotify", spotifyHandler);
app.use("/youtube", youtubeHandler);
app.use("/cve", cveHandler);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectToDatabase().catch(console.error);
});

export default app;
