export const ConfirmReducer = (state, action) => {
  switch (action.type) {
    case 'CONFIRM':
      console.log({ payload: action.payload });
      console.log('test');
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
