import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/20">
      <div className="text-center space-y-6 max-w-2xl mx-auto p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-elevated">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          KnightCall AI
        </h1>
        <p className="text-xl text-muted-foreground">
          Advanced Voice AI Platform Admin Panel
        </p>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Manage organizations, agents, billing, and monitor real-time analytics for your voice AI calling platform.
        </p>
        <div className="pt-4 flex justify-center">
          <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 shadow-elevated" data-testid="button-government-signin">
            <Link to="/auth">
              Government Sign In
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
