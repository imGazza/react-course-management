import { RouterProvider } from 'react-router';
import { routes } from '@/routing/routes';

function App() {

  return (
    <>  
      <RouterProvider router={routes} />
    </>
  )
}

export default App
