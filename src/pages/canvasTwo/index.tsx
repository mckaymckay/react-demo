import React, { useRef, useEffect, useState } from 'react';

const CanvasShapes = () => {
  const canvasRef = useRef(null);
  const [shapePositions, setShapePositions] = useState([]);

  // 定义图形数据（添加三角形）
  const shapes = [
    {
      type: 'rect', x: 50, y: 30, width: 80, height: 80, color: '#4caf50',
    },
    {
      type: 'circle', x: 200, y: 70, r: 40, color: '#2196f3',
    },
    {
      type: 'triangle',
      points: [[320, 100], [280, 20], [360, 20]],
      color: '#f44336',
    },
  ];

  // 计算图形在页面上的坐标
  const calculatePagePositions = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 用 canvas.getBoundingClientRect() 转为页面坐标
    const rect = canvas.getBoundingClientRect();
    console.log(29, rect);

    const positions = shapes.map((shape) => {
      if (shape.type === 'rect') {
        return {
          type: 'rect',
          canvasCoords: {
            x: shape.x, y: shape.y, width: shape.width, height: shape.height,
          },
          pageCoords: {
            left: rect.left + shape.x,
            top: rect.top + shape.y,
            right: rect.left + shape.x + shape.width,
            bottom: rect.top + shape.y + shape.height,
          },
        };
      } if (shape.type === 'circle') {
        return {
          type: 'circle',
          canvasCoords: { x: shape.x, y: shape.y, r: shape.r },
          pageCoords: {
            centerX: rect.left + shape.x,
            centerY: rect.top + shape.y,
            radius: shape.r,
          },
        };
      } if (shape.type === 'triangle') {
        return {
          type: 'triangle',
          canvasCoords: { points: shape.points },
          pageCoords: {
            points: shape.points.map(([x, y]) => { return [rect.left + x, rect.top + y]; }),
          },
        };
      }
      return null;
    }).filter(Boolean);

    setShapePositions(positions);
  };

  // 手动获取坐标的函数
  const getShapePositions = () => {
    calculatePagePositions();
    console.log('图形页面坐标：', shapePositions);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制所有图形
    shapes.forEach((shape) => {
      if (shape.type === 'rect') {
        ctx.fillStyle = shape.color;
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === 'circle') {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2);
        ctx.fillStyle = shape.color;
        ctx.fill();
      } else if (shape.type === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(shape.points[0][0], shape.points[0][1]);
        ctx.lineTo(shape.points[1][0], shape.points[1][1]);
        ctx.lineTo(shape.points[2][0], shape.points[2][1]);
        ctx.closePath();
        ctx.fillStyle = shape.color;
        ctx.fill();
      }
    });

    // 计算页面坐标
    calculatePagePositions();
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={450}
        height={150}
        style={{ border: '1px solid #ccc', display: 'block', margin: '20px 0' }}
      />

      <button type="button" onClick={getShapePositions}>
        获取图形页面坐标
      </button>

      <div style={{ marginTop: '20px' }}>
        <h3>图形坐标信息：</h3>
        {shapePositions.map((shape, index) => {
          return (
            <div key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #eee' }}>
              <strong>
                {shape.type === 'rect' ? '正方形'
                  : shape.type === 'circle' ? '圆形' : '三角形'}
              </strong>
              <br />
              <span>
                Canvas坐标：
                {JSON.stringify(shape.canvasCoords)}
              </span>
              <br />
              <span>
                页面坐标：
                {JSON.stringify(shape.pageCoords)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CanvasShapes;
