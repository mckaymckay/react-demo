import ColumnGroup from 'antd/es/table/ColumnGroup';
import React from 'react';

const person = {
  name: ' aa',
  age: 20,
};
type PersonType = typeof person
type PersonKeys = keyof PersonType

export default function Index() {
  const A:PersonType = {
    name: 'aa',
    age: 20,
  };
  console.log(A);
  return (
    <div>index</div>
  );
}
