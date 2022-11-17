export const AuthReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN': {
      return {
        user: action.payload
      };
    }
    case 'LOGOUT': {
      return {
        user: null
      };
    }
    case 'SET_BOARD_LIST': {
      return {
        ...state,
        user: {
          ...state.user,
          userData: {
            ...state.user.userData,
            boardList: action.payload
          }
        }
      };
    }
    default:
      return state;
  }
};
