import { Request, Response } from 'express';

import * as routinesRepository from '../data/routines';

export const getAllRoutines = async (req: Request, res: Response) => {
  try {
    const res = await routinesRepository.findAllRoutines();
    console.log(res);
  } catch (err) {
    console.log('routine - get error');
  }
};

export const getRoutine = async (req: Request, res: Response) => {
  try {
    const result = await routinesRepository.findRoutineById();
    console.log('*** get Routine ***');
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.log('routine - get error');
  }
};

export const createRoutine = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const res = await routinesRepository.createRoutine();
    console.log(res);
  } catch (err) {
    console.log('routine - create error');
  }
};
