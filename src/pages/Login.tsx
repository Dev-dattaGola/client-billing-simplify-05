
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, Building } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    try {
      await login(email, password);
      toast({
        title: "Success",
        description: "You have successfully logged in",
      });
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-lawfirm-light-blue rounded-md flex items-center justify-center text-white text-xl font-bold">
              LYZ
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">LYZ Law Firm</CardTitle>
          <CardDescription className="text-center text-xs text-gray-500">
            LAW EMR
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="bg-blue-50 p-3 rounded-md mt-4">
              <h3 className="text-sm font-medium text-blue-800 flex items-center">
                <Building className="w-4 h-4 mr-2" />
                Available test accounts:
              </h3>
              <div className="mt-2 space-y-1 text-xs text-blue-700">
                <p><strong>Admin:</strong> admin@lawerp.com / admin123</p>
                <p><strong>Attorney:</strong> attorney@lawerp.com / admin123</p>
                <p><strong>Client:</strong> client@lawerp.com / admin123</p>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-lawfirm-light-blue hover:bg-lawfirm-light-blue/90"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          <div>© 2023 LYZ Law Firm. All rights reserved.</div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
