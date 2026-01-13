import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { FileText, Search, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isAdmin = location.startsWith("/admin");
  
  if (isAdmin) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold leading-tight">e-Visa RDC</span>
            <span className="text-xs text-muted-foreground leading-tight hidden sm:block">
              République Démocratique du Congo
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/">
            <Button 
              variant={location === "/" ? "secondary" : "ghost"} 
              className="text-sm"
              data-testid="link-home"
            >
              Accueil
            </Button>
          </Link>
          <Link href="/apply">
            <Button 
              variant={location === "/apply" ? "secondary" : "ghost"} 
              className="text-sm"
              data-testid="link-apply"
            >
              Demande de Visa
            </Button>
          </Link>
          <Link href="/track">
            <Button 
              variant={location === "/track" ? "secondary" : "ghost"} 
              className="text-sm"
              data-testid="link-track"
            >
              Suivi de Demande
            </Button>
          </Link>
          <Link href="/verify">
            <Button 
              variant={location.startsWith("/verify") ? "secondary" : "ghost"} 
              className="text-sm"
              data-testid="link-verify"
            >
              <Search className="h-4 w-4 mr-2" />
              Vérifier e-Visa
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/apply" className="hidden sm:block">
            <Button data-testid="button-apply-now">
              Commencer la demande
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background p-4">
          <nav className="flex flex-col gap-2">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Accueil
              </Button>
            </Link>
            <Link href="/apply" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Demande de Visa
              </Button>
            </Link>
            <Link href="/track" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Suivi de Demande
              </Button>
            </Link>
            <Link href="/verify" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Vérifier e-Visa
              </Button>
            </Link>
            <Link href="/apply" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full mt-2">
                Commencer la demande
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
