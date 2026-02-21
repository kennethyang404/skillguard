import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SkillsProvider, useSkills } from "@/lib/skills-store";
import { Layout } from "@/components/Layout";
import Marketplace from "./pages/Marketplace";
import SkillDetail from "./pages/SkillDetail";
import SubmissionPortal from "./pages/SubmissionPortal";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AdminGuard() {
  const { role } = useSkills();
  return role === "admin" ? <AdminDashboard /> : <Navigate to="/" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SkillsProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Marketplace />} />
              <Route path="/skill/:id" element={<SkillDetail />} />
              <Route path="/submit" element={<SubmissionPortal />} />
              <Route path="/admin" element={<AdminGuard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </SkillsProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
