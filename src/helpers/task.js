export const countDoneSubtasks = (task) => {
  let counter = 0;
  task?.subtasks?.forEach((item) => {
    if (item.done === true) counter++;
  });
  return counter;
};
