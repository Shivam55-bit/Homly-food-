import React, { createContext, useContext } from 'react';
import { useAppDispatch, useAppSelector } from '../store';

const StoreContext = createContext<any>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const state = useAppSelector((s) => s);
  const dispatch = useAppDispatch();

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
