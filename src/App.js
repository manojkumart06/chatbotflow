
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import Home from './pages/home/Home.js';
import ErrorPage from './components/UI/ErrorPage.js';

// The main App component
function App() {
  return (
    <>
      {/* Toaster component to display toast notifications at the top-center of the screen */}
      <Toaster position={'top-center'} />

      {/* BrowserRouter provides the routing context for the application */}
      <BrowserRouter>
        {/* Routes component to define the different routes in the application */}
        <Routes>
          {/* Route to display the ErrorPage component for any unmatched URL paths */}
          <Route path={'*'} element={<ErrorPage />} />

          {/* Route to display the Home component for the root URL path */}
          <Route path={'/'} element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
