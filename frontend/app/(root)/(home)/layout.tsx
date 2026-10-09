import type { Metadata } from "next";
import "../globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom/screen/sidebar/Sidebar";
import RouteGuard from "@/components/custom/utils/RouteGuard";
import { Toaster } from "sonner";
import { DemoToolbar } from "@/components/custom/demo/DemoToolbar";

export const metadata: Metadata = {
  title: "LakerLogs",
  description: "SPRING 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <SidebarProvider>
          <div className="flex w-full min-h-screen h-screen">
            <AppSidebar />
            <main className="w-full overflow-y-auto min-h-0">
              <div className="sticky top-0 z-30"><DemoToolbar /></div>
              <div className="max-w-7xl mx-auto pt-10 sm:pt-12 px-4 sm:px-6">
                <RouteGuard>{children}</RouteGuard>
              </div>
            </main>
          </div>
          <Toaster position="top-right" richColors />
        </SidebarProvider>
    </>
  );
}
