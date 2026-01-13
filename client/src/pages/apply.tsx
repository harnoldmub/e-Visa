import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { StepIndicator } from "@/components/application-form/step-indicator";
import { VisaTypeStep } from "@/components/application-form/visa-type-step";
import { PersonalInfoStep } from "@/components/application-form/personal-info-step";
import { TravelInfoStep } from "@/components/application-form/travel-info-step";
import { DocumentsStep } from "@/components/application-form/documents-step";
import { PaymentStep } from "@/components/application-form/payment-step";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { VisaType } from "@shared/schema";
import { CheckCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const steps = [
  { title: "Type", description: "Choisir le visa" },
  { title: "Identité", description: "Informations personnelles" },
  { title: "Voyage", description: "Détails du séjour" },
  { title: "Documents", description: "Pièces justificatives" },
  { title: "Paiement", description: "Finaliser" },
];

interface ApplicationData {
  visaType: VisaType | null;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  nationality?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  gender?: string;
  occupation?: string;
  passportNumber?: string;
  passportIssueDate?: string;
  passportExpiryDate?: string;
  passportIssuingCountry?: string;
  arrivalDate?: string;
  departureDate?: string;
  entryPoint?: string;
  addressInDRC?: string;
  purposeOfVisit?: string;
  sponsorName?: string;
  sponsorAddress?: string;
  sponsorPhone?: string;
  passportScan?: string;
  photoId?: string;
  invitationLetter?: string;
}

export default function ApplyPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [applicationNumber, setApplicationNumber] = useState<string | null>(null);
  const [formData, setFormData] = useState<ApplicationData>({
    visaType: null,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type") as VisaType;
    if (type && ["TOURISM", "BUSINESS", "TRANSIT", "SHORT_STAY"].includes(type)) {
      setFormData((prev) => ({ ...prev, visaType: type }));
    }
  }, []);

  const submitMutation = useMutation({
    mutationFn: async (data: ApplicationData & { phoneNumber: string }) => {
      const response = await apiRequest("POST", "/api/applications", data);
      return response.json();
    },
    onSuccess: (data) => {
      setApplicationNumber(data.applicationNumber);
      toast({
        title: "Demande soumise avec succès!",
        description: `Votre numéro de demande est: ${data.applicationNumber}`,
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission de votre demande.",
        variant: "destructive",
      });
    },
  });

  const handleVisaTypeSelect = (type: VisaType) => {
    setFormData((prev) => ({ ...prev, visaType: type }));
  };

  const handlePersonalInfoSave = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleTravelInfoSave = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleDocumentsSave = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handlePaymentSubmit = (phoneNumber: string) => {
    submitMutation.mutate({ ...formData, phoneNumber } as any);
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step <= 4) {
      setCurrentStep(step);
    }
  };

  if (applicationNumber) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Demande Soumise!</h2>
              <p className="text-muted-foreground">
                Votre demande de visa a été soumise avec succès.
              </p>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Numéro de demande</p>
              <p className="text-2xl font-mono font-bold text-primary">{applicationNumber}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Conservez ce numéro pour suivre l'état de votre demande.
              Un email de confirmation a été envoyé à votre adresse.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={`/track?ref=${applicationNumber}`} className="flex-1">
                <Button className="w-full gap-2" data-testid="button-track-application">
                  <FileText className="h-4 w-4" />
                  Suivre ma demande
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full" data-testid="button-go-home">
                  Retour à l'accueil
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Demande de Visa</h1>
            <p className="text-muted-foreground">
              République Démocratique du Congo
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6 pb-12 px-8">
              <StepIndicator steps={steps} currentStep={currentStep} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              {currentStep === 0 && (
                <VisaTypeStep
                  selectedType={formData.visaType}
                  onSelect={handleVisaTypeSelect}
                  onNext={() => goToStep(1)}
                />
              )}

              {currentStep === 1 && (
                <PersonalInfoStep
                  data={formData}
                  onSave={handlePersonalInfoSave}
                  onBack={() => goToStep(0)}
                  onNext={() => goToStep(2)}
                />
              )}

              {currentStep === 2 && (
                <TravelInfoStep
                  data={formData}
                  onSave={handleTravelInfoSave}
                  onBack={() => goToStep(1)}
                  onNext={() => goToStep(3)}
                />
              )}

              {currentStep === 3 && (
                <DocumentsStep
                  data={formData}
                  onSave={handleDocumentsSave}
                  onBack={() => goToStep(2)}
                  onNext={() => goToStep(4)}
                />
              )}

              {currentStep === 4 && formData.visaType && (
                <PaymentStep
                  visaType={formData.visaType}
                  onBack={() => goToStep(3)}
                  onSubmit={handlePaymentSubmit}
                  isSubmitting={submitMutation.isPending}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
