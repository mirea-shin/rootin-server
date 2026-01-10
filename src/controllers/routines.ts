import { Request, Response } from 'express';

import * as routinesRepository from '../data/routines';

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
    const result = await routinesRepository.findRoutineById();

    res.status(200).json(result);
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

export const deleteRoutine = async (req: Request, res: Response) => {
  try {
    const { params } = req;
    const { success } = await routinesRepository.deleteRoutine(params.id);

    if (success) res.send(204);
  } catch (err) {
    console.log('routine - delete error');
  }
};
