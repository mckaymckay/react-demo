import React, { Suspense, useState } from 'react'
import InitAlbums from './initAlbums';

const LazySuspenseAlbums = React.lazy(() => import('./InitAlbums'))
export default function Index() {
  return (
    <>
      <span style={{ color: 'red' }}>1. 正常使用组件</span>
      <InitAlbums />
      <br />
      <span style={{ color: 'red' }}>2. 懒加载组件</span>
      <Suspense fallback={<Loading />}>
        <LazySuspenseAlbums />
      </Suspense>
    </>
  )
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}