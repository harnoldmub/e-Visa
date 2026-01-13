import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { visaTypeLabels, countries, civilStatuses, type VisaType } from "@shared/schema";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FileText, User, Users, CreditCard, Check, ChevronLeft, ChevronRight, Upload, AlertCircle } from "lucide-react";

const steps = [
  { id: 1, name: "Requérant", icon: User },
  { id: 2, name: "Preneur en charge", icon: Users },
  { id: 3, name: "Résumé", icon: FileText },
  { id: 4, name: "Paiement", icon: CreditCard },
];

const phoneCodes = [
  { code: "+243", country: "RDC" },
  { code: "+33", country: "France" },
  { code: "+32", country: "Belgique" },
  { code: "+1", country: "USA/Canada" },
  { code: "+44", country: "UK" },
  { code: "+49", country: "Allemagne" },
  { code: "+41", country: "Suisse" },
  { code: "+39", country: "Italie" },
  { code: "+34", country: "Espagne" },
  { code: "+351", country: "Portugal" },
];

export default function ApplyPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  
  const [formData, setFormData] = useState({
    visaType: "VOLANT_ORDINAIRE" as VisaType,
    codeInstitution: "",
    arrivalDate: "",
    passportNumber: "",
    passportExpiryDate: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    gender: "male",
    photoId: "",
    civilStatus: "",
    occupation: "",
    address: "",
    nationality: "",
    countryOfOrigin: "",
    email: "",
    phoneCountryCode: "+33",
    phone: "",
    purposeOfVisit: "",
    passportScan: "",
    sponsorFirstName: "",
    sponsorLastName: "",
    sponsorPlaceOfBirth: "",
    sponsorDateOfBirth: "",
    sponsorGender: "male",
    sponsorIdNumber: "",
    sponsorIdExpiry: "",
    sponsorIdIssuedBy: "",
    sponsorCivilStatus: "",
    sponsorAddress: "",
    sponsorNationality: "",
    sponsorEmail: "",
    sponsorPhoneCountryCode: "+243",
    sponsorPhone: "",
    sponsorRelation: "",
    sponsorRequestLetter: "",
    sponsorPassportScan: "",
    sponsorVisaScan: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const currentVisaInfo = visaTypeLabels[formData.visaType];
  const totalPrice = currentVisaInfo.price;

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/applications", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Demande soumise avec succès!",
        description: `Votre numéro de référence est: ${data.applicationNumber}`,
      });
      setLocation(`/track?ref=${data.applicationNumber}`);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la soumission",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!agreed) {
      toast({
        title: "Certification requise",
        description: "Vous devez certifier que les informations sont exactes",
        variant: "destructive",
      });
      return;
    }
    submitMutation.mutate(formData);
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return formData.firstName && formData.lastName && formData.email && 
             formData.passportNumber && formData.nationality && formData.arrivalDate;
    }
    if (currentStep === 2) {
      return formData.sponsorFirstName && formData.sponsorLastName && 
             formData.sponsorAddress && formData.sponsorPhone;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                      className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : isCompleted 
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 cursor-pointer" 
                            : "bg-muted text-muted-foreground"
                      }`}
                      disabled={step.id > currentStep}
                      data-testid={`step-${step.id}`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                      <span className="text-xs font-medium">{step.name}</span>
                    </button>
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-0.5 mx-1 ${
                        currentStep > step.id ? "bg-green-500" : "bg-muted"
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visa Price Display */}
          <div className="flex items-center justify-center gap-4 mb-6 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Visa *</span>
              <Select
                value={formData.visaType}
                onValueChange={(value) => updateField("visaType", value)}
              >
                <SelectTrigger className="w-[200px]" data-testid="select-visa-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VOLANT_ORDINAIRE">Visa volant ordinaire</SelectItem>
                  <SelectItem value="VOLANT_SPECIFIQUE">Visa volant spécifique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Prix du visa</span>
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-2xl font-bold text-primary">{totalPrice},00 $US</span>
            </div>
          </div>

          {/* Step 1: Requérant */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Information sur le requérant</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="codeInstitution">Code institutions (champ optionnel)</Label>
                  <Input
                    id="codeInstitution"
                    placeholder="Code institutions (champ optionnel)"
                    value={formData.codeInstitution}
                    onChange={(e) => updateField("codeInstitution", e.target.value)}
                    data-testid="input-code-institution"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arrivalDate">Date d'entrée *</Label>
                  <Input
                    id="arrivalDate"
                    type="date"
                    value={formData.arrivalDate}
                    onChange={(e) => updateField("arrivalDate", e.target.value)}
                    data-testid="input-arrival-date"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="passportNumber">N° passeport *</Label>
                    <Input
                      id="passportNumber"
                      placeholder="N° passeport"
                      value={formData.passportNumber}
                      onChange={(e) => updateField("passportNumber", e.target.value)}
                      data-testid="input-passport-number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passportExpiryDate">Validité *</Label>
                    <Input
                      id="passportExpiryDate"
                      type="date"
                      value={formData.passportExpiryDate}
                      onChange={(e) => updateField("passportExpiryDate", e.target.value)}
                      data-testid="input-passport-expiry"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      placeholder="Prénom"
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      data-testid="input-first-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Noms *</Label>
                    <Input
                      id="lastName"
                      placeholder="Noms"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      data-testid="input-last-name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date de naissance *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateField("dateOfBirth", e.target.value)}
                      data-testid="input-dob"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="placeOfBirth">Lieu de naissance *</Label>
                    <Input
                      id="placeOfBirth"
                      placeholder="Lieu de naissance"
                      value={formData.placeOfBirth}
                      onChange={(e) => updateField("placeOfBirth", e.target.value)}
                      data-testid="input-place-of-birth"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Genre *</Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(value) => updateField("gender", value)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="gender-female" data-testid="radio-female" />
                      <Label htmlFor="gender-female">Féminin</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="gender-male" data-testid="radio-male" />
                      <Label htmlFor="gender-male">Masculin</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Joindre une photo *</Label>
                  <Button type="button" variant="secondary" className="gap-2" data-testid="button-upload-photo">
                    <Upload className="w-4 h-4" />
                    Charger la photo (jpg ou png)
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="civilStatus">État civil *</Label>
                    <Select
                      value={formData.civilStatus}
                      onValueChange={(value) => updateField("civilStatus", value)}
                    >
                      <SelectTrigger data-testid="select-civil-status">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {civilStatuses.map((status) => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Profession *</Label>
                    <Input
                      id="occupation"
                      placeholder="Profession"
                      value={formData.occupation}
                      onChange={(e) => updateField("occupation", e.target.value)}
                      data-testid="input-occupation"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse *</Label>
                  <Input
                    id="address"
                    placeholder="Adresse"
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    data-testid="input-address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationalité *</Label>
                    <Select
                      value={formData.nationality}
                      onValueChange={(value) => updateField("nationality", value)}
                    >
                      <SelectTrigger data-testid="select-nationality">
                        <SelectValue placeholder="Nationalité" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="countryOfOrigin">Pays de provenance *</Label>
                    <Select
                      value={formData.countryOfOrigin}
                      onValueChange={(value) => updateField("countryOfOrigin", value)}
                    >
                      <SelectTrigger data-testid="select-country-origin">
                        <SelectValue placeholder="Pays de provenance" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="E-mail"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      data-testid="input-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">N° Téléphone *</Label>
                    <div className="flex gap-2">
                      <Select
                        value={formData.phoneCountryCode}
                        onValueChange={(value) => updateField("phoneCountryCode", value)}
                      >
                        <SelectTrigger className="w-[100px]" data-testid="select-phone-code">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {phoneCodes.map((item) => (
                            <SelectItem key={item.code} value={item.code}>
                              {item.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        id="phone"
                        placeholder="N° Téléphone"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className="flex-1"
                        data-testid="input-phone"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purposeOfVisit">Raison du voyage *</Label>
                  <Textarea
                    id="purposeOfVisit"
                    placeholder="2000 mots max"
                    value={formData.purposeOfVisit}
                    onChange={(e) => updateField("purposeOfVisit", e.target.value)}
                    rows={4}
                    data-testid="textarea-purpose"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Copy du passeport *</Label>
                  <Button type="button" variant="secondary" className="gap-2" data-testid="button-upload-passport">
                    <Upload className="w-4 h-4" />
                    Copy du passeport
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Preneur en charge */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Information sur le preneur en charge</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sponsorFirstName">Prénom *</Label>
                    <Input
                      id="sponsorFirstName"
                      placeholder="Prénom"
                      value={formData.sponsorFirstName}
                      onChange={(e) => updateField("sponsorFirstName", e.target.value)}
                      data-testid="input-sponsor-first-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sponsorLastName">Noms *</Label>
                    <Input
                      id="sponsorLastName"
                      placeholder="Noms"
                      value={formData.sponsorLastName}
                      onChange={(e) => updateField("sponsorLastName", e.target.value)}
                      data-testid="input-sponsor-last-name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sponsorPlaceOfBirth">Lieu de naissance *</Label>
                    <Input
                      id="sponsorPlaceOfBirth"
                      placeholder="Lieu de naissance"
                      value={formData.sponsorPlaceOfBirth}
                      onChange={(e) => updateField("sponsorPlaceOfBirth", e.target.value)}
                      data-testid="input-sponsor-place-of-birth"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sponsorDateOfBirth">Date de naissance *</Label>
                    <Input
                      id="sponsorDateOfBirth"
                      type="date"
                      value={formData.sponsorDateOfBirth}
                      onChange={(e) => updateField("sponsorDateOfBirth", e.target.value)}
                      data-testid="input-sponsor-dob"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Genre *</Label>
                  <RadioGroup
                    value={formData.sponsorGender}
                    onValueChange={(value) => updateField("sponsorGender", value)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="sponsor-gender-female" data-testid="radio-sponsor-female" />
                      <Label htmlFor="sponsor-gender-female">Féminin</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="sponsor-gender-male" data-testid="radio-sponsor-male" />
                      <Label htmlFor="sponsor-gender-male">Masculin</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sponsorIdNumber">N° Passeport/Carte d'identité *</Label>
                    <Input
                      id="sponsorIdNumber"
                      placeholder="N° Passeport/Carte d'identité"
                      value={formData.sponsorIdNumber}
                      onChange={(e) => updateField("sponsorIdNumber", e.target.value)}
                      data-testid="input-sponsor-id"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sponsorIdExpiry">Validité *</Label>
                    <Input
                      id="sponsorIdExpiry"
                      type="date"
                      value={formData.sponsorIdExpiry}
                      onChange={(e) => updateField("sponsorIdExpiry", e.target.value)}
                      data-testid="input-sponsor-id-expiry"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sponsorIdIssuedBy">Délivré par *</Label>
                  <Input
                    id="sponsorIdIssuedBy"
                    placeholder="Passeport délivré par"
                    value={formData.sponsorIdIssuedBy}
                    onChange={(e) => updateField("sponsorIdIssuedBy", e.target.value)}
                    data-testid="input-sponsor-id-issued-by"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sponsorCivilStatus">État civil *</Label>
                  <Select
                    value={formData.sponsorCivilStatus}
                    onValueChange={(value) => updateField("sponsorCivilStatus", value)}
                  >
                    <SelectTrigger data-testid="select-sponsor-civil-status">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {civilStatuses.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sponsorAddress">Adresse *</Label>
                    <Input
                      id="sponsorAddress"
                      placeholder="Adresse"
                      value={formData.sponsorAddress}
                      onChange={(e) => updateField("sponsorAddress", e.target.value)}
                      data-testid="input-sponsor-address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sponsorNationality">Nationalité *</Label>
                    <Select
                      value={formData.sponsorNationality}
                      onValueChange={(value) => updateField("sponsorNationality", value)}
                    >
                      <SelectTrigger data-testid="select-sponsor-nationality">
                        <SelectValue placeholder="Nationalité" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sponsorEmail">E-mail *</Label>
                    <Input
                      id="sponsorEmail"
                      type="email"
                      placeholder="E-mail"
                      value={formData.sponsorEmail}
                      onChange={(e) => updateField("sponsorEmail", e.target.value)}
                      data-testid="input-sponsor-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sponsorPhone">N° Téléphone *</Label>
                    <div className="flex gap-2">
                      <Select
                        value={formData.sponsorPhoneCountryCode}
                        onValueChange={(value) => updateField("sponsorPhoneCountryCode", value)}
                      >
                        <SelectTrigger className="w-[100px]" data-testid="select-sponsor-phone-code">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {phoneCodes.map((item) => (
                            <SelectItem key={item.code} value={item.code}>
                              {item.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        id="sponsorPhone"
                        placeholder="N° Téléphone"
                        value={formData.sponsorPhone}
                        onChange={(e) => updateField("sponsorPhone", e.target.value)}
                        className="flex-1"
                        data-testid="input-sponsor-phone"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sponsorRelation">Relation avec le requérant *</Label>
                  <Input
                    id="sponsorRelation"
                    placeholder="Relation avec le requérant"
                    value={formData.sponsorRelation}
                    onChange={(e) => updateField("sponsorRelation", e.target.value)}
                    data-testid="input-sponsor-relation"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Lettre de demande *</Label>
                    <Button type="button" variant="secondary" className="gap-2" data-testid="button-upload-request-letter">
                      <Upload className="w-4 h-4" />
                      Lettre de demande
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Copie du passeport *</Label>
                    <Button type="button" variant="secondary" className="gap-2" data-testid="button-upload-sponsor-passport">
                      <Upload className="w-4 h-4" />
                      Copie du passeport
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Copie du VISA *</Label>
                    <Button type="button" variant="secondary" className="gap-2" data-testid="button-upload-sponsor-visa">
                      <Upload className="w-4 h-4" />
                      Copie du VISA
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Résumé */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2">
                  <CardTitle>Information sur le requérant</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)} data-testid="button-edit-applicant">
                    Modifier
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Visa</span>
                      <span className="font-medium">{currentVisaInfo.fr} | {totalPrice},00 $US</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Noms</span>
                      <span className="font-medium">{formData.lastName}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Prénom</span>
                      <span className="font-medium">{formData.firstName}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Genre</span>
                      <span className="font-medium">{formData.gender === "male" ? "M" : "F"}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Lieu de naissance</span>
                      <span className="font-medium">{formData.placeOfBirth}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Date de naissance</span>
                      <span className="font-medium">{formData.dateOfBirth}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Adresse</span>
                      <span className="font-medium">{formData.address}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">N° passeport</span>
                      <span className="font-medium">{formData.passportNumber}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Nationalité</span>
                      <span className="font-medium">{formData.nationality}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Pays de provenance</span>
                      <span className="font-medium">{formData.countryOfOrigin}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">E-mail</span>
                      <span className="font-medium">{formData.email}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">N° Téléphone</span>
                      <span className="font-medium">{formData.phoneCountryCode} {formData.phone}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">État civil</span>
                      <span className="font-medium">{formData.civilStatus}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Profession</span>
                      <span className="font-medium">{formData.occupation}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Date d'entrée</span>
                      <span className="font-medium">{formData.arrivalDate}</span>
                    </div>
                    <div className="md:col-span-2 flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Raison du voyage</span>
                      <span className="font-medium text-right max-w-md">{formData.purposeOfVisit}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2">
                  <CardTitle>Information sur le preneur en charge</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)} data-testid="button-edit-sponsor">
                    Modifier
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Noms</span>
                      <span className="font-medium">{formData.sponsorLastName}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Prénom</span>
                      <span className="font-medium">{formData.sponsorFirstName}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Genre</span>
                      <span className="font-medium">{formData.sponsorGender === "male" ? "M" : "F"}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Lieu de naissance</span>
                      <span className="font-medium">{formData.sponsorPlaceOfBirth}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Date de naissance</span>
                      <span className="font-medium">{formData.sponsorDateOfBirth}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Adresse</span>
                      <span className="font-medium">{formData.sponsorAddress}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">État civil</span>
                      <span className="font-medium">{formData.sponsorCivilStatus}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">N° passeport</span>
                      <span className="font-medium">{formData.sponsorIdNumber}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Validité</span>
                      <span className="font-medium">{formData.sponsorIdExpiry}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Délivré par</span>
                      <span className="font-medium">{formData.sponsorIdIssuedBy}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Nationalité</span>
                      <span className="font-medium">{formData.sponsorNationality}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">E-mail</span>
                      <span className="font-medium">{formData.sponsorEmail}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">N° Téléphone</span>
                      <span className="font-medium">{formData.sponsorPhoneCountryCode} {formData.sponsorPhone}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Relation</span>
                      <span className="font-medium">{formData.sponsorRelation}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                <Checkbox
                  id="certification"
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked as boolean)}
                  data-testid="checkbox-certification"
                />
                <Label htmlFor="certification" className="text-sm">
                  Je certifie sur mon honneur que les informations fournies sont sincères et exactes !
                </Label>
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Options de paiement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary mb-2">{totalPrice},00 $US</p>
                  <p className="text-muted-foreground">Montant total à payer</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg hover-elevate cursor-pointer" data-testid="payment-mpesa">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                        M
                      </div>
                      <div>
                        <p className="font-medium">M-Pesa</p>
                        <p className="text-sm text-muted-foreground">Paiement mobile</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg hover-elevate cursor-pointer" data-testid="payment-card">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-medium">Carte bancaire</p>
                        <p className="text-sm text-muted-foreground">Visa, Mastercard</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="gap-2"
              data-testid="button-prev"
            >
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </Button>
            
            {currentStep < 4 ? (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="gap-2"
                data-testid="button-next"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={submitMutation.isPending || !agreed}
                className="gap-2 bg-green-600 hover:bg-green-700"
                data-testid="button-submit"
              >
                {submitMutation.isPending ? "Traitement..." : "Soumettre la demande"}
              </Button>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
