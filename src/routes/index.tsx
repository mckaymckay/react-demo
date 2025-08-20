import MainLayout from '../layouts'
import Home from '../pages/home'
import Demo from '../pages/demo';
import Chat from '../pages/chat'

const Routes = [
    {
        path: "/",
        label: '首页',
        element: <Home />,
    },
    {
        path: "demo",
        label: '示例',
        element: <Demo />,
    },
    {
        path: "chat",
        label: '示例2',
        element: <Chat />,
    },
];
export default Routes;


