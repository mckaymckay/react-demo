import React, { useCallback } from 'react';
import { myDebounce, myThrrottle } from '../../utils/myDebounce';

const Index = () => {
  const handleChange = (e) => {
    console.log(e.target.value);
  };

  // immediate:true 首次输入立即触发
  const debounceChange = useCallback(myDebounce(handleChange, 500, false), []);

  const handleClick = () => {
    console.log('clicked');
  };
  const throttleClick = useCallback(myThrrottle(handleClick, 2000), []);
  return (
    <div style={{ padding: 100 }}>
      <div>防抖</div>
      <input
        type="text"
        placeholder="please input"
        onChange={debounceChange}
      />

      <div>节流</div>
      <button type="button" onClick={throttleClick}>click</button>
    </div>
  );
};

export default Index;
