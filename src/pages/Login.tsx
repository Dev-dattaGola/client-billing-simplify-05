
import { useState, useEffect } from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, Building, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remember, setRemember] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  // Get the intended destination from location state or use dashboard as default
  const from = location.state?.from?.pathname || "/dashboard";

  // Check authentication status on component mount
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Prevent rendering login form if already authenticated
  if (isAuthenticated) {
    console.log("Rendering redirect to:", from);
    return <Navigate to={from} replace />;
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
      const user = await login({ 
        email: email.toLowerCase().trim(),
        password, 
        remember 
      });
      
      if (!user) {
        setError("Login failed. Please check your credentials.");
        setIsLoading(false);
        return;
      }
      
      // Success will be handled by the effect hook that watches isAuthenticated
      console.log("Login successful, user:", user.name);
    } catch (error) {
      console.error("Login error:", error);
      setError(typeof error === 'string' ? error : "Authentication failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 px-4">
      <Card className="w-full max-w-md bg-violet-600">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/lovable-uploads/1d5c7458-1307-40b3-93c7-a63e609301c6.png" 
              alt="LAWerp500 Logo" 
              className="h-44"
            />
          </div>
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
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={isLoading || authLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-white">Password</Label>
              </div>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isLoading || authLoading}
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-lawfirm-light-blue focus:ring-lawfirm-light-blue"
                disabled={isLoading || authLoading}
              />
              <Label htmlFor="remember" className="text-sm text-white">
                Remember me
              </Label>
            </div>

            <div className="bg-blue-50 p-3 rounded-md mt-4">
              <h3 className="text-sm font-medium text-blue-800 flex items-center">
                <Building className="w-4 h-4 mr-2" />
                Available test accounts:
              </h3>
              <div className="mt-2 space-y-1 text-xs text-blue-700">
                <p><strong>Admin:</strong> admin@lyzlawfirm.com / admin123</p>
                <p><strong>Attorney:</strong> attorney@lyzlawfirm.com / attorney123</p>
                <p><strong>Client:</strong> client@example.com / client123</p>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-lawfirm-light-blue hover:bg-lawfirm-light-blue/90"
              disabled={isLoading || authLoading}
            >
              {isLoading || authLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          <div className="text-white">© 2025 LAWerp500. All rights reserved.</div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
