import uniqid from 'uniqid';

export const newBoardSkeleton = (name) => ({
  id: uniqid(),
  name,
  columnList: [
    {
      id: 1,
      name: 'todo',
      color: '#48C0E2',
      taskList: []
    },
    {
      id: 2,
      name: 'doing',
      color: 'rebeccapurple',

      taskList: []
    },
    {
      id: 3,
      name: 'done',
      color: 'green',
      taskList: []
    }
  ]
});

export const newUserSkeleton = () => ({
  boardList: [
    {
      id: 1,
      name: 'Starter',
      columnList: [
        {
          id: 1,
          name: 'todo',
          color: '#48C0E2',
          selected: false,
          taskList: []
        },
        {
          id: 2,
          name: 'doing',
          color: 'rebeccapurple',
          selected: false,
          taskList: []
        },
        {
          id: 3,
          name: 'done',
          color: 'green',
          selected: false,
          taskList: []
        }
      ]
    }
  ]
});
