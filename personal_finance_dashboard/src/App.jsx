import {Provider} from 'react-redux';
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom';
import { store } from './store';
import ROUTES from './routes';
import Root from './pages/Root';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Investments from './pages/Investments';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

const router = createBrowserRouter(createRoutesFromElements(
  <Route path={ROUTES.HOME} element={<Root/>}>
    <Route index element={<Dashboard/>}/>
    <Route path={ROUTES.REGISTER} element={<RegisterPage/>} />
    <Route path={ROUTES.LOGIN} element={<LoginPage/>} />
    <Route path={ROUTES.INCOMES(':userId')} element={<Income/>} />
    <Route path={ROUTES.EXPENSES(':userId')} element={<Expenses/>} />
    <Route path={ROUTES.INVESTMENTS(':userId')} element={<Investments/>} />
  </Route>
))

function App() {  

  return (
    <Provider store={store}>
      <RouterProvider router={router}/> 
    </Provider>
  )
}

export default App
