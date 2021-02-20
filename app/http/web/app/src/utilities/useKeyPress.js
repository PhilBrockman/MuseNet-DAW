//https://usehooks.com/useKeyPress/

import React from 'react'

export default function useKeyPress(targetKey, callback) {
  React.useEffect(() => {
    function downHandler({ key }) {
      if (key === targetKey) {
        callback();
      }
    }

    window.addEventListener('keydown', downHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [targetKey, callback]);

  return null;
}
