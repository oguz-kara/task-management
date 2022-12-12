import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const getUserData = async (id) => {
  try {
    const docRef = doc(db, 'users', id);
    const docSnap = await getDoc(docRef);
    if (docSnap !== undefined) {
      return docSnap.data();
    } else {
      return new Error('no such document');
    }
  } catch (err) {
    console.log({ err });
  }
};
