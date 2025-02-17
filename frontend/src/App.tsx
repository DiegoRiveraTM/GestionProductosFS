import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Auth } from "./pages/Auth";
import { Home } from "./pages/Home";
import RegisterPage from "./pages/RegisterPage";
import ProductPage from "./pages/ProductPage"; // ✅ Importa correctamente la página de productos
import ProtectedRoute from "./router/ProtectedRoute";
import { AuthProvider } from "./context/AuthProvider";
import "./assets/styles/index.css";  

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* ✅ Rutas protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route path="/products" element={<ProductPage />} /> {/* 🔥 Usa ProductPage aquí */}
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
