import { db, auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { newUserSkeleton } from '../data/skeleton';
import { doc, setDoc } from 'firebase/firestore';
import { getUserData } from './user';

export const register = async ({ email, password }) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', res.user.uid), newUserSkeleton());
  } catch (err) {
    console.log({ err });
  }
};

export const login = async ({ email, password }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userData = await getUserData(user.uid);
    return {
      ...user,
      userData: {
        boardList: userData?.boardList
      }
    };
  } catch (err) {
    return err;
  }
};

export const logout = async () => {
  localStorage.clear();
};
