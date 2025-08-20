import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from './routes'
// import './index.css'  // 全局css




function renderRoute(routes) {
  return routes.map((route, index) => (
    <Route key={index} path={route.path} element={route.element}>
      {route.children && route.children.map((child, childIndex) => (
        <Route
          key={`${index}-${childIndex}`}
          path={child.path}
          element={child.element}
        />
      ))}
    </Route>
  ));
}

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <BrowserRouter>
    <Routes>
      {renderRoute(routes)}
    </Routes>
  </BrowserRouter>
  // </StrictMode>,
)
