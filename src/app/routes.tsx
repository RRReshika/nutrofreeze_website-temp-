import { Navigate, Outlet, createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { RecipesPage } from "./pages/RecipesPage";
import { AboutPage } from "./pages/AboutPage";
import { ReviewsPage } from "./pages/ReviewsPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { AccountPage } from "./pages/AccountPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { ScrollToTop } from "./components/ScrollToTop";

function AdminRootRedirect() {
  return <Navigate to="/admin/dashboard" replace />;
}

function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        path: "/",
        Component: HomePage,
      },
      {
        path: "/recipes",
        Component: RecipesPage,
      },
      {
        path: "/about",
        Component: AboutPage,
      },
      {
        path: "/reviews",
        Component: ReviewsPage,
      },
      {
        path: "/login",
        Component: LoginPage,
      },
      {
        path: "/signin",
        Component: LoginPage,
      },
      {
        path: "/signup",
        Component: SignupPage,
      },
      {
        path: "/account",
        Component: AccountPage,
      },
      {
        path: "/profile",
        Component: AccountPage,
      },
      {
        path: "/checkout",
        Component: CheckoutPage,
      },
      {
        path: "/admin",
        Component: AdminRootRedirect,
      },
      {
        path: "/admin/login",
        Component: AdminLoginPage,
      },
      {
        path: "/admin/dashboard",
        Component: AdminDashboardPage,
      },
    ],
  },
]);