import { RouterProvider } from "react-router";
import { router } from "./routes";
import { CartProvider } from "./lib/cart";
import { AuthProvider } from "./lib/auth-context";
import { AdminAuthProvider } from "./lib/admin-auth-context";
import { Toaster } from "sonner";

export default function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" richColors closeButton />
        </CartProvider>
      </AdminAuthProvider>
    </AuthProvider>
  );
}
