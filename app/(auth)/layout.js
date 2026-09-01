import "../globals.css";

export default function AuthLayout({ children }) {
  return (
    <div className="w-screen h-screen overflow-hidden">
      {children}
    </div>
  );
}