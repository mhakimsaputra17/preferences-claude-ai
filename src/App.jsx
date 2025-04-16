import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import { Route, Routes, BrowserRouter, Navigate } from "react-router";
import ProtectedRoute from "./routes/ProtectedRoute";
import { Provider } from "react-redux";
import { store } from "./store/store";

function App() {
  return (
    <>
      <BrowserRouter>
        <Provider store={store}>
          <div className="transition-all duration-300">
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/register" />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
