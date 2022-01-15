import { useState, useEffect } from 'react';

export default function useSemiPersistentState(key, initialState) {
  console.log('Fetching persistent state...');

  let data = localStorage.getItem(key);
  // console.log(data);
  
  if (data) {
    data = JSON.parse(data);
    // console.log(data);
  
  }
  const [state, setState] = useState(data || initialState);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  // const updatePersistentState = (value) => {
  //   localStorage.setItem(key, JSON.stringify(value))
  //   setState(value);
  // };
  
  return [
    state,
    setState
    // updatePersistentState,
  ];
}
