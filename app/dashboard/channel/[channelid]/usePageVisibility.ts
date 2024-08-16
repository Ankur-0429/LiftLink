import { useEffect, useState } from 'react';

export function usePageVisibility() {
  const [isPageVisible, setIsPageVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document && document.hidden) {
        setIsPageVisible(!document.hidden);
      } else {
        setIsPageVisible(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isPageVisible;
}