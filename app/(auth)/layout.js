import "../globals.css";

export default function AuthLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased m-0 p-0 overflow-hidden bg-[#2d3a2e]">
        {children}
      </body>
    </html>
  );
}