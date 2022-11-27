import React from 'react';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export function useSetDoc(collectionName, id) {
  const [result, setResult] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  async function setFirebaseDoc(data) {
    setLoading(true);
    const docRef = doc(db, collectionName, id);

    const set = setDoc(docRef, {
      ...data
    });

    const get = getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) return docSnap.data();
      return null;
    });
    return Promise.all([set, get])
      .then((values) => {
        setResult(values[1]);
        error && setError(false);
        return {
          values,
          loading,
          result,
          error
        };
      })
      .catch((err) => {
        console.log(err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return { loading, result, error, refetch: setFirebaseDoc };
}
