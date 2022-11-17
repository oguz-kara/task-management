import React from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export function useGetDoc(collectionName, id) {
  const [result, setResult] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  async function getFirebaseDoc() {
    setLoading(true);
    const docRef = doc(db, collectionName, id);
    return getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setResult(data);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
          console.log({ boardList: data.boardList, result });
          return data;
        } else {
          console.log('No such document!');
          setError({ message: 'No such document!' });
          setTimeout(() => {
            setLoading(false);
          }, 1000);
          return { message: 'No such document!' };
        }
      })
      .catch((err) => {
        setError(err);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
        return err;
      });
  }

  React.useEffect(() => {
    if (collectionName || id) {
      getFirebaseDoc();
    } else {
      setError({ message: 'You must provide a collection name and password!' });
    }
  }, [collectionName, id]);

  return { result, loading, error, refetch: getFirebaseDoc };
}
