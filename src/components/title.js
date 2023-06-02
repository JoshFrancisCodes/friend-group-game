import React, { useEffect } from 'react';

const Title = () => {
  useEffect(() => {
    document.title = "Friend Group Strength";
  }, []);  // Empty array means run this effect once on mount, and clean it up on unmount

  return;
}

export default Title;
