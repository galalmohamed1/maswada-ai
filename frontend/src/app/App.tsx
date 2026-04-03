import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AppLayout } from "@/app/layout/AppLayout";
import { HomePage } from "@/app/pages/HomePage";
import { NotFoundPage } from "@/app/pages/NotFoundPage";
import SignInPage from "@/app/pages/SignInPage";
import SignUpPage from "@/app/pages/SignUpPage";
import NoteDetailsPage from "@/app/pages/NoteDetailsPage";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { LanguageProvider } from "@/contexts/LanguageProvider";
import { IntlWrapper } from "@/components/common/IntlWrapper";
import { defaultLocale, supportedLocales } from "@/i18n";
import { ToastContainer } from "react-toastify";

// Component to redirect root to default locale
function LocaleRedirect() {
  const savedLocale = localStorage.getItem("localle") || defaultLocale;
  const locale = supportedLocales.includes(savedLocale)
    ? savedLocale
    : defaultLocale;
  return <Navigate to={`/${locale}`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <IntlWrapper>
          <Routes>
            {/* Redirect root to default locale */}
            <Route path="/" element={<LocaleRedirect />} />

            {/* Locale-prefixed routes */}
            <Route path="/:locale">
              <Route path="sign-in" element={<SignInPage />} />
              <Route path="sign-up" element={<SignUpPage />} />

              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }>
                <Route index element={<HomePage />} />
                <Route path="notes/:id" element={<NoteDetailsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Route>

            {/* Catch all other routes and redirect to locale-prefixed version */}
            <Route
              path="*"
              element={<Navigate to={`/${defaultLocale}`} replace />}
            />
          </Routes>
          <ToastContainer />
        </IntlWrapper>
      </LanguageProvider>
    </BrowserRouter>
  );
}
