import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { ClientRegister } from './pages/ClientRegister.tsx';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

import './assets/globals.css';
import { ProductRegister } from './pages/ProductRegister.tsx';
import { SaleRegister } from './pages/SaleRegister.tsx';
import { ViewStock } from './pages/ViewStock.tsx';
import { SearchClient } from './pages/SearchClient.tsx';
import { ViewReport } from './pages/ViewReport.tsx';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to='/register/client' />,
  },
  {
    path: "/register/client",
    element: <ClientRegister />
  },
  {
    path: "/register/product",
    element: <ProductRegister />
  },
  {
    path: "/register/sale",
    element: <SaleRegister />
  },
  {
    path: "/view/stock",
    element: <ViewStock />
  },
  {
    path: "/view/client",
    element: <SearchClient />
  },
  {
    path: "/view/report",
    element: <ViewReport />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
