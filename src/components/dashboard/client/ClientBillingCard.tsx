
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export interface BillingInfo {
  totalHours: number;
  totalAmount: number;
  lastBilledDate: string;
  pendingAmount: number;
}

interface ClientBillingCardProps {
  loading: boolean;
  billingInfo: BillingInfo | null;
}

export const ClientBillingCard: React.FC<ClientBillingCardProps> = ({ loading, billingInfo }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <DollarSign className="mr-2 h-5 w-5" />
          Billing Information
        </CardTitle>
        <CardDescription>
          Summary of your billable hours and charges
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
          </div>
        ) : billingInfo ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{billingInfo.totalHours.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  As of {format(new Date(billingInfo.lastBilledDate), 'MMM d, yyyy')}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Billed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${billingInfo.totalAmount.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Lifetime billing amount
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl font-bold">${billingInfo.pendingAmount.toFixed(2)}</div>
                {billingInfo.pendingAmount > 0 && (
                  <div className="absolute top-2 right-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {billingInfo.pendingAmount > 0 ? 'Payment required' : 'No pending payments'}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No billing information available.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
