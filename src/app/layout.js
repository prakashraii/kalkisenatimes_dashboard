import { ToastProvider } from "@/components/Toast";
import "./globals.css";

export const metadata = {
  title: "Kalki Sena Admin",
  description: "Admin dashboard for Kalki Sena",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
