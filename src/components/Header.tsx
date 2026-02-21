import { Link, useLocation, useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { useSkills } from "@/lib/skills-store";
import { Shield, Package, Upload, LayoutDashboard } from "lucide-react";

export function Header() {
  const { role, setRole } = useSkills();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { to: "/", label: "Marketplace", icon: Package },
    { to: "/submit", label: "Submit Skill", icon: Upload },
  ];

  if (role === "admin") {
    navItems.push({ to: "/admin", label: "Review Dashboard", icon: LayoutDashboard });
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <Shield className="h-5 w-5 text-primary" />
            <span>SkillGuard</span>
            <span className="rounded-md bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 leading-none">Enterprise</span>
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
        <div className="flex items-center gap-3 text-sm">
          <span className={`font-medium ${role === "employee" ? "text-foreground" : "text-muted-foreground"}`}>
            Employee
          </span>
          <Switch
            checked={role === "admin"}
            onCheckedChange={(checked) => {
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
      </div>
    </header>
  );
}
