import { Outlet } from "react-router-dom";
import { QueryClient,QueryClientProvider } from '@tanstack/react-query';
import  Menu  from '../components/menu/Menu';
import  Navbar  from '../components/navbar/Navbar';

const Layout = () => {
    const queryClient = new QueryClient();
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

  export default Layout;