import React from 'react';
import Home from '../pages/home';
import Demo from '../pages/demo';
import Chat from '../pages/chat';
import Fabu from '../pages/fabu';
import Test from '../pages/testFilder/index.tsx';
import DebounceInput from '../pages/debounceInput';

const Routes = [
  {
    path: '/',
    label: '首页',
    element: <Home />,
  },
  {
    // 有些小示例
    path: 'demo',
    label: '示例',
    element: <Demo />,
  },
  {
    // 聊天系统
    path: 'chat',
    label: '示例2',
    element: <Chat />,
  },
  {
    path: 'fabu',
    element: <Fabu />,
  },
  {
    path: 'debounceInput',
    element: <DebounceInput />,
  },
  {
    path: 'test',
    element: <Test />,
  },
];
export default Routes;
