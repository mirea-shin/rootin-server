import { prisma } from './lib/prisma';

// todo tasklog가 없을 경우

interface Response {
  success: boolean;
}

export const findAllRoutines = async () => {
  try {
    const routines = await prisma.routine.findMany({
      where: {
        user_id: 1,
      },
      select: {
        id: true,
        title: true,
        start_date: true,
        _count: {
          select: { tasks: true },
        },
      },
    });

    return routines;
  } catch (err) {
    console.log(err);
  }
};

export const findRoutineById = async ({ routineId }: { routineId: number }) => {
  try {
    const routine = await prisma.routine.findFirst({
      where: {
        user_id: 1,
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
              orderBy: {
                completed_date: 'desc', // 가장 최근 로그부터
              },
            },
          },
        },
      },
    });

    if (!routine) return null;

    const { tasks } = routine;

    const taskLogMaps = tasks.map((task) => {
      return {
        task_id: task.id,
        completedSet: new Set(
          task.logs.map(
            (log) => log.completed_date.toISOString().split('T')[0],
          ),
        ),
      };
    });

    console.log('*** task log maps ***');
    console.log(taskLogMaps);
    const daily_status = Array.from(
      { length: routine.duration_days },
      (_, i) => {
        const targetDate = new Date(routine.start_date);
        targetDate.setDate(targetDate.getDate() + i);
        const dateStr = targetDate.toISOString().split('T')[0];

        const status = taskLogMaps.map((t) => ({
          task_id: t.task_id,
          isCompleted: t.completedSet.has(dateStr), // Set.has()로 빠르게 검색
        }));

        return {
          day: i + 1,
          date: dateStr,
          status,
        };
      },
    );

    return { ...routine, daily_status };
  } catch (err) {
    console.log(err);
  }
};

export const createRoutine = async (parsedroutine: any) => {
  try {
    const routine = await prisma.routine.create({
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

    return routine;
  } catch (err) {
    console.log(err);
  }
};

export const updateRoutine = async ({
  id,
  parsedroutine,
}: {
  id: number;
  parsedroutine: any;
}) => {
  try {
    const { tasks, description, title } = parsedroutine;

    return await prisma.$transaction(async (tx) => {
      await tx.routine.update({
        where: {
          id,
          user_id: 1,
        },
        data: {
          title,
          description,
        },
      });

      const tasksWithId = tasks.filter((t: any) => t.id); // 기존에 있던 태스크
      const tasksWithoutId = tasks.filter((t: any) => !t.id); // 새로 추가된 태스크

      const activeTaskIds = tasksWithId.map((t: any) => t.id);
      // 사라진 테스크 삭제
      await tx.task.deleteMany({
        where: {
          routine_id: id,
          id: { notIn: activeTaskIds },
        },
      });

      // 기존 테스크 업데이트
      for (const task of tasksWithId) {
        await tx.task.update({
          where: { id: task.id },
          data: {
            name: task.name,
            sort_order: task.sort_order,
          },
        });
      }

      // 새로운 테스크 등록
      if (tasksWithoutId.length > 0) {
        await tx.task.createMany({
          data: tasksWithoutId.map((t) => ({
            routine_id: id,
            name: t.name,
            sort_order: t.sort_order,
          })),
        });
      }

      return { sucess: true };
    });
    // return routine;
  } catch (err) {
    console.log(err);
  }
};

export const deleteRoutine = async (routineId: string): Promise<Response> => {
  try {
    // 1. 루틴 존재 여부 및 소유권 확인 (보안상 중요)
    const routine = await prisma.routine.findFirst({
      where: { id: Number(routineId), user_id: 1 },
    });

    if (!routine) {
      throw new Error('삭제할 루틴을 찾을 수 없거나 권한이 없습니다.');
    }

    // 2. 삭제 실행 (이 명령 하나로 하위 Task, TaskLog가 모두 삭제됨)
    await prisma.routine.delete({
      where: { id: Number(routineId) },
    });

    return { success: true };
  } catch (err) {
    console.log(err);
    return { success: false };
  }
};
