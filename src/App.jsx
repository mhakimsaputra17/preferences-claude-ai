import Register from "./pages/Register";
import Login from "./pages/Login";
import { Route, Routes, BrowserRouter, Navigate } from "react-router";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="transition-all duration-300">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/register" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
