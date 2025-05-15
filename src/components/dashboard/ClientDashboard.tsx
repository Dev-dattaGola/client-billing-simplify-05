
import { useAuth } from "@/contexts/AuthContext";
import { useClientData } from "@/hooks/useClientData";
import { ClientCasesCard } from "./client/ClientCasesCard";
import { ClientCourtDatesCard } from "./client/ClientCourtDatesCard";
import { ClientBillingCard } from "./client/ClientBillingCard";

const ClientDashboard = () => {
  const { currentUser } = useAuth();
  const { loading, clientCases, courtDates, billingInfo } = useClientData({ 
    userId: currentUser?.id 
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Your Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back. Here's an overview of your cases and upcoming activities.
        </p>
      </div>

      {/* Case Information Section */}
      <ClientCasesCard 
        loading={loading} 
        clientCases={clientCases} 
      />

      {/* Court Dates Section */}
      <ClientCourtDatesCard 
        loading={loading} 
        courtDates={courtDates} 
      />

      {/* Billing Information Section */}
      <ClientBillingCard 
        loading={loading} 
        billingInfo={billingInfo} 
      />
    </div>
  );
};

export default ClientDashboard;
