import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard,
  Utensils, 
  Clock, 
  BarChart, 
  FileText, 
  User, 
  Menu, 
  X, 
  ChevronDown,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  
  const menuItems = [
    { title: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { title: "Meal Plan", path: "/meal-plan", icon: <Utensils size={20} /> },
    { title: "Workouts", path: "/workouts", icon: <Clock size={20} /> },
    { title: "Progress", path: "/progress", icon: <BarChart size={20} /> },
    { title: "Recipes", path: "/recipes", icon: <FileText size={20} /> },
  ];
  
  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out successfully",
    });
    navigate("/login");
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  // Get user display name and email
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';
  
  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Import useSubscription hook
  const { isPro, isLoading: subscriptionLoading } = useSubscription();
  
  return (
    <div className="min-h-screen w-full bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6 lg:hidden">
        <Button variant="outline" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
            <path d="M16 4C18.2091 4 20 5.79086 20 8C20 10.2091 18.2091 12 16 12C13.7909 12 12 10.2091 12 8C12 5.79086 13.7909 4 16 4Z" className="fill-primary" />
            <path d="M8 18C5.79086 18 4 16.2091 4 14C4 11.7909 5.79086 10 8 10C10.2091 10 12 11.7909 12 14C12 16.2091 10.2091 18 8 18Z" className="fill-primary" />
            <path d="M18 16C16.9391 16 15.9217 15.5786 15.1716 14.8284C14.4214 14.0783 14 13.0609 14 12L18 8C18.5304 8 19.0391 8.21071 19.4142 8.58579C19.7893 8.96086 20 9.46957 20 10L22 12C22 13.0609 21.5786 14.0783 20.8284 14.8284C20.0783 15.5786 19.0609 16 18 16Z" className="fill-primary/70" />
            <path d="M6 8C7.0609 8 8.07828 8.42143 8.82843 9.17157C9.57857 9.92172 10 10.9391 10 12L6 16C5.46957 16 4.96086 15.7893 4.58579 15.4142C4.21071 15.0391 4 14.5304 4 14L2 12C2 10.9391 2.42143 9.92172 3.17157 9.17157C3.92172 8.42143 4.96957 8 6 8Z" className="fill-primary/70" />
          </svg>
          <span className="text-lg font-bold">FitAI</span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />
          <div className="relative">
            <Button
              variant="ghost" 
              size="icon" 
              className="rounded-full" 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={displayName} />
                <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
              </Avatar>
            </Button>
            
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-card border">
                <div className="py-1 rounded-md bg-card shadow-xs" onClick={() => setUserMenuOpen(false)}>
                  <div className="px-4 py-2 text-sm border-b">
                    <div className={`font-medium ${isPro ? 'text-yellow-600' : ''} flex items-center gap-1`}>
                      {displayName}
                      {isPro && <Crown className="h-3 w-3 text-yellow-500" />}
                    </div>
                    <div className="text-muted-foreground">{userEmail}</div>
                  </div>
                  <Link to="/profile-setup" className="block px-4 py-2 text-sm hover:bg-accent">
                    Edit Profile
                  </Link>
                  {!isPro && (
                    <Link to="/upgrade-pro" className="block px-4 py-2 text-sm text-yellow-600 hover:bg-accent">
                      Upgrade to Pro
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-accent"
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar for mobile */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}
        onClick={toggleSidebar}
      >
        <div className="fixed inset-0 bg-black/50"></div>
        <div 
          className="fixed inset-y-0 left-0 w-64 flex-col bg-sidebar border-r p-4 shadow-lg transition-transform duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
                <path d="M16 4C18.2091 4 20 5.79086 20 8C20 10.2091 18.2091 12 16 12C13.7909 12 12 10.2091 12 8C12 5.79086 13.7909 4 16 4Z" className="fill-primary" />
                <path d="M8 18C5.79086 18 4 16.2091 4 14C4 11.7909 5.79086 10 8 10C10.2091 10 12 11.7909 12 14C12 16.2091 10.2091 18 8 18Z" className="fill-primary" />
                <path d="M18 16C16.9391 16 15.9217 15.5786 15.1716 14.8284C14.4214 14.0783 14 13.0609 14 12L18 8C18.5304 8 19.0391 8.21071 19.4142 8.58579C19.7893 8.96086 20 9.46957 20 10L22 12C22 13.0609 21.5786 14.0783 20.8284 14.8284C20.0783 15.5786 19.0609 16 18 16Z" className="fill-primary/70" />
                <path d="M6 8C7.0609 8 8.07828 8.42143 8.82843 9.17157C9.57857 9.92172 10 10.9391 10 12L6 16C5.46957 16 4.96086 15.7893 4.58579 15.4142C4.21071 15.0391 4 14.5304 4 14L2 12C2 10.9391 2.42143 9.92172 3.17157 9.17157C3.92172 8.42143 4.96957 8 6 8Z" className="fill-primary/70" />
              </svg>
              <span className="text-lg font-bold">FitAI</span>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close Menu</span>
            </Button>
          </div>
          
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActiveRoute(item.path) 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                }`}
                onClick={toggleSidebar}
              >
                <span className="mr-3">{item.icon}</span>
                {item.title}
              </Link>
            ))}
          </div>
          
          <div className="mt-auto pt-8">
            <div className="rounded-md bg-sidebar-accent p-4">
              <div className="flex items-center">
                <User className="h-10 w-10 rounded-full bg-primary/20 p-2 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium">Upgrade to Pro</p>
                  <p className="text-xs text-muted-foreground">Access all features</p>
                </div>
              </div>
              <Button className="mt-4 w-full">Upgrade</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen w-full">
        {/* Sidebar for desktop */}
        <aside className="hidden lg:flex h-screen w-64 flex-col border-r sticky top-0 bg-sidebar">
          <div className="flex h-16 items-center gap-2 px-4 border-b">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
              <path d="M16 4C18.2091 4 20 5.79086 20 8C20 10.2091 18.2091 12 16 12C13.7909 12 12 10.2091 12 8C12 5.79086 13.7909 4 16 4Z" className="fill-primary" />
              <path d="M8 18C5.79086 18 4 16.2091 4 14C4 11.7909 5.79086 10 8 10C10.2091 10 12 11.7909 12 14C12 16.2091 10.2091 18 8 18Z" className="fill-primary" />
              <path d="M18 16C16.9391 16 15.9217 15.5786 15.1716 14.8284C14.4214 14.0783 14 13.0609 14 12L18 8C18.5304 8 19.0391 8.21071 19.4142 8.58579C19.7893 8.96086 20 9.46957 20 10L22 12C22 13.0609 21.5786 14.0783 20.8284 14.8284C20.0783 15.5786 19.0609 16 18 16Z" className="fill-primary/70" />
              <path d="M6 8C7.0609 8 8.07828 8.42143 8.82843 9.17157C9.57857 9.92172 10 10.9391 10 12L6 16C5.46957 16 4.96086 15.7893 4.58579 15.4142C4.21071 15.0391 4 14.5304 4 14L2 12C2 10.9391 2.42143 9.92172 3.17157 9.17157C3.92172 8.42143 4.96957 8 6 8Z" className="fill-primary/70" />
            </svg>
            <span className="text-lg font-bold">FitAI</span>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            <nav className="flex flex-col space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActiveRoute(item.path) 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.title}
                </Link>
              ))}
            </nav>
            
            <div className="mt-8 rounded-md bg-sidebar-accent p-4">
              <div className="flex items-center">
                <User className="h-10 w-10 rounded-full bg-primary/20 p-2 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium">Upgrade to Pro</p>
                  <p className="text-xs text-muted-foreground">Access all features</p>
                </div>
              </div>
              <Button className="mt-4 w-full">Upgrade</Button>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-h-screen">
          {/* Desktop Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 lg:px-8 hidden lg:flex">
            <div className="flex-1 text-lg font-semibold">
              {/* Page title will go here */}
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              
              <div className="relative">
                <Button
                  variant="ghost" 
                  className="flex items-center gap-2 rounded-full" 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={displayName} />
                    <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                  </Avatar>
                  <span className={`hidden lg:inline ${isPro ? 'text-yellow-600 font-semibold' : ''} flex items-center gap-1`}>
                    {displayName}
                    {isPro && <Crown className="h-4 w-4 text-yellow-500" />}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-card border">
                    <div className="py-1 rounded-md bg-card shadow-xs" onClick={() => setUserMenuOpen(false)}>
                      <div className="px-4 py-2 text-sm border-b">
                        <div className={`font-medium ${isPro ? 'text-yellow-600' : ''} flex items-center gap-1`}>
                          {displayName}
                          {isPro && <Crown className="h-3 w-3 text-yellow-500" />}
                        </div>
                        <div className="text-muted-foreground">{userEmail}</div>
                      </div>
                      <Link to="/profile-setup" className="block px-4 py-2 text-sm hover:bg-accent">
                        Edit Profile
                      </Link>
                      {!isPro && (
                        <Link to="/upgrade-pro" className="block px-4 py-2 text-sm text-yellow-600 hover:bg-accent">
                          Upgrade to Pro
                        </Link>
                      )}
                      <button 
                        onClick={handleLogout} 
                        className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-accent"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
