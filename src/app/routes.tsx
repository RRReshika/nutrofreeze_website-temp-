import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { RecipesPage } from "./pages/RecipesPage";
import { AboutPage } from "./pages/AboutPage";
import { ReviewsPage } from "./pages/ReviewsPage";

export const router = createBrowserRouter([
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
]);