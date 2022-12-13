export const ConfirmReducer = (state, action) => {
  switch (action.type) {
    case 'CONFIRM':
      return {
        ...action.payload
      };
    case 'RESET':
      return {
        isOpen: false
      };
    default:
      return state;
  }
};
