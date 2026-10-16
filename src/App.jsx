import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";
import Layout from "./components/layout/Layout";
import Auth from "./pages/Auth";
import BusDetails from "./pages/BusDetails";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="search" element={<Search />} />
              <Route path="bus/:busId" element={<BusDetails />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="confirmation" element={<Confirmation />} />
              <Route path="login" element={<Auth mode="login" />} />
              <Route path="signup" element={<Auth mode="signup" />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </BookingProvider>
    </AuthProvider>
  );
}
