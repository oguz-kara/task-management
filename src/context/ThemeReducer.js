export const ThemeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_THEME': {
      return {
        ...state,
        dark: action.payload
      };
    }
    default:
      return state;
  }
};
