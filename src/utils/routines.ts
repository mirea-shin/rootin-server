const stripTime = (date: Date): Date => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

export const calcEndDate = (
  startDate: Date | string,
  durationDays: number,
): Date => {
  const end = new Date(startDate);
  end.setDate(end.getDate() + durationDays);
  return end;
};

export const calcCompletionRate = (
  tasks: { logs: { completed_date: Date }[] }[],
  startDate: Date | string,
  _endDate: Date,
  durationDays: number,
): number => {
  const totalSlots = durationDays * tasks.length;
  if (totalSlots === 0) return 0;

  const startDay = stripTime(new Date(startDate));
  const endDay = stripTime(
    calcEndDate(startDate, durationDays),
  );

  const completedSlots = tasks.reduce(
    (sum, task) =>
      sum +
      task.logs.filter((log) => {
        const d = stripTime(new Date(log.completed_date));
        return d >= startDay && d < endDay;
      }).length,
    0,
  );

  return Math.round((completedSlots / totalSlots) * 100);
};

export const checkIsCompleted = (
  completionRate: number,
  endDate: Date,
): boolean => {
  return completionRate === 100 || new Date() > endDate;
};

export const buildDailyStatus = (
  tasks: {
    id: number;
    logs: { completed_date: Date }[];
  }[],
  startDate: Date | string,
  durationDays: number,
) => {
  const taskLogMaps = tasks.map((task) => ({
    task_id: task.id,
    completedSet: new Set(
      task.logs.map(
        (log) =>
          log.completed_date.toISOString().split('T')[0],
      ),
    ),
  }));

  return Array.from({ length: durationDays }, (_, i) => {
    const targetDate = new Date(startDate);
    targetDate.setDate(targetDate.getDate() + i);
    const dateStr = targetDate.toISOString().split('T')[0];

    const status = taskLogMaps.map((t) => ({
      task_id: t.task_id,
      isCompleted: t.completedSet.has(dateStr),
    }));

    return { day: i + 1, date: dateStr, status };
  });
};

export const calcTodayProgress = (
  tasks: { logs: { completed_date: Date }[] }[],
) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTotal = tasks.length;
  const todayCompleted = tasks.filter((task) =>
    task.logs.some(
      (log) =>
        log.completed_date.toISOString().split('T')[0] ===
        todayStr,
    ),
  ).length;

  return { todayTotal, todayCompleted };
};

// ── 조합 함수 ─────────────────────────────────────────
interface RoutineBase {
  start_date: Date | string;
  duration_days: number;
}

interface RoutineWithTasks extends RoutineBase {
  tasks: { id: number; logs: { completed_date: Date }[] }[];
}

export const enrichRoutineSummary = <
  T extends RoutineWithTasks,
>(
  routine: T,
) => {
  const { tasks, ...rest } = routine;
  const end_date = calcEndDate(rest.start_date, rest.duration_days);
  const completion_rate = calcCompletionRate(
    tasks,
    rest.start_date,
    end_date,
    rest.duration_days,
  );
  const isCompleted = checkIsCompleted(completion_rate, end_date);
  const { todayTotal, todayCompleted } = calcTodayProgress(tasks);

  return {
    ...rest,
    end_date,
    completion_rate,
    isCompleted,
    todayTotal,
    todayCompleted,
  };
};

export const enrichRoutineDetail = <
  T extends RoutineWithTasks,
>(
  routine: T,
) => {
  const end_date = calcEndDate(
    routine.start_date,
    routine.duration_days,
  );
  const completion_rate = calcCompletionRate(
    routine.tasks,
    routine.start_date,
    end_date,
    routine.duration_days,
  );
  const isCompleted = checkIsCompleted(completion_rate, end_date);
  const daily_status = buildDailyStatus(
    routine.tasks,
    routine.start_date,
    routine.duration_days,
  );

  return {
    ...routine,
    daily_status,
    end_date,
    completion_rate,
    isCompleted,
  };
};

export const calcOverallSummary = (
  routines: (RoutineBase & {
    tasks: { logs: { completed_date: Date }[] }[];
  })[],
) => {
  const activeWithRates = routines
    .map((r) => {
      const end = calcEndDate(r.start_date, r.duration_days);
      const rate = calcCompletionRate(
        r.tasks,
        r.start_date,
        end,
        r.duration_days,
      );
      return { rate, isCompleted: checkIsCompleted(rate, end) };
    })
    .filter(({ isCompleted }) => !isCompleted);

  if (activeWithRates.length === 0)
    return { totalRoutines: 0, averageRate: 0 };

  const averageRate = Math.round(
    activeWithRates.reduce((sum, { rate }) => sum + rate, 0) /
      activeWithRates.length,
  );

  return { totalRoutines: activeWithRates.length, averageRate };
};

export const paginate = <T>(
  items: T[],
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;
  const paginated = items.slice(skip, skip + limit);

  return {
    data: paginated,
    pagination: {
      total: items.length,
      page,
      limit,
      totalPages: Math.ceil(items.length / limit),
    },
  };
};
