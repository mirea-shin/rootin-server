import { Request, Response } from 'express';

import * as routinesRepository from '../data/routines';

// 에러처리
// id가 유효하지 않을 경우 : getRoutine, updateRoutine, deleteRoutine

export const getAllRoutines = async (req: Request, res: Response) => {
  try {
    const result = await routinesRepository.findAllRoutines();
    res.status(200).json({ routines: result });
    console.log(res);
  } catch (err) {
    console.log('routine - get error');
  }
};

export const getRoutine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await routinesRepository.findRoutineById({
      routineId: Number(id),
    });

    result ? res.status(200).json(result) : res.send(404);
  } catch (err) {
    console.log('routine - get error');
  }
};

export const createRoutine = async (req: Request, res: Response) => {
  try {
    const { routine } = req.body;
    if (!routine) throw new Error('routine req.body를 찾을 수 없읍니다');

    const createdRoutine = await routinesRepository.createRoutine(routine);

    res.status(201).json({ routine: { ...createdRoutine } });
  } catch (err) {
    console.log('routine - create error');
  }
};

export const updateRoutine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { routine } = req.body;

    if (!id) return res.send(400);

    const updatedRoutine = await routinesRepository.updateRoutine({
      id: Number(id),
      parsedroutine: routine,
    });

    return res.status(201).json(updatedRoutine);
  } catch (err) {
    console.error(err);
  }
};

export const deleteRoutine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { success } = await routinesRepository.deleteRoutine(id);

    if (success) res.send(204);
  } catch (err) {
    console.log('routine - delete error');
  }
};
