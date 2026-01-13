import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  ShieldCheck, 
  ShieldX,
  User,
  Calendar,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Globe
} from "lucide-react";
import type { Visa, Application } from "@shared/schema";

interface VerificationResult {
  visa: Visa;
  application: Application;
  isValid: boolean;
}

export default function VerifyPage() {
  const params = useParams<{ code?: string }>();
  const [searchCode, setSearchCode] = useState("");
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  useEffect(() => {
    if (params.code) {
      setSearchCode(params.code);
      setSubmittedCode(params.code);
    }
  }, [params.code]);

  const { data: result, isLoading, error } = useQuery<VerificationResult>({
    queryKey: [`/api/verify/${submittedCode}`],
    enabled: !!submittedCode,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCode.trim()) {
      setSubmittedCode(searchCode.trim().toUpperCase());
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Vérification e-Visa</h1>
            <p className="text-muted-foreground">
              Vérifiez l'authenticité d'un visa électronique de la RDC
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="flex gap-3">
                <Input
                  type="text"
                  placeholder="Entrez le code de vérification ou scannez le QR code"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                  className="h-12 text-lg font-mono"
                  data-testid="input-verify-code"
                />
                <Button 
                  type="submit" 
                  size="lg" 
                  className="px-8"
                  disabled={isLoading}
                  data-testid="button-verify"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {isLoading && (
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Vérification en cours...</p>
              </CardContent>
            </Card>
          )}

          {error && submittedCode && (
            <Card className="border-destructive/50">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <ShieldX className="h-10 w-10 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold mb-2">e-Visa Non Trouvé</h3>
                <p className="text-muted-foreground">
                  Aucun e-Visa ne correspond au code <strong>{submittedCode}</strong>.
                  <br />
                  Ce visa pourrait être invalide ou le code est incorrect.
                </p>
              </CardContent>
            </Card>
          )}

          {result && (
            <Card className={result.isValid ? "border-success/50" : "border-destructive/50"}>
              <CardContent className="p-0">
                <div className={`p-6 ${result.isValid ? "bg-success/10" : "bg-destructive/10"}`}>
                  <div className="flex items-center justify-center gap-3">
                    {result.isValid ? (
                      <>
                        <CheckCircle className="h-8 w-8 text-success" />
                        <span className="text-2xl font-bold text-success">e-Visa VALIDE</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-8 w-8 text-destructive" />
                        <span className="text-2xl font-bold text-destructive">e-Visa INVALIDE</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Numéro de Visa</span>
                    <span className="font-mono font-bold text-lg">{result.visa.visaNumber}</span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 border-t pt-6">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Titulaire</p>
                        <p className="font-medium">
                          {result.application.firstName} {result.application.lastName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Nationalité</p>
                        <p className="font-medium">{result.application.nationality}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Passeport</p>
                        <p className="font-medium">
                          {result.application.passportNumber?.slice(0, 3)}****{result.application.passportNumber?.slice(-2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Validité</p>
                        <p className="font-medium">
                          {new Date(result.visa.validFrom).toLocaleDateString("fr-FR")} - {new Date(result.visa.validTo).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-6">
                    <span className="text-sm text-muted-foreground">Date d'émission</span>
                    <span className="font-medium">
                      {result.visa.issuedAt 
                        ? new Date(result.visa.issuedAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Durée de séjour</span>
                    <Badge variant="secondary">{result.visa.stayDuration} jours</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!submittedCode && !isLoading && (
            <Card>
              <CardContent className="p-8 text-center">
                <ShieldCheck className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Vérifiez un e-Visa</h3>
                <p className="text-muted-foreground">
                  Entrez le code de vérification imprimé sur le e-Visa ou scannez le QR code 
                  pour confirmer son authenticité.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 p-6 bg-card rounded-lg border">
            <h3 className="font-semibold mb-3">Comment vérifier un e-Visa?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                Localisez le code de vérification sur le document e-Visa (en bas à droite près du QR code)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                Entrez le code dans le champ ci-dessus ou scannez le QR code avec votre téléphone
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                Vérifiez que les informations affichées correspondent au titulaire du visa
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
