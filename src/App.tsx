import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RoleList } from './components/roleList/RoleList';
import  Menu  from './components/menu/Menu';
import  Navbar  from './components/navbar/Navbar';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";


const queryClient = new QueryClient();

function App() {
  const Layout = () => {
    return (
      <div className="container">
      <Menu/>
          <div className="app-container">
            <Navbar />
            <QueryClientProvider client={queryClient}>
              <Outlet />
            </QueryClientProvider>
          </div>
    </div>
    )
  }

    const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <RoleList />
        }, {
          path: "/lists",
          element: <RoleList />
        },
      ]
    },
  ],
    { basename: "/role-dashboard" }
  )
  return <RouterProvider router={router} />;
}

export default App;