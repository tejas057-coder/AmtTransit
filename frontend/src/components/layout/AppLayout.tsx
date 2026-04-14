import { AppSidebar } from "./AppSidebar";
import { BottomNav } from "./BottomNav";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <main className="flex-1 lg:ml-[280px] mt-14 lg:mt-0 mb-20 lg:mb-0 overflow-hidden">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
