import React from 'react';
import { ContextProvider } from './src/components/ContextProvider';
import './src/static/reset.css';
import './src/static/base.css';

export const wrapRootElement = ({ element }) => {
  return (
    <ContextProvider>
      { element }
    </ContextProvider>
  )
};
