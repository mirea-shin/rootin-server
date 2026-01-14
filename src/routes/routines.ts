import express from 'express';

import {
  createRoutine,
  getAllRoutines,
  getRoutine,
  deleteRoutine,
  updateRoutine,
} from '../controllers/routines';

const routinesRoute = express().router;

routinesRoute.get('/', getAllRoutines);
routinesRoute.get('/:id', getRoutine);

routinesRoute.post('/', createRoutine);
routinesRoute.patch('/:id', updateRoutine);
routinesRoute.delete('/:id', deleteRoutine);

export default routinesRoute;
