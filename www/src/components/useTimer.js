import { useState, useEffect } from 'react';

function useTimer(args) {
  const {
    onTimeout,
  } = args;
  const [ remainingTime, setRemainingTime ] = useState(122);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const time = remainingTime - 1;
  
      setRemainingTime(time);

      if (time === 0 && onTimeout) {
        clearTimeout(interval);
        onTimeout();
      }
    }, 1000);

    return () => {
      clearTimeout(interval);
    };
  }, [ remainingTime ]);

  return {
    remainingTime,
  };
}

export default useTimer
