import { createBrowserRouter } from "react-router-dom";
import Layout from '../layout/Layout';
import RoleList from '../components/roleList/RoleList';


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <RoleList />
      },
      {
        path: "/lists",
        element: <RoleList />
      },
    ]
  },
], { basename: "/role-dashboard" });