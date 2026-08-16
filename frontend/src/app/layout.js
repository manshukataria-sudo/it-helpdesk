import "./globals.css";

export const metadata = {
  title: "IT Helpdesk",
  description: "IT Helpdesk Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}