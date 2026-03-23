import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CreateListingPage from "./pages/CreateListingPage";
import MyListingsPage from "./pages/MyListingsPage";
import VerificationPage from "./pages/VerificationPage";
import SellerAnalyticsPage from "./pages/SellerAnalyticsPage";
import BrowseListingsPage from "./pages/BrowseListingsPage";
import SavedItemsPage from "./pages/SavedItemsPage";
import ContactSellersPage from "./pages/ContactSellersPage";
import ListingDetailPage from "./pages/ListingDetailPage";

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/listings/new"
            element={
              <ProtectedRoute allowedRoles={["seller", "admin"]}>
                <CreateListingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/listings"
            element={
              <ProtectedRoute allowedRoles={["seller", "admin"]}>
                <MyListingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/analytics"
            element={
              <ProtectedRoute allowedRoles={["seller", "admin"]}>
                <SellerAnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verification"
            element={
              <ProtectedRoute allowedRoles={["admin", "verifier"]}>
                <VerificationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/browse"
            element={
              <ProtectedRoute allowedRoles={["buyer", "seller", "admin"]}>
                <BrowseListingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/listing/:id"
            element={
              <ProtectedRoute allowedRoles={["buyer", "seller", "admin"]}>
                <ListingDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/saved"
            element={
              <ProtectedRoute allowedRoles={["buyer", "seller", "admin"]}>
                <SavedItemsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/contact"
            element={
              <ProtectedRoute allowedRoles={["buyer", "seller", "admin"]}>
                <ContactSellersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/messages"
            element={
              <ProtectedRoute allowedRoles={["seller", "admin"]}>
                <ContactSellersPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
