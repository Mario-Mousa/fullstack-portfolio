import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/useMobile";
import { BadgeCheck, FolderKanban, LayoutDashboard, LogOut, Mail, PanelLeft, UserRound } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/admin" },
  { icon: UserRound, label: "Profile", path: "/admin/profile" },
  { icon: FolderKanban, label: "Projects", path: "/admin/projects" },
  { icon: BadgeCheck, label: "Certificates", path: "/admin/certificates" },
  { icon: Mail, label: "Messages", path: "/admin/messages" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user) setLocation("/admin/login");
  }, [loading, user, setLocation]);

  if (loading || !user) return <div className="admin-loading">Redirecting to secure sign in…</div>;
  if (!user.isOwner) return <div className="admin-login"><div className="admin-login-card glass-panel"><p className="eyebrow"><span />RESTRICTED</p><h1>This workspace is reserved for the portfolio owner.</h1><a className="admin-button" href="/">Return to public portfolio</a></div></div>;

  return <SidebarProvider><DashboardLayoutContent>{children}</DashboardLayoutContent></SidebarProvider>;
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const isMobile = useIsMobile();
  const currentItem = menuItems.find(item => item.path === location) ?? menuItems[0];
  const signOut = async () => { await logout(); setLocation("/admin/login"); };
  return <>
    <Sidebar className="admin-sidebar" collapsible="icon">
      <SidebarHeader className="admin-sidebar-header"><button className="admin-logo" onClick={() => setLocation("/admin")}><span className="brand-mark">&lt;/&gt;</span><span>OWNER<br /><b>WORKSPACE</b></span></button></SidebarHeader>
      <SidebarContent><SidebarMenu className="px-2 py-3">{menuItems.map(item => <SidebarMenuItem key={item.path}><SidebarMenuButton isActive={location === item.path} tooltip={item.label} onClick={() => setLocation(item.path)} className="admin-menu-item"><item.icon size={17} /><span>{item.label}</span></SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu></SidebarContent>
      <SidebarFooter className="admin-sidebar-footer"><div className="admin-user"><Avatar><AvatarFallback>{user?.name?.slice(0, 1).toUpperCase() || "O"}</AvatarFallback></Avatar><div><b>{user?.name || "Owner"}</b><span>Portfolio owner</span></div></div><button className="admin-logout" onClick={() => void signOut()}><LogOut size={15} /><span>Sign out</span></button></SidebarFooter>
    </Sidebar>
    <SidebarInset className="admin-inset">{isMobile ? <header className="admin-mobile-header"><SidebarTrigger /><span>{currentItem.label}</span></header> : null}<main className="admin-main">{children}</main></SidebarInset>
  </>;
}
