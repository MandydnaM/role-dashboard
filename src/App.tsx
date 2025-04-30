import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RoleList } from './components/RoleList';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-container">
        <RoleList />
      </div>
    </QueryClientProvider>
  );
}

export default App;