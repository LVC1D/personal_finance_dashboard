import {Provider} from 'react-redux';
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom';
import { store } from './store';
import './App.css';

const router = createBrowserRouter(createRoutesFromElements(
  <Route>
    
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
