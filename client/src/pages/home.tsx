import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  Shield,
  Search,
  CreditCard,
  Globe,
  ChevronRight,
  CheckCircle,
  ArrowRight,
  Plane,
  BookUser,
  X
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { VisaProduct } from "@shared/schema";

// Animation Variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

function VerificationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<"exempted" | "required" | null>(null);
  const [nationality, setNationality] = useState("");

  const handleVerify = () => {
    const natSelect = document.getElementById("nationality-select") as HTMLSelectElement;
    const national = natSelect?.value;

    if (!national) {
      alert("Veuillez sélectionner une nationalité");
      return;
    }

    setNationality(national);

    const isExempted = [
      "Angola", "Burundi", "Cameroun", "Centrafrique", "Congo-Brazzaville",
      "Gabon", "Guinée Équatoriale", "Kenya", "Ouganda", "Rwanda", "Sao Tomé-et-Principe",
      "Tchad", "Tanzanie", "Zambie", "Zimbabwe"
    ].includes(national);

    setResult(isExempted ? "exempted" : "required");
    setIsOpen(true);
  };

  const getApplyUrl = () => {
    const nationality = (document.getElementById("nationality-select") as HTMLSelectElement)?.value || "";
    const residence = (document.getElementById("residence-select") as HTMLSelectElement)?.value || "";
    const docType = (document.getElementById("doc-type-select") as HTMLSelectElement)?.value || "";
    const purpose = (document.getElementById("purpose-select") as HTMLSelectElement)?.value || "";

    const params = new URLSearchParams({
      nationality,
      residence,
      docType,
      purpose
    });
    return `/apply?${params.toString()}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        onClick={handleVerify}
        className="w-full h-[50px] bg-[#003366] hover:bg-[#002244] text-white text-lg font-medium rounded-lg transition-colors shadow-sm"
      >
        <Search className="w-5 h-5 mr-2" />
        Vérifier
      </Button>
      <DialogContent className="sm:max-w-md">
        {result === "exempted" ? (
          <div className="flex flex-col items-center text-center p-6 space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Plane className="w-8 h-8 text-green-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">Pas de visa requis</DialogTitle>
              <DialogDescription className="text-gray-600 text-base mt-2">
                Bonne nouvelle ! Les ressortissants de <span className="font-bold text-gray-900">{nationality}</span> sont exemptés de visa pour entrer en République Démocratique du Congo pour une durée de 90 jours.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-500 w-full text-left">
              Cette exemption est liée aux accords régionaux (CEEAC / EAC / SADC).
            </div>
            <DialogFooter className="w-full">
              <Button onClick={() => setIsOpen(false)} className="w-full bg-[#3B82F6] hover:bg-blue-700 text-white font-semibold py-6 rounded-lg text-lg">
                Compris
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center p-6 space-y-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">Visa requis</DialogTitle>
              <DialogDescription className="text-gray-600 text-base mt-2">
                Les ressortissants de <span className="font-bold text-gray-900">{nationality}</span> ont besoin d'un visa pour entrer en République Démocratique du Congo.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="w-full flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full sm:w-1/3 py-6 text-lg border-gray-300">
                Fermer
              </Button>
              <Link href={getApplyUrl()} className="w-full sm:w-2/3">
                <Button className="w-full bg-[#3B82F6] hover:bg-blue-700 text-white font-semibold py-6 rounded-lg text-lg gap-2">
                  Demander un e-Visa
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function HomePage() {
  const { data: products, isLoading: productsLoading } = useQuery<VisaProduct[]>({
    queryKey: ["/api/visa-products"],
  });

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 font-sans">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/assets/hero.png')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#003366]/90 to-[#003366]/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="container relative z-10 px-4 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto space-y-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white mb-4"
            >
              <Shield className="w-5 h-5 text-yellow-500" />
              <span className="font-medium tracking-wide">Plateforme Officielle e-Visa RDC</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
              Votre porte d'entrée <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Numérique
              </span>
            </h1>

            <p className="text-xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
              Obtenez votre visa pour la République Démocratique du Congo en quelques clics.
              Simple, rapide et sécurisé.
            </p>

            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 pt-8"
            >
              <Link href="/apply">
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-10 py-8 text-lg font-bold rounded-xl shadow-2xl transition-all hover:scale-105 gap-3 border-none">
                  <CreditCard className="h-6 w-6" />
                  Demander un Visa
                  <ChevronRight className="h-5 w-5 opacity-50" />
                </Button>
              </Link>

              <Link href="/track">
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-md px-10 py-8 text-lg font-semibold rounded-xl transition-all hover:scale-105 gap-3"
                >
                  <Search className="h-6 w-6" />
                  Suivre mon dossier
                </Button>
              </Link>
            </motion.div> */}
          </motion.div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-neutral-50 to-transparent" />
      </section>

      {/* Exemption Checker Section */}
      <section className="py-12 bg-white relative z-20 -mt-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="max-w-6xl mx-auto space-y-8"
          >
            {/* Checker Form Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-neutral-100">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ai-je besoin d'un visa pour la RDC ?</h3>
                <p className="text-gray-500">Vérifiez si vous avez besoin d'un visa pour entrer en République Démocratique du Congo</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Nationalité / Citoyenneté <span className="text-red-500">*</span></label>
                  <select
                    id="nationality-select"
                    className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#003366] outline-none transition-all"
                    defaultValue=""
                  >
                    <option value="" disabled>Sélectionner un pays</option>
                    {[
                      "Afghanistan", "Albanie", "Algérie", "Allemagne", "Angola", "Argentine",
                      "Australie", "Autriche", "Belgique", "Bénin", "Brésil", "Burkina Faso",
                      "Burundi", "Cameroun", "Canada", "Centrafrique", "Chine", "Congo-Brazzaville",
                      "Côte d'Ivoire", "Égypte", "Espagne", "États-Unis", "Éthiopie", "France",
                      "Gabon", "Ghana", "Guinée", "Inde", "Italie", "Japon", "Kenya", "Libéria",
                      "Madagascar", "Mali", "Maroc", "Mozambique", "Niger", "Nigeria", "Ouganda",
                      "Pakistan", "Pays-Bas", "Portugal", "République Sud-Africaine", "Royaume-Uni",
                      "Rwanda", "Sénégal", "Soudan", "Suisse", "Tanzanie", "Tchad", "Togo",
                      "Tunisie", "Turquie", "Zambie", "Zimbabwe"
                    ].sort().map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Pays de résidence <span className="text-red-500">*</span></label>
                  <select id="residence-select" className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#003366] outline-none transition-all" defaultValue="">
                    <option value="" disabled>Sélectionner un pays</option>
                    {["France", "Belgique", "Canada", "États-Unis", "Royaume-Uni", "Chine", "RDC", "Autre"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Type de document (Passeport) <span className="text-red-500">*</span></label>
                  <select id="doc-type-select" className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#003366] outline-none transition-all" defaultValue="">
                    <option value="" disabled>Sélectionner un type</option>
                    <option value="ORDINARIE">Passeport Ordinaire</option>
                    <option value="DIPLOMATIC">Passeport Diplomatique</option>
                    <option value="SERVICE">Passeport de Service</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Motif du voyage <span className="text-red-500">*</span></label>
                  <select id="purpose-select" className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#003366] outline-none transition-all" defaultValue="">
                    <option value="" disabled>Sélectionner un motif</option>
                    <option value="TOURISM">Tourisme</option>
                    <option value="BUSINESS">Affaires</option>
                    <option value="FAMILY">Visite Familiale</option>
                    <option value="CONFERENCE">Conférence</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Possédez-vous un autre visa valide ? <span className="text-red-500">*</span></label>
                  <select id="other-visa-select" className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#003366] outline-none transition-all" defaultValue="">
                    <option value="">Aucun</option>
                    <option value="USA">Visa États-Unis</option>
                    <option value="SCHENGEN">Visa Schengen</option>
                    <option value="UK">Visa Royaume-Uni</option>
                    <option value="CANADA">Visa Canada</option>
                  </select>
                </div>

                <div>
                  <VerificationDialog />
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {productsLoading ? (
                // Skeleton Loading
                [1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-lg border border-neutral-100 p-8 h-96 animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                    <div className="h-32 bg-gray-200 rounded mb-6"></div>
                    <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto"></div>
                  </div>
                ))
              ) : (
                products?.sort((a, b) => a.price - b.price).map((product) => (
                  <div key={product.id} className="bg-white rounded-xl shadow-lg border border-neutral-100 overflow-hidden group hover:shadow-xl transition-all">
                    <div className="p-8 text-center space-y-6">
                      <h3 className="text-2xl font-bold text-[#003366] uppercase tracking-wide">{product.labelFr}</h3>
                      <div className="text-sm text-gray-500 font-medium">ENTRÉE UNIQUE</div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>RÉSIDENCE {product.durationDays} JOURS</p>
                        <p>VALIDITÉ {product.validityMonths} MOIS</p>
                      </div>
                      <div className="my-6">
                        <div className="w-24 h-1 bg-red-600 mx-auto"></div>
                      </div>
                      <div className="text-4xl font-bold text-[#003366]">
                        {product.price} {product.currency}
                      </div>
                      <div className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
                        Traitement : {product.type === 'VOLANT_SPECIFIQUE' ? '1 Jour' : '3 Jours'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/apply">
                <div className="group bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer text-center h-full flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-[#003366] transition-colors">
                    <Plane className="w-8 h-8 text-[#003366] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Demander un e-Visa</h3>
                    <p className="text-gray-500 mt-2">Faire une demande en ligne</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link href="/track">
                <div className="group bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer text-center h-full flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors">
                    <Search className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Suivre ma demande</h3>
                    <p className="text-gray-500 mt-2">Consulter l'état de votre dossier</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link href="/track">
                {/* Viewing assumes tracking details, linking to track for now or a separate view page */}
                <div className="group bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer text-center h-full flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                    <FileText className="w-8 h-8 text-orange-500 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Voir mon e-Visa</h3>
                    <p className="text-gray-500 mt-2">Télécharger votre visa</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>

          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-neutral-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">Pourquoi choisir le e-Visa ?</h2>
            <div className="h-1.5 w-24 bg-yellow-500 mx-auto rounded-full mb-6" />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Une procédure modernisée pour faciliter votre venue en RDC
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Traitement Accéléré",
                description: "Recevez votre visa en moins de 72h grâce à notre traitement numérique optimisé.",
                color: "text-blue-600",
                bg: "bg-blue-50"
              },
              {
                icon: Shield,
                title: "Sécurité Maximale",
                description: "Technologie de chiffrement avancée et QR code infalsifiable pour votre sécurité.",
                color: "text-green-600",
                bg: "bg-green-50"
              },
              {
                icon: Globe,
                title: "Accessible 24/7",
                description: "Plateforme disponible partout dans le monde pour vos démarches à tout moment.",
                color: "text-purple-600",
                bg: "bg-purple-50"
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="text-center h-full hover:shadow-xl transition-shadow border-none shadow-md bg-white">
                  <CardContent className="pt-10 pb-8 px-6">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${feature.bg} ${feature.color} mb-6 shadow-sm transform transition-transform hover:scale-110`}>
                      <feature.icon className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 bg-[#003366] text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('/assets/pattern.svg')" }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Procédure Simplifiée</h2>
            <div className="h-1.5 w-24 bg-yellow-400 mx-auto rounded-full mb-6" />
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Obtenez votre visa en 4 étapes claires
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "01", title: "Demande", desc: "Remplissez le formulaire en ligne" },
              { number: "02", title: "Documents", desc: "Téléversez vos justificatifs" },
              { number: "03", title: "Paiement", desc: "Payez via M-Pesa sécurisé" },
              { number: "04", title: "Réception", desc: "Recevez votre e-Visa par email" }
            ].map((step, index) => (
              <div key={index} className="relative group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl font-bold mb-6 text-yellow-400 shadow-lg group-hover:bg-yellow-400 group-hover:text-[#003366] transition-colors duration-300">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-blue-200">{step.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-white/20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 shadow-2xl border border-gray-200">
            <h2 className="text-4xl font-bold text-[#003366] mb-6">
              Prêt à voyager ?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              N'attendez plus. Commencez votre procédure dès maintenant et préparez votre voyage en toute sérénité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply">
                <Button
                  size="lg"
                  className="bg-[#003366] text-white hover:bg-[#002244] px-10 py-6 text-lg rounded-xl shadow-lg"
                >
                  <BookUser className="h-5 w-5 mr-2" />
                  Demander mon Visa
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Paiement sécurisé et données protégées</span>
            </div>
          </div>
        </div>
      </section>

      {/* Partners/Payment Section */}
      <section className="py-12 bg-gray-50 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">Partenaires officiels</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Logos would go here, using M-Pesa text for now */}
            <div className="flex items-center gap-2 font-bold text-2xl text-red-600">
              <span className="bg-red-600 text-white px-2 py-1 rounded">M</span>
              <span>PESA</span>
            </div>
            {/* Simulation of other partners */}
            <div className="font-bold text-xl text-blue-800">DGM RDC</div>
            <div className="font-bold text-xl text-gray-700">MINISTÈRE DE L'INTÉRIEUR</div>
          </div>
        </div>
      </section>
    </div>
  );
}
