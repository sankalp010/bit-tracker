import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';

import Home from './pages/Home';
import { LinearProgress } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Footer from './components/Footer';
import Alert from './components/Alert';
const CoinPage = lazy(() => import('./pages/CoinPage'));
function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: "#fff"
      }
    },
  });
  return (
    <BrowserRouter>
      <ThemeProvider theme={darkTheme}>
        <div className="app-shell">
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/coins/:id' element={<Suspense fallback={<LinearProgress sx={{ backgroundColor: 'gold' }} />}><CoinPage /></Suspense>} />
          </Routes>
          <Footer />
        </div>
        <Alert />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
