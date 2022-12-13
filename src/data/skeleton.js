import uniqid from 'uniqid';

export const newBoardSkeleton = (name) => ({
  id: 1,
  name: name,
  columnList: [
    {
      id: uniqid(),
      name: 'todo',
      color: '#48C0E2',
      selected: false,
      taskList: []
    },
    {
      id: uniqid(),
      name: 'doing',
      color: '#9F2B68',
      selected: false,
      taskList: []
    },
    {
      id: uniqid(),
      name: 'done',
      color: '#00A300',
      selected: false,
      taskList: []
    }
  ]
});

export const newUserSkeleton = () => ({
  boardList: [
    {
      id: uniqid(),
      name: 'starter',
      columnList: [
        {
          id: 1,
          name: 'selected for development',
          color: '#48C0E2',
          taskList: [
            {
              id: uniqid(),
              title: 'Build UI for onboarding flow',
              description: '',
              subtasks: [
                { id: uniqid(), description: 'Sign up page', none: false },
                { id: uniqid(), description: 'Sign in page', none: true },
                { id: uniqid(), description: 'Board page', none: true }
              ],
              createdAt: Date.now()
            },

            {
              id: uniqid(),
              title: 'Design onboarding flow',
              description: '',
              subtasks: [
                { id: uniqid(), description: 'Sign up page', none: false },
                { id: uniqid(), description: 'Sign in page', none: true },
                { id: uniqid(), description: 'Board page', none: true }
              ],
              createdAt: Date.now()
            },

            {
              id: uniqid(),
              description: '',
              title: 'Build UI for search',
              subtasks: [{ id: uniqid(), description: 'Search page', none: false }],
              createdAt: Date.now()
            },

            {
              id: uniqid(),
              description: '',
              title: 'Add authentication endpoints',
              subtasks: [
                { id: uniqid(), description: 'Define user modal', none: false },
                { id: uniqid(), description: 'Add auth endpoints', none: true }
              ],
              createdAt: Date.now()
            },

            {
              id: uniqid(),
              description:
                'Once we feel version one is ready, we need to rigorously test it both internally and externally to identify any major gaps.',
              title: 'QA and test all major user journeys',
              subtasks: [
                { id: uniqid(), description: 'Internal testing', none: false },
                { id: uniqid(), description: 'External testing', none: true }
              ],
              createdAt: Date.now()
            }
          ]
        },
        {
          id: 2,
          name: 'in progress',
          color: '#9F2B68',
          taskList: [
            {
              id: uniqid(),
              title: 'Build UI for onboarding flow',
              description: '',
              subtasks: [
                { id: uniqid(), description: 'Sign up page', none: false },
                { id: uniqid(), description: 'Sign in page', none: true },
                { id: uniqid(), description: 'Board page', none: true }
              ],
              createdAt: Date.now()
            },

            {
              id: uniqid(),
              title: 'Design onboarding flow',
              description: '',
              subtasks: [
                { id: uniqid(), description: 'Sign up page', none: false },
                { id: uniqid(), description: 'Sign in page', none: true },
                { id: uniqid(), description: 'Board page', none: true }
              ],
              createdAt: Date.now()
            },

            {
              id: uniqid(),
              description: '',
              title: 'Build UI for search',
              subtasks: [{ id: uniqid(), description: 'Search page', none: false }],
              createdAt: Date.now()
            }
          ]
        },
        {
          id: 3,
          name: 'done',
          color: '#00A300',
          taskList: [
            {
              id: uniqid(),
              title: 'Design onboarding flow',
              description: '',
              subtasks: [
                { id: uniqid(), description: 'Sign up page', none: false },
                { id: uniqid(), description: 'Sign in page', none: true },
                { id: uniqid(), description: 'Board page', none: true }
              ],
              createdAt: Date.now()
            },

            {
              id: uniqid(),
              description: '',
              title: 'Build UI for search',
              subtasks: [{ id: uniqid(), description: 'Search page', none: false }],
              createdAt: Date.now()
            },

            {
              id: uniqid(),
              description: '',
              title: 'Add authentication endpoints',
              subtasks: [
                { id: uniqid(), description: 'Define user modal', none: false },
                { id: uniqid(), description: 'Add auth endpoints', none: true }
              ],
              createdAt: Date.now()
            },

            {
              id: uniqid(),
              description:
                'Once we feel version one is ready, we need to rigorously test it both internally and externally to identify any major gaps.',
              title: 'QA and test all major user journeys',
              subtasks: [
                { id: uniqid(), description: 'Internal testing', none: false },
                { id: uniqid(), description: 'External testing', none: true }
              ],
              createdAt: Date.now()
            }
          ]
        }
      ]
    }
  ]
});
