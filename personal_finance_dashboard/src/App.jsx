import {Provider} from 'react-redux';
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom';
import { store } from './store';
import ROUTES from './routes';
import Root from './pages/Root';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Investments from './pages/Investments';

const router = createBrowserRouter(createRoutesFromElements(
  <Route path={ROUTES.HOME} element={<Root/>}>
    <Route index element={<Dashboard/>}/>
    <Route path={ROUTES.INCOMES} element={<Income/>} />
    <Route path={ROUTES.EXPENSES} element={<Expenses/>} />
    <Route path={ROUTES.INVESTMENTS} element={<Investments/>} />
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
