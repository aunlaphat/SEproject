// DataContext.js
import React, { createContext, useContext, useReducer } from 'react';

// Define initial state
const initialState = {
  data: [],
};

// Define reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_DATA':
      return { ...state, data: [...state.data, action.payload] };
    default:
      return state;
  }
};

// Create data context
const DataContext = createContext();

// Create data provider component
export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to access data and dispatch function
export const useData = () => useContext(DataContext);
