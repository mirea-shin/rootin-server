import express from 'express';

import {
  createRoutine,
  getAllRoutines,
  getRoutine,
} from '../controllers/routines';

const routinesRoute = express().router;

routinesRoute.get('/', getAllRoutines);
routinesRoute.get('/:id', getRoutine);

routinesRoute.post('/', createRoutine);

export default routinesRoute;
