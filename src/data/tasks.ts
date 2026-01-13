import { prisma } from './lib/prisma';

export const toggleTaskLog = async ({
  taskId,
  date,
}: {
  taskId: number;
  date: string;
}) => {
  try {
    const targetDate = new Date(date);

    const completeedTask = await prisma.taskLog.findFirst({
      where: {
        task_id: taskId,
        completed_date: targetDate,
      },
    });

    if (completeedTask) {
      await prisma.taskLog.delete({
        where: { id: completeedTask.id },
      });
      return { is_completed: false, message: '체크 해제되었습니다.' };
    } else {
      await prisma.taskLog.create({
        data: {
          task_id: taskId,
          completed_date: targetDate,
        },
      });
      return { is_completed: true, message: '체크 완료되었습니다.' };
    }
  } catch (err) {
    console.error(err);
  }
};
