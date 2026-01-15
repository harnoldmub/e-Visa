import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import {
  Search,
  FileText,
  Calendar,
  MapPin,
  User,
  Plane,
  Download,
  Loader2,
  AlertCircle
} from "lucide-react";
import type { Application, ApplicationStatus } from "@shared/schema";

export default function TrackPage() {
  const [searchRef, setSearchRef] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      setSearchRef(ref);
      setSubmittedRef(ref);
    }
  }, []);

  const { data: application, isLoading, error } = useQuery<Application>({
    queryKey: [`/api/applications/track/${submittedRef}`, submittedEmail],
    queryFn: async () => {
      if (!submittedRef || !submittedEmail) return null;
      const response = await fetch(`/api/applications/track/${submittedRef}?email=${encodeURIComponent(submittedEmail)}`);
      if (!response.ok) {
        throw new Error("Application not found");
      }
      return response.json();
    },
    enabled: !!submittedRef && !!submittedEmail,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchRef.trim() && searchEmail.trim()) {
      setSubmittedRef(searchRef.trim());
      setSubmittedEmail(searchEmail.trim());
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <Search className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Suivi de Demande</h1>
            <p className="text-muted-foreground">
              Entrez votre numéro de demande et votre adresse email
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Numéro de dossier</label>
                  <Input
                    type="text"
                    placeholder="Ex: eVisa-XXX-19-00201"
                    value={searchRef}
                    onChange={(e) => setSearchRef(e.target.value)}
                    className="h-12 text-lg font-mono"
                    data-testid="input-track-ref"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Adresse email</label>
                  <Input
                    type="email"
                    placeholder="Ex: votre.email@example.com"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="h-12 text-lg"
                    data-testid="input-track-email"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                  data-testid="button-search"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Recherche en cours...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Rechercher
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {isLoading && (
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Recherche en cours...</p>
              </CardContent>
            </Card>
          )}

          {error && submittedRef && (
            <Card className="border-destructive/50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Demande introuvable</h3>
                <p className="text-muted-foreground">
                  Aucune demande ne correspond à ce numéro de dossier et cette adresse email.
                  Veuillez vérifier vos informations.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {
          application && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Numéro de demande</p>
                    <CardTitle className="text-xl font-mono">
                      {application.applicationNumber}
                    </CardTitle>
                  </div>
                  <StatusBadge status={application.status as ApplicationStatus} />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Demandeur</p>
                          <p className="font-medium">
                            {application.firstName} {application.lastName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Type de visa</p>
                          <p className="font-medium">
                            {application.visaType.replace(/_/g, " ")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Nationalité</p>
                          <p className="font-medium">{application.nationality}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Entry point removed as it is not in schema */}

                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Date d'arrivée prévue</p>
                          <p className="font-medium">
                            {application.arrivalDate
                              ? new Date(application.arrivalDate).toLocaleDateString("fr-FR")
                              : "Non spécifiée"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Date de soumission</p>
                          <p className="font-medium">
                            {application.submittedAt
                              ? new Date(application.submittedAt).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                              : "Non soumis"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {application.status === "ISSUED" && (
                    <div className="border-t pt-6">
                      <a href={`/api/visas/${application.id}/pdf`} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full gap-2" data-testid="button-download-visa">
                          <Download className="h-4 w-4" />
                          Télécharger mon e-Visa
                        </Button>
                      </a>
                    </div>
                  )}

                  {application.status === "REJECTED" && application.rejectionReason && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                      <h4 className="font-medium text-destructive mb-2">Motif du refus</h4>
                      <p className="text-sm">{application.rejectionReason}</p>
                    </div>
                  )}

                  {application.status === "NEED_INFO" && application.adminNotes && (
                    <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Informations requises</h4>
                      <p className="text-sm">{application.adminNotes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Historique de la demande</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                    {/* Step 1: Submission */}
                    <div className="relative">
                      <div className={`absolute -left-4 w-4 h-4 rounded-full border-2 border-background ${application.submittedAt ? 'bg-green-500' : 'bg-muted'}`} />
                      <div>
                        <p className="font-medium">Demande soumise</p>
                        <p className="text-sm text-muted-foreground">
                          {application.submittedAt
                            ? new Date(application.submittedAt).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                            : "En attente"}
                        </p>
                      </div>
                    </div>

                    {/* Step 2: Review */}
                    <div className="relative">
                      <div className={`absolute -left-4 w-4 h-4 rounded-full border-2 border-background ${['UNDER_REVIEW', 'APPROVED', 'ISSUED', 'REJECTED', 'NEED_INFO'].includes(application.status)
                        ? 'bg-blue-500'
                        : 'bg-muted'
                        }`} />
                      <div>
                        <p className="font-medium">En cours d'examen</p>
                        <p className="text-sm text-muted-foreground">
                          {['UNDER_REVIEW', 'APPROVED', 'ISSUED', 'REJECTED', 'NEED_INFO'].includes(application.status)
                            ? "Votre dossier est en cours de traitement par la DGM."
                            : "En attente de traitement"}
                        </p>
                      </div>
                    </div>

                    {/* Step 3: Decision */}
                    <div className="relative">
                      <div className={`absolute -left-4 w-4 h-4 rounded-full border-2 border-background ${['APPROVED', 'ISSUED'].includes(application.status)
                        ? 'bg-green-500'
                        : application.status === 'REJECTED'
                          ? 'bg-red-500'
                          : 'bg-muted'
                        }`} />
                      <div>
                        <p className="font-medium">
                          {application.status === 'ISSUED' || application.status === 'APPROVED' ? 'Visa Approuvé / Émis' :
                            application.status === 'REJECTED' ? 'Demande Rejetée' : 'Décision Finale'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {application.status === 'ISSUED' ? 'Votre e-Visa a été généré avec succès.' :
                            application.status === 'REJECTED' ? 'Votre demande a été refusée.' :
                              "Résultat final de la demande."}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        }

        {
          !submittedRef && !isLoading && (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Recherchez votre demande</h3>
                <p className="text-muted-foreground">
                  Entrez votre numéro de référence pour afficher les détails de votre demande de visa.
                </p>
              </CardContent>
            </Card>
          )
        }
      </div>
    </div>
  );
}
