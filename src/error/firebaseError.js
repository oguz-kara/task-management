export const getFirebaseErrorMessage = (err) => {
  return err.message;
};

export const getLoginErrorMessage = (err) => {
  if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found')
    return 'Wrong password or username';
};
