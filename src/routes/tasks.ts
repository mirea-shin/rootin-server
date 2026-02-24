import express from 'express';

import { handleTaskToggle } from '../controllers/tasks';
import { authMe } from '../middlewares/auth';

const tasksRoute = express().router;

tasksRoute.post('/:taskId/toggle-log', authMe, handleTaskToggle);

export default tasksRoute;
