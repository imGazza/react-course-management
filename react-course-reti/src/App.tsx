import { RouterProvider } from 'react-router';
import { routes } from '@/07-routing/routes';

function App() {

  return (
    <RouterProvider router={routes} />
  )
}

export default App
