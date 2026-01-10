import express from 'express';

import {
  createRoutine,
  getAllRoutines,
  getRoutine,
  deleteRoutine,
} from '../controllers/routines';

const routinesRoute = express().router;

routinesRoute.get('/', getAllRoutines);
routinesRoute.get('/:id', getRoutine);

routinesRoute.post('/', createRoutine);
routinesRoute.delete('/:id', deleteRoutine);

export default routinesRoute;
