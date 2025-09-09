import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";
import UsersPage from "../pages/UserPage";
import EditUserPage from "../pages/EditUserPage";
import AddItemPage from "../pages/AddItemPage";
import CatalogPage from "../pages/CatalogPage";
import ReviewsPage from "../pages/ReviewPage";
import SettingsPage from "../pages/SettingPage";
import CommentsPage from "../pages/CommentsPage";
import SettingAdmin from "../pages/SettingAdmin";
import EditItemPage from "../pages/EditItemPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />   
          <Route path="edit-user/:userId" element={<EditUserPage />} />
          <Route path="add-item" element={<AddItemPage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="comments" element={<CommentsPage />} />
          <Route path="edit-admin" element={<SettingAdmin />} />
          <Route path="edit-items/:id" element={<EditItemPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;