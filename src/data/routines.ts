import { prisma } from './lib/prisma';
import {
  CreateRoutineInput,
  UpdateRoutineInput,
} from '../types/routines';

export const findAllRoutines = async (
  currentUserId: number,
  orderBy: { [key: string]: 'asc' | 'desc' },
) => {
  return await prisma.routine.findMany({
    where: { user_id: currentUserId },
    orderBy,
    select: {
      id: true,
      title: true,
      start_date: true,
      duration_days: true,
      _count: {
        select: { tasks: true },
      },
      tasks: {
        select: {
          id: true,
          logs: {
            select: { completed_date: true },
          },
        },
      },
    },
  });
};

export const findRoutineById = async ({
  routineId,
  user_id,
}: {
  routineId: number;
  user_id: string;
}) => {
  return await prisma.routine.findFirst({
    where: {
      user_id: Number(user_id),
      id: routineId,
    },
    select: {
      id: true,
      title: true,
      duration_days: true,
      description: true,
      start_date: true,
      tasks: {
        select: {
          id: true,
          name: true,
          sort_order: true,
          logs: {
            orderBy: { completed_date: 'desc' as const },
          },
        },
      },
    },
  });
};

export const findActiveRoutinesWithLogs = async (
  userId: number,
) => {
  return await prisma.routine.findMany({
    where: { user_id: userId },
    select: {
      start_date: true,
      duration_days: true,
      tasks: {
        select: {
          id: true,
          logs: {
            select: { completed_date: true },
          },
        },
      },
    },
  });
};

export const createRoutine = async (
  parsedroutine: CreateRoutineInput,
) => {
  return await prisma.routine.create({
    data: {
      ...parsedroutine,
      tasks: {
        create: parsedroutine.tasks.map((task) => ({
          name: task.name,
          sort_order: task.sort_order,
        })),
      },
    },
  });
};

export const updateRoutine = async ({
  id,
  parsedroutine,
  user_id,
}: {
  id: number;
  parsedroutine: UpdateRoutineInput;
  user_id: number;
}) => {
  const { tasks, description, title, duration_days } = parsedroutine;

  return await prisma.$transaction(async (tx) => {
    await tx.routine.update({
      where: { id, user_id },
      data: { title, description, duration_days },
    });

    const tasksWithId = tasks.filter((t) => t.id);
    const tasksWithoutId = tasks.filter((t) => !t.id);
    const activeTaskIds = tasksWithId.map((t) => t.id as number);

    await tx.task.deleteMany({
      where: {
        routine_id: id,
        id: { notIn: activeTaskIds },
      },
    });

    for (const task of tasksWithId) {
      await tx.task.update({
        where: { id: task.id },
        data: { name: task.name, sort_order: task.sort_order },
      });
    }

    if (tasksWithoutId.length > 0) {
      await tx.task.createMany({
        data: tasksWithoutId.map((t) => ({
          routine_id: id,
          name: t.name,
          sort_order: t.sort_order,
        })),
      });
    }

    return { success: true };
  });
};

export const deleteRoutine = async ({
  routineId,
  user_id,
}: {
  routineId: string;
  user_id: number;
}) => {
  const routine = await prisma.routine.findFirst({
    where: { id: Number(routineId), user_id },
  });

  if (!routine) {
    throw new Error('RoutineNotFound');
  }

  await prisma.routine.delete({
    where: { id: Number(routineId) },
  });
};
