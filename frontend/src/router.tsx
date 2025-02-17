import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Auth } from "./pages/Auth";
import { Home } from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import ProtectedRoute from "./router/ProtectedRoute";
import { AuthProvider } from "./context/AuthProvider";

const AppRouter = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/products" element={<ProductPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRouter;


