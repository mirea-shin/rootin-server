import { Request, Response } from 'express';

import * as tasksRepository from '../data/tasks';

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
    console.error(err);
    return res.status(500).json({ message: '서버 에러가 발생: tasklog' });
  }
};
