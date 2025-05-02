import { RouterProvider } from "react-router-dom";
import { router } from './routes/AppRouter';
import  Layout  from './layout/Layout';



function App() {
  <Layout/>
  return <RouterProvider router={router} />;
}

export default App;