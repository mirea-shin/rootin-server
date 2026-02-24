import { Request, Response } from 'express';

import * as tasksRepository from '../data/tasks';
import { handleError, getUserId } from '../utils/controller';

export const handleTaskToggle = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { date } = req.body;
    const currentUserId = getUserId(req);

    if (!date) throw new Error('BadRequest:날짜가 누락되었습니다.');
    if (isNaN(new Date(date).getTime()))
      throw new Error('BadRequest:유효하지 않은 날짜 형식입니다.');

    const result = await tasksRepository.toggleTaskLog({
      taskId: Number(taskId),
      userId: currentUserId,
      date,
    });
    return res.status(200).json(result);
  } catch (err) {
    return handleError(res, err);
  }
};
