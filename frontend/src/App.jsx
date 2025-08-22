// Theme Provider
import { Router } from './routes/Router.jsx';

import { RouterProvider } from 'react-router-dom';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { baselightTheme } from './theme/DefaultColors';
// Tostify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Cheating Log Provider
import { CheatingLogProvider } from './context/CheatingLogContext';

import StudentDashboard from "./views/student/StudentDashboard";


// Redux Provider
import { Provider } from 'react-redux';
import store from './store';

function App() {
  const theme = baselightTheme;
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <CheatingLogProvider>
          <ToastContainer />
          <CssBaseline />
          <RouterProvider router={Router} />
        </CheatingLogProvider>
      </Provider>
    </ThemeProvider>

    
  );
}

export default App;
