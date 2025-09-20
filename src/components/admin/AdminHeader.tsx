import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "./ThemeToggle";

export function AdminHeader() {
  return (
    <header className="h-16 border-b border-sidebar-border bg-sidebar backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-sidebar-foreground hover:bg-sidebar-accent" />
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sidebar-foreground/60 w-4 h-4" />
          <Input
            placeholder="Search organizations, agents, users..."
            className="pl-10 w-80 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/60"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Button variant="ghost" size="sm" className="relative hover:bg-sidebar-accent">
          <Bell className="w-4 h-4 text-sidebar-foreground" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </Button>
        
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-primary text-primary-foreground">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <div className="font-medium text-sidebar-foreground">Admin User</div>
            <div className="text-xs text-sidebar-foreground/70">System Administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
}