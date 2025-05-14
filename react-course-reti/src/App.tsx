import { RouterProvider } from 'react-router';
import { router } from '@/07-routing/router';
import ErrorBoundary from './01-features/shared/errors/error-boundary-default';

function App() {

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}

export default App
