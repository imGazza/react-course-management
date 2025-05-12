import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { toaster } from './02-components/utils/toaster.tsx';
import { ErrorMessage } from './02-components/utils/error-messages.tsx';


export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: () => {      
      toaster.errorToast(ErrorMessage.FETCH_ERROR);
    },
  }),
}

);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
)
