import express from 'express';
import cors from 'cors';
import mentorRouter from './routes/mentorRoutes.js';
import studentRouter from './routes/studentRoutes.js';

// express app instance
const app = express();

// Global Middlewares
app.use(express.json());
app.use(cors());

// Default route
app.get('/', (req, res) => {
  res.status(200).json({ message: "Welcome to mentor student API" });
});

// ROUTE: MENTOR
app.use('/api/v1', mentorRouter);

// ROUTE: STUDENT
app.use('/api/v1', studentRouter);

// Wildcard route
app.all('*', (req, res) => {
  res.status(400).json({ message: `Can't ${req.method} on this ${req.originalUrl} URL.` });
});

export default app;