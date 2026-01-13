import express from 'express';

import { handleTaskToggle } from '../controllers/tasks';

const tasksRoute = express().router;

tasksRoute.post('/:taskId/toggle-log', handleTaskToggle);

export default tasksRoute;
