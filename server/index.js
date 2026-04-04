import express from "express";
import helmet from "helmet";
import cors from 'cors';
import morgan from "morgan";
import router from "./routes/index.js";
import dotenv from 'dotenv';
import authRouter from './mildleware/authentication.js';
import Serverless from "serverless";
import Serverless from "serverless";
import { app } from "../api/index.js";


dotenv.config();// Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;
const REACT_APP_URL = process.env.REACT_APP_URL || 'http://localhost:5173';


//middlewares
app.use(helmet());
//To connect to frontend Url and its methods
app.use(cors({ origin: REACT_APP_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//for static files
app.use(express.static("public"));

//routes
app.use('/', router)
app.use('/api/auth', authRouter);
app.use('/downloads', express.static('public/downloads'));



app.get("/api/index.js", (req, res) => {
  res.json({ message: "Backend working!" });
});

export default Serverless(app);
