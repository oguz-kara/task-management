export const openConfirmModal = ({ confirmDispatch, options = {}, onConfirm }) => {
  if (!onConfirm)
    throw new Error('you must provide a onConfirm method to the openConfirmModal function!');
  console.log({ confirmDispatch, options });
  const confirmData = {
    isOpen: true,
    title: {
      text: options?.title?.text ? options.title.text : 'Are you sure',
      color: options?.title?.color ? options.title.color : '#ea5555'
    },
    message: options?.message
      ? options.message
      : 'You are doing sensitive action, you cannot undo changes!',
    onRequestClose: () => confirmDispatch({ type: 'RESET' }),
    onConfirm: onConfirm,
    buttons: {
      approve: {
        text: options?.buttons?.approve ? options.buttons.approve : 'Confirm',
        style: {
          backgroundColor: options?.buttons?.approve?.backgroundColor
            ? options.buttons.approve.backgroundColor
            : '#ea5555',
          color: options?.buttons?.approve?.color ? options.buttons.approve.color : '#fff'
        }
      },
      reject: {
        text: options?.buttons?.reject ? options.buttons.reject : 'Cancel',
        style: {
          backgroundColor: options?.buttons?.reject?.backgroundColor
            ? options.buttons.reject.backgroundColor
            : 'grey',
          color: options?.buttons?.reject?.color ? options.buttons.reject.color : '#fff'
        },
        text: 'Cancel'
      }
    }
  };
  confirmDispatch({ type: 'CONFIRM', payload: confirmData });
};
