import { prisma } from './lib/prisma';

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

export const findRoutineById = async () => {
  try {
    const routine = await prisma.routine.findFirst({
      where: {
        user_id: 1,
        id: 1,
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
            // task와 연결된 logs를 가져옵니다.
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

export const createRoutine = async () => {
  try {
    const tasks = [
      { name: '12시간 공복 유지', sort_order: 1 },
      { name: '유산소운동', sort_order: 2 },
    ];

    const routine = await prisma.routine.create({
      data: {
        title: '다이어트',
        duration_days: 90,
        description: '90일이내로 다이어트를 하는거야아',
        user_id: 1,
        tasks: {
          create: tasks.map((task) => ({
            name: task.name,
            sort_order: task.sort_order,
          })),
        },
      },
    });

    return { ...routine };
  } catch (err) {
    console.log(err);
  }
};
