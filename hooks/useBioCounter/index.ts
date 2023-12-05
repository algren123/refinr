import { useEffect, useState } from 'react';

const useBioCounter = () => {
  const [bioCounter, setBioCounter] = useState(0);

  const fetchUpdatedCounter = async () => {
    const response = await fetch('/api/counter', {
      cache: 'no-store',
    });

    const data = await response.json();
    if (typeof data === 'number') {
      setBioCounter(data);
    } else {
      console.error('Expected a number but received:', data);
    }
  };

  useEffect(() => {
    fetchUpdatedCounter();
  }, []);

  return { bioCounter, fetchUpdatedCounter };
};

export default useBioCounter;
