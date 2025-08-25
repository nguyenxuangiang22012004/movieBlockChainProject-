import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Homepage from "../pages/Homepage";
import MainLayout from "../layouts/MainLayout";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import DetailsPage from "../pages/DetailsPage";
import CatalogPage from "../pages/CatalogPage";
import PricingPage from "../pages/PricingPage";
import PrivacyPage from "../pages/PrivacyPage";
import ContactsPage from "../pages/ContactsPage";
import FaqPage from "../pages/FaqPage";
import AboutPage from "../pages/AboutPage";
import ActorPage from "../pages/ActorPage";
import ProfilePage from "../pages/ProfilePage";
import NotFoundPage from "../pages/404/NotFoundPage"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} /> 
        <Route element={<MainLayout />}>
          <Route index element={<Homepage />} />
          <Route path="/details/:movieId" element={<DetailsPage />} />
          <Route path="/catalog" element={<CatalogPage />} /> 
          <Route path="/pricing" element={<PricingPage />} /> 
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/faq" element={<FaqPage />} /> 
          <Route path="/about" element={<AboutPage />} />
          <Route path="/actor/:actorId" element={<ActorPage />} />
          <Route path="/profile" element={<ProfilePage />} /> 
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
