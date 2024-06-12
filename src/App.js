
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Toaster} from "react-hot-toast";

function App() {
  return (
    <>
    <Toaster position={'top-center'} />
    <BrowserRouter>
        <Routes>
            <Route path={'*'} element={<ErrorPage />} />
            <Route path={'/'} element={<Home />} />
        </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
