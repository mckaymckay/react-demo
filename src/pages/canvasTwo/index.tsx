import React, { useEffect, useRef } from 'react';

const Index = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.heights);

    // 1. 画一个正方形
    ctx.fillStyle = '#4caf50';
    ctx.fillRect(20, 40, 60, 80); // x,y,width,height

    // 2. 画一个圆形
    ctx.beginPath();
    ctx.arc(160, 60, 40, 0, Math.PI * 2); // x, y, radius, startAngle, endAngle
    ctx.fillStyle = '#2196f3';
    ctx.fill();

    // 3. 画一个三角形
    ctx.beginPath();
    ctx.moveTo(260, 100); // 第一个点
    ctx.lineTo(220, 20); // 第二个点
    ctx.lineTo(300, 20); // 第三个点
    ctx.closePath();
    ctx.fillStyle = '#f44336';
    ctx.fill();
  }, []);
  return (
    <div style={{ padding: 100 }}>
      使用canvas2D绘制图形
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        style={{ border: '1px solid #ccc', background: '#fff' }}
      />
    </div>
  );
};

export default Index;
