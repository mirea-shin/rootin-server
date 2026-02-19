import express from 'express';

import {
  createRoutine,
  getAllRoutines,
  getRoutine,
  getOverallSummary,
  deleteRoutine,
  updateRoutine,
} from '../controllers/routines';

import { authMe } from '../middlewares/auth';

const routinesRoute = express().router;

routinesRoute.get('/', authMe, getAllRoutines);
routinesRoute.get('/overall-summary', authMe, getOverallSummary);
routinesRoute.get('/:id', authMe, getRoutine);

routinesRoute.post('/', authMe, createRoutine);
routinesRoute.patch('/:id', authMe, updateRoutine);
routinesRoute.delete('/:id', authMe, deleteRoutine);

export default routinesRoute;
