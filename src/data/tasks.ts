import { prisma } from './lib/prisma';

export const toggleTaskLog = async ({
  taskId,
  userId,
  date,
}: {
  taskId: number;
  userId: number;
  date: string;
}) => {
  // 소유권 검증: task가 현재 사용자의 루틴에 속하는지 확인
  const task = await prisma.task.findFirst({
    where: { id: taskId, routine: { user_id: userId } },
  });
  if (!task) throw new Error('TaskNotFound');

  const targetDate = new Date(date);

  const completedTask = await prisma.taskLog.findFirst({
    where: { task_id: taskId, completed_date: targetDate },
  });

  if (completedTask) {
    await prisma.taskLog.delete({ where: { id: completedTask.id } });
    return { is_completed: false, message: '체크 해제되었습니다.' };
  } else {
    await prisma.taskLog.create({
      data: { task_id: taskId, completed_date: targetDate },
    });
    return { is_completed: true, message: '체크 완료되었습니다.' };
  }
};
