
import { Routes, Route, useLocation } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import DepositionManagement from "@/components/deposition-management/DepositionManagement";
import DepositionForm from "@/components/deposition-management/DepositionForm";
import DepositionDetail from "@/components/deposition-management/DepositionDetail";

const Depositions = () => {
  const location = useLocation();
  
  // Determine page title based on route
  const getPageTitle = () => {
    if (location.pathname.includes("/create")) {
      return "Create Deposition";
    } else if (location.pathname.includes("/edit")) {
      return "Edit Deposition";
    } else if (location.pathname.split("/").length > 2 && !location.pathname.includes("/edit")) {
      return "Deposition Details";
    } else {
      return "Deposition Management";
    }
  };

  // Determine page description based on route
  const getPageDescription = () => {
    if (location.pathname.includes("/create")) {
      return "Create a new deposition record";
    } else if (location.pathname.includes("/edit")) {
      return "Modify an existing deposition";
    } else if (location.pathname.split("/").length > 2 && !location.pathname.includes("/edit")) {
      return "View detailed deposition information";
    } else {
      return "Manage client depositions, schedules, and documentation";
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
          <p className="text-muted-foreground mt-1">
            {getPageDescription()}
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<DepositionManagement />} />
            <Route path="/create" element={<DepositionForm />} />
            <Route path="/edit/:id" element={<DepositionForm />} />
            <Route path="/:id" element={<DepositionDetail />} />
          </Routes>
        </div>
      </div>
      
      <footer className="px-4 py-6 border-t text-sm text-muted-foreground">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">LYZ Law Firm</span> | Deposition Management
          </div>
          <div className="text-sm">© 2023 LYZ Law Firm. All rights reserved.</div>
        </div>
      </footer>
    </PageLayout>
  );
};

export default Depositions;
