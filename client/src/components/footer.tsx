import { Link } from "wouter";
import { FileText, Mail, Phone, MapPin, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">e-Visa RDC</span>
                <span className="text-xs text-muted-foreground">
                  Direction Générale de Migration
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Plateforme officielle de demande de visa électronique pour la République Démocratique du Congo.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Liens Rapides</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/apply" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Demande de Visa
              </Link>
              <Link href="/track" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Suivi de Demande
              </Link>
              <Link href="/verify" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Vérifier un e-Visa
              </Link>
              <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Questions Fréquentes
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Types de Visa</h3>
            <nav className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Visa Tourisme</span>
              <span className="text-sm text-muted-foreground">Visa Affaires</span>
              <span className="text-sm text-muted-foreground">Visa Transit</span>
              <span className="text-sm text-muted-foreground">Visa Court Séjour</span>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Contact</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>65, Boulevard du 30 Juin, Kinshasa</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+243 81 234 5678</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span>contact@evisa.gouv.cd</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4 shrink-0" />
                <span>www.evisa.gouv.cd</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} République Démocratique du Congo - Ministère de l'Intérieur. Tous droits réservés.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="#privacy" className="hover:text-foreground transition-colors">
              Confidentialité
            </Link>
            <Link href="#terms" className="hover:text-foreground transition-colors">
              Conditions d'utilisation
            </Link>
            <Link href="#legal" className="hover:text-foreground transition-colors">
              Mentions légales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
