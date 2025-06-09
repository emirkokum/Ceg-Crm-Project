import { AppSidebar } from "./components/AppSidebar";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { SiteHeader } from "./components/SiteHeader";
import { Routes, Route, Navigate } from "react-router-dom";
import PageWrapper from "./components/PageWrapper";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Import your page components here
// import { Dashboard } from './pages/Dashboard';
// import { Customers } from './pages/Customers';
// etc...

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SidebarProvider>
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <PageWrapper>
                  <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <Routes>
                      {/* Public routes */}
                      <Route path="/login" element={<div>Login Page</div>} />
                      <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />

                      {/* Protected routes */}
                      <Route element={<ProtectedRoute allowedRoles={['Admin', 'SalesPerson', 'SupportAgent', 'Assistant']} />}>
                        <Route path="/dashboard" element={<div>Dashboard Page</div>} />
                      </Route>

                      <Route element={<ProtectedRoute allowedRoles={['Admin', 'SalesPerson', 'SupportAgent', 'Assistant']} />}>
                        <Route path="/customers" element={<div>Customers Page</div>} />
                      </Route>

                      <Route element={<ProtectedRoute allowedRoles={['Admin', 'SalesPerson']} />}>
                        <Route path="/leads" element={<div>Leads Page</div>} />
                        <Route path="/sales" element={<div>Sales Page</div>} />
                      </Route>

                      <Route element={<ProtectedRoute allowedRoles={['Admin', 'SupportAgent']} />}>
                        <Route path="/tickets" element={<div>Tickets Page</div>} />
                      </Route>

                      <Route element={<ProtectedRoute allowedRoles={['Admin', 'SalesPerson', 'SupportAgent', 'Assistant']} />}>
                        <Route path="/interactions" element={<div>Interactions Page</div>} />
                      </Route>

                      <Route element={<ProtectedRoute allowedRoles={['Admin', 'Assistant']} />}>
                        <Route path="/tasks" element={<div>Tasks Page</div>} />
                      </Route>

                      <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                        <Route path="/settings" element={<div>Settings Page</div>} />
                      </Route>

                      {/* Redirect root to dashboard */}
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </div>
                </PageWrapper>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
