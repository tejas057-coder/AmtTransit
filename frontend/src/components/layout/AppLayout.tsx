import { AppSidebar } from "./AppSidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <main className="flex-1 lg:ml-[280px] mt-14 lg:mt-0 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
