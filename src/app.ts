import express, { Application, Request, Response } from 'express';
// const express = require('express');
import cors from 'cors';
import { studentRoutes } from './app/modules/student/student.route';

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// api/v1/students/create-student
app.use('/api/v1/students', studentRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World From Khaled!');
});

export default app;
