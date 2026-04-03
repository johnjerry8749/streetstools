import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import router from '../server/routes/index.js';

dotenv.config();

const app = express();
const REACT_APP_URL = process.env.REACT_APP_URL || 'http://localhost:5173';

app.use(helmet());
app.use(
  cors({
    origin: REACT_APP_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

export default app;
