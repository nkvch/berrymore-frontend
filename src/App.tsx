import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Wrapper from './components/Wrapper/Wrapper';
import SignIn from './pages/SignIn/signin.page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SignUp from './pages/SignUp/signup.page';
import ForemenPage from './pages/Foremen/foremen.page';
import CreateUpdateForemanPage from './pages/Foremen/CreateForeman/create-foreman.page';
import UpdateForemanPage from './pages/Foremen/UpdateForeman/update-foreman.page';
import CreateEmployeePage from './pages/Employees/CreateEmployee/create-employee.page';
import EmployeesPage from './pages/Employees/employees.page';

const router = createBrowserRouter([{
  path: '/',
  element: <Wrapper />,
  children: [
    {
      path: '/',
      element: <div>Home</div>
    },
    {
      path: '/signin',
      element: <SignIn />
    },
    {
      path: '/signup',
      element: <SignUp />
    },
    {
      path: '/foremen',
      element: <ForemenPage />,
    },
    {
      path: '/foremen/create',
      element: <CreateUpdateForemanPage />
    },
    {
      path: '/foremen/:id',
      element: <UpdateForemanPage />
    },
    {
      path: '/employees',
      element: <EmployeesPage />
    },
    {
      path: '/employees/create',
      element: <CreateEmployeePage />
    },
    {
      path: '/stats',
      element: <div>Stats</div>
    },
  ]
}]);

function App() {
  return (
    <RecoilRoot>
      <QueryClientProvider client={new QueryClient()}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default App;
