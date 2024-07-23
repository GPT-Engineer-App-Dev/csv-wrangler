import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <main className="min-h-screen w-full flex">
      <Outlet />
    </main>
  );
};

export default Layout;
