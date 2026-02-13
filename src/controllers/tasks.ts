import { Request, Response } from 'express';

import * as tasksRepository from '../data/tasks';
import { handleError } from '../utils/controller';

export const handleTaskToggle = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { date } = req.body;

    const result = await tasksRepository.toggleTaskLog({
      taskId: Number(taskId),
      date,
    });
    return res.status(200).json(result);
  } catch (err) {
    return handleError(res, err);
  }
};
