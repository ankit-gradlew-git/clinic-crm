import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ToastContainer from "../common/Toast";
import GlobalSearchModal from "./GlobalSearchModal";

export default function Layout({
  children,
  onQuickAction,
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <Navbar
          onMobileMenuClick={() => setMobileSidebarOpen(true)}
          onQuickAction={onQuickAction}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Utilities */}
      <GlobalSearchModal />
      <ToastContainer />
    </div>
  );
}
