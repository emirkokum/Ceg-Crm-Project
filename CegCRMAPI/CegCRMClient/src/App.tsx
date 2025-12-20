import { AppSidebar } from "./components/AppSidebar";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { SiteHeader } from "./components/SiteHeader";
import { Outlet } from "react-router-dom";
import PageWrapper from "./components/PageWrapper";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "sonner";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <PageWrapper>
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  <Outlet />
                </div>
              </PageWrapper>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster position="top-right" richColors/>
    </ThemeProvider>
  );
}

export default App;
