import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Clock, 
  Shield, 
  Search, 
  CreditCard, 
  Globe,
  ChevronRight,
  CheckCircle,
  ArrowRight
} from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Traitement Rapide",
    description: "Obtenez votre e-Visa en quelques jours ouvrables après approbation.",
  },
  {
    icon: Shield,
    title: "100% Sécurisé",
    description: "Vos données sont protégées par un chiffrement de niveau bancaire.",
  },
  {
    icon: Globe,
    title: "Accessible Partout",
    description: "Faites votre demande depuis n'importe où dans le monde, 24h/24.",
  },
];

const steps = [
  {
    number: "1",
    title: "Choisissez votre visa",
    description: "Sélectionnez le type de visa adapté à votre voyage.",
  },
  {
    number: "2",
    title: "Remplissez le formulaire",
    description: "Complétez vos informations personnelles et de voyage.",
  },
  {
    number: "3",
    title: "Payez en ligne",
    description: "Réglez les frais de visa via M-Pesa de manière sécurisée.",
  },
  {
    number: "4",
    title: "Recevez votre e-Visa",
    description: "Téléchargez votre visa électronique après approbation.",
  },
];

const visaTypes = [
  {
    type: "VOLANT_ORDINAIRE",
    title: "Visa Volant Ordinaire",
    duration: "7 jours",
    validity: "3 mois",
    price: "250 $US",
    description: "Visa standard pour séjour de courte durée. Validité de 3 mois à compter de la délivrance.",
  },
  {
    type: "VOLANT_SPECIFIQUE",
    title: "Visa Volant Spécifique",
    duration: "30 jours",
    validity: "3 mois",
    price: "800 $US",
    description: "Visa spécial pour missions particulières. Séjour prolongé jusqu'à 30 jours.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
        
        <div className="container relative mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <FileText className="h-4 w-4" />
              <span>Plateforme Officielle du Gouvernement</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Votre e-Visa pour la
              <br />
              <span className="text-white/90">République Démocratique du Congo</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Demandez votre visa en ligne en quelques minutes. 
              Un processus simple, sécurisé et entièrement numérique.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/apply">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 px-8 gap-2"
                  data-testid="button-hero-apply"
                >
                  Commencer ma demande
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/track">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 gap-2"
                  data-testid="button-hero-track"
                >
                  <Search className="h-5 w-5" />
                  Suivre ma demande
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pourquoi choisir notre plateforme?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Une solution moderne et fiable pour obtenir votre visa congolais
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover-elevate">
                <CardContent className="pt-8 pb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-6">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comment ça marche?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Obtenez votre e-Visa en 4 étapes simples
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[60%] w-[80%]">
                    <div className="h-0.5 bg-border relative">
                      <ChevronRight className="absolute -right-2 -top-2 h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Types de Visa Disponibles</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choisissez le visa adapté à vos besoins
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {visaTypes.map((visa, index) => (
              <Card key={index} className="hover-elevate overflow-visible border-2">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-bold text-primary">{visa.price}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{visa.title}</h3>
                  <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                    <span>Durée: {visa.duration}</span>
                    <span>Validité: {visa.validity}</span>
                  </div>
                  <p className="text-muted-foreground mb-6">{visa.description}</p>
                  <Link href={`/apply?type=${visa.type}`}>
                    <Button className="w-full gap-2" data-testid={`button-select-${visa.type.toLowerCase()}`}>
                      Commencer la demande
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Documents Requis</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Préparez ces documents avant de commencer votre demande
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="grid gap-4">
              {[
                "Passeport valide (6 mois minimum après la date de départ)",
                "Photo d'identité récente (format passeport)",
                "Scan couleur de votre passeport",
                "Lettre d'invitation ou réservation d'hôtel",
                "Justificatif de moyens financiers",
                "Billet d'avion aller-retour",
              ].map((doc, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-background border">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5 shrink-0" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-white">
              Prêt à commencer votre demande?
            </h2>
            <p className="text-lg text-white/80">
              Le processus ne prend que quelques minutes. Commencez maintenant!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 px-8 gap-2"
                  data-testid="button-cta-apply"
                >
                  <FileText className="h-5 w-5" />
                  Demander un e-Visa
                </Button>
              </Link>
              <Link href="/verify">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10 px-8 gap-2"
                  data-testid="button-cta-verify"
                >
                  <Search className="h-5 w-5" />
                  Vérifier un e-Visa
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Paiement Sécurisé</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Payez facilement avec M-Pesa, la solution de paiement mobile la plus utilisée
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 text-success mb-6">
                  <CreditCard className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">M-Pesa</h3>
                <p className="text-muted-foreground mb-4">
                  Paiement sécurisé via votre numéro de téléphone mobile
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-success">
                  <Shield className="h-4 w-4" />
                  <span>Transaction 100% sécurisée</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
