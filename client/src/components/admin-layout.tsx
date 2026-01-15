import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, FileText, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const sidebarItems = [
    { icon: LayoutDashboard, label: "Tableau de bord", href: "/admin/dashboard" },
    { icon: FileText, label: "Demandes", href: "/admin/applications" },
    { icon: Users, label: "Utilisateurs", href: "/admin/users" },
    { icon: Settings, label: "Paramètres", href: "/admin/settings" },
];

export function AdminLayout({ children }: AdminLayoutProps) {
    const [location] = useLocation();
    const [open, setOpen] = useState(false);

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-[#1da1f2]/10 border-r border-border/40">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <img src="/assets/logo.png" alt="DGM Logo" className="h-10 w-auto" />
                    <div className="flex flex-col">
                        <span className="font-bold text-lg leading-none">DGM Admin</span>
                        <span className="text-xs text-muted-foreground">E-Visa Portal</span>
                    </div>
                </div>

                <nav className="space-y-2">
                    {sidebarItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start gap-3",
                                    location === item.href ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Button>
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-border/40">
                <Link href="/admin/login">
                    <Button variant="outline" className="w-full gap-2 text-destructive hover:text-destructive">
                        <LogOut className="h-4 w-4" />
                        Déconnexion
                    </Button>
                </Link>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 fixed h-full z-30">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-40">
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                    <SidebarContent />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
