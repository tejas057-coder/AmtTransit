import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";

/**
 * MainLayout Component
 * 
 * Provides persistent bottom navigation with page content area
 * Works like Instagram/Rapido - navbar stays fixed, only content changes
 * 
 * Usage:
 * <MainLayout />
 *   └─ <Outlet /> (renders page content)
 */
export function MainLayout() {
  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      {/* Main Content Area - grows to fill available space */}
      <main className="flex-1 overflow-y-auto pb-24 lg:pb-0">
        {/* Page content renders here via <Outlet /> */}
        <Outlet />
      </main>

      {/* Fixed Bottom Navigation - visible on mobile only */}
      <BottomNav />
    </div>
  );
}
