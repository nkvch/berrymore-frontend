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
import ShiftsPage from './pages/Shifts/shifts.page';
import DayPage from './pages/Shifts/Day/day.page';
import ProductsPage from './pages/Products/products.page';
import CreateProductPage from './pages/Products/Create/create-product.page';
import EditProductPage from './pages/Products/Edit/edit-product.page';
import NewPortionPage from './pages/NewPortion/new-portion.page';
import Stats from './pages/Stats/Stats';
import EditEmployeePage from './pages/Employees/EditEmployee/edit-employee.page';
import MainPage from './pages/Main/main.page';
import HistoryPage from './pages/History/history.page';

const router = createBrowserRouter([{
  path: '/',
  element: <Wrapper />,
  children: [
    {
      path: '/',
      element: <MainPage />
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
      path: '/employees/:id',
      element: <EditEmployeePage />
    },
    {
      path: '/shifts',
      element: <ShiftsPage />
    },
    {
      path: '/shifts/day',
      element: <DayPage />,
    },
    {
      path: '/products',
      element: <ProductsPage />
    },
    {
      path: '/products/create',
      element: <CreateProductPage />
    },
    {
      path: '/products/:id',
      element: <EditProductPage />
    },
    {
      path: '/new-portion',
      element: <NewPortionPage />
    },
    {
      path: '/stats',
      element: <Stats />
    },
    {
      path: '/history',
      element: <HistoryPage />
    }
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
