export const countDoneSubtasks = (task) => {
  return task?.subtasks?.filter(({ done }) => done).length || 0;
};
