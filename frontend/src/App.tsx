import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Auth } from "./pages/Auth";
import RegisterPage from "./pages/RegisterPage";
import ProductPage from "./pages/ProductPage";
import ProtectedRoute from "./router/ProtectedRoute";
import { AuthProvider } from "./context/AuthProvider";
import "./assets/styles/index.css";

const App = () => {
  return (
    <AuthProvider>
      <div className="relative w-full h-screen overflow-hidden">
        {/* Nuevo fondo de Aurora basado en SVG */}
        <div className="absolute inset-0 -z-10">
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
          >
            <path
              fill="#4b1167"
              fillOpacity="0.8"
              d="M0,160L48,176C96,192,192,224,288,234.7C384,245,480,235,576,218.7C672,203,768,181,864,181.3C960,181,1056,203,1152,197.3C1248,192,1344,160,1392,144L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            />
          </svg>
        </div>

        <Router>
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <Routes>
              <Route path="/" element={<Auth />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* ✅ Rutas protegidas */}
              <Route element={<ProtectedRoute />}>
                <Route path="/products" element={<ProductPage />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </div>
    </AuthProvider>
  );
};

export default App;
