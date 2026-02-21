import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { useSkills } from "@/lib/skills-store";
import { Shield, Package, Upload, LayoutDashboard, X, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const HINT_KEY = "skillguard_admin_hint_shown";

export function Header() {
  const { role, setRole } = useSkills();
  const location = useLocation();
  const navigate = useNavigate();
  const [showHint, setShowHint] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === "/submit" && !localStorage.getItem(HINT_KEY)) {
      const timer = setTimeout(() => setShowHint(true), 600);
      return () => clearTimeout(timer);
    } else {
      setShowHint(false);
    }
  }, [location.pathname]);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const dismissHint = () => {
    setShowHint(false);
    localStorage.setItem(HINT_KEY, "true");
  };

  const navItems = [
    { to: "/", label: "Home", icon: Shield },
    { to: "/marketplace", label: "Marketplace", icon: Package },
    { to: "/submit", label: "Submit Skill", icon: Upload },
  ];

  if (role === "admin") {
    navItems.push({ to: "/admin", label: "Review Dashboard", icon: LayoutDashboard });
  }

  const roleToggle = (
    <div className="flex items-center gap-3 text-sm">
      <span className={`font-medium ${role === "employee" ? "text-foreground" : "text-muted-foreground"}`}>
        Employee
      </span>
      <Switch
        checked={role === "admin"}
        onCheckedChange={(checked) => {
          dismissHint();
          const newRole = checked ? "admin" : "employee";
          setRole(newRole);
          if (newRole === "employee" && location.pathname === "/admin") {
            navigate("/");
          }
        }}
      />
      <span className={`font-medium ${role === "admin" ? "text-foreground" : "text-muted-foreground"}`}>
        Admin
      </span>
    </div>
  );

  return (
    <>
      {showHint && (
        <div className="fixed inset-0 z-40 bg-black/50 animate-in fade-in-0" onClick={dismissHint} />
      )}
      <header className={`sticky top-0 border-b bg-card/80 backdrop-blur-sm ${showHint ? "z-50" : "z-40"}`}>
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
              <Shield className="h-5 w-5 text-primary" />
              <span>SkillGuard</span>
              <span className="hidden sm:inline rounded-md bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 leading-none">Enterprise</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Desktop role toggle */}
          <div className="relative hidden md:flex items-center gap-3 text-sm">
            {showHint && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border bg-popover p-3 shadow-lg animate-in fade-in-0 slide-in-from-top-2 z-50">
                <div className="absolute -top-1.5 right-6 h-3 w-3 rotate-45 border-l border-t bg-popover" />
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs text-popover-foreground leading-relaxed">
                    <span className="font-semibold">Tip:</span> Toggle to <span className="font-semibold">Admin</span> mode to access the Review Dashboard and manage submitted skills.
                  </p>
                  <button onClick={dismissHint} className="shrink-0 rounded-sm p-0.5 text-muted-foreground hover:text-foreground transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
            {roleToggle}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 pt-10">
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = location.pathname === item.to;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
                <Separator className="my-4" />
                <div className="px-3">
                  <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Role</p>
                  {roleToggle}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
