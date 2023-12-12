import { useEffect, useState } from 'react';

const useRefinementCounter = () => {
  const [refinementCounter, setRefinementCounter] = useState(0);

  const fetchUpdatedCounter = async () => {
    const response = await fetch('/api/counter', {
      cache: 'no-store',
    });

    const data = await response.json();
    if (typeof data === 'number') {
      setRefinementCounter(data);
    } else {
      console.error('Expected a number but received:', data);
    }
  };

  useEffect(() => {
    fetchUpdatedCounter();
  }, []);

  return { refinementCounter, fetchUpdatedCounter };
};

export default useRefinementCounter;
