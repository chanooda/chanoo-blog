import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Root } from './Root';

const router = createBrowserRouter([{ path: '*', Component: Root }]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
