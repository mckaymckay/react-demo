// import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from './routes'





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
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {renderRoute(routes)}
        </Routes>
      </BrowserRouter>
      <div>这个组件用不到了</div>
    </>
  )
}

export default App
