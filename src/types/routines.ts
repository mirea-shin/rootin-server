export interface TaskInput {
  id?: number;
  name: string;
  sort_order: number;
}

export interface CreateRoutineInput {
  title: string;
  description?: string;
  start_date: Date | string;
  duration_days: number;
  user_id: number;
  tasks: TaskInput[];
}

export interface UpdateRoutineInput {
  title?: string;
  description?: string;
  duration_days?: number;
  tasks: TaskInput[];
}
