import React, { useState } from 'react';

import UseRefDemo from './components/useRefDemo';
import SuspenseDemo from './components/suspenseDemo';
import InitComp from './components/reactMemoDemo/initComp';
import MemoComp from './components/reactMemoDemo/MemoComp';

export default function Index() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  // const MemoCom = React.memo(<MemoComp value={count2} />);
  return (
    <div>
      <UseRefDemo />
      <h3>suspense 对比demo</h3>
      <SuspenseDemo />

      <h3>测试props没变，React.memo缓存的子组件不会重渲染</h3>
      <InitComp value={count1} />
      <MemoComp value={count2} />
      <button type="button" onClick={() => { return setCount1((prev) => { return prev + 1; }); }}>修改count1</button>
      <button type="button" onClick={() => { return setCount2((prev) => { return prev + 1; }); }}>修改count2</button>
    </div>
  );
}
