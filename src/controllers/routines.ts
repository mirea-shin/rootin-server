import { Request, Response } from 'express';

import * as routinesRepository from '../data/routines';
import { handleError, getUserId } from '../utils/controller';
import {
  enrichRoutineSummary,
  enrichRoutineDetail,
  calcTodaySummary,
  paginate,
} from '../utils/routines';

const ORDER_BY_MAP = {
  name: { title: 'asc' },
  oldest: { start_date: 'asc' },
  newest: { start_date: 'desc' },
} as const;

const parseListQuery = (query: Request['query']) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(20, Math.max(1, Number(query.limit) || 6));
  const filter =
    query.filter === 'completed' ? 'completed' : 'active';
  const sortParam = query.sort as string;
  const sort =
    sortParam === 'oldest' || sortParam === 'name'
      ? sortParam
      : 'newest';

  return { page, limit, filter, sort } as const;
};

export const getAllRoutines = async (req: Request, res: Response) => {
  try {
    const currentUserId = getUserId(req);
    const { page, limit, filter, sort } = parseListQuery(req.query);

    const orderBy = ORDER_BY_MAP[sort] as {
      [key: string]: 'asc' | 'desc';
    };
    const routines = await routinesRepository.findAllRoutines(
      currentUserId,
      orderBy,
    );

    const mapped = routines.map(enrichRoutineSummary);
    const activeRoutines = mapped.filter((r) => !r.isCompleted);
    const completedRoutines = mapped.filter((r) => r.isCompleted);
    const filtered =
      filter === 'completed' ? completedRoutines : activeRoutines;

    const { data, pagination } = paginate(filtered, page, limit);

    return res.status(200).json({
      routines: data,
      pagination,
      counts: {
        active: activeRoutines.length,
        completed: completedRoutines.length,
      },
    });
  } catch (err) {
    return handleError(res, err);
  }
};

export const getTodaySummary = async (
  req: Request,
  res: Response,
) => {
  try {
    const currentUserId = getUserId(req);
    const routines =
      await routinesRepository.findActiveRoutinesWithTodayLogs(
        currentUserId,
      );

    return res.status(200).json(calcTodaySummary(routines));
  } catch (err) {
    return handleError(res, err);
  }
};

export const getRoutine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserId = getUserId(req);

    const routine = await routinesRepository.findRoutineById({
      routineId: Number(id),
      user_id: String(currentUserId),
    });

    if (!routine)
      throw new Error(
        'RoutineNotFound:해당 루틴을 찾을 수 없습니다.',
      );

    return res.status(200).json(enrichRoutineDetail(routine));
  } catch (err) {
    return handleError(res, err);
  }
};

export const createRoutine = async (req: Request, res: Response) => {
  try {
    const { routine } = req.body;
    getUserId(req);

    if (!routine)
      throw new Error('BadRequest:루틴 데이터가 누락되었습니다.');

    const createdRoutine =
      await routinesRepository.createRoutine(routine);

    return res.status(201).json({ routine: { ...createdRoutine } });
  } catch (err) {
    return handleError(res, err);
  }
};

export const updateRoutine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { routine } = req.body;
    const currentUserId = getUserId(req);

    if (!id || !routine)
      throw new Error(
        'BadRequest:루틴 ID 또는 수정 데이터가 누락되었습니다.',
      );

    await routinesRepository.updateRoutine({
      id: Number(id),
      parsedroutine: routine,
      user_id: currentUserId,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return handleError(res, err);
  }
};

export const deleteRoutine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserId = getUserId(req);

    await routinesRepository.deleteRoutine({
      routineId: id,
      user_id: currentUserId,
    });

    return res.status(204).send();
  } catch (err) {
    return handleError(res, err);
  }
};
