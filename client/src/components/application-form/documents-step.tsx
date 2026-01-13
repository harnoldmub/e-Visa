import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentsStepProps {
  data: {
    passportScan?: string;
    photoId?: string;
    invitationLetter?: string;
  };
  onSave: (data: { passportScan: string; photoId: string; invitationLetter?: string }) => void;
  onBack: () => void;
  onNext: () => void;
}

interface DocumentUploadProps {
  id: string;
  label: string;
  description: string;
  required?: boolean;
  value?: string;
  onChange: (value: string) => void;
}

function DocumentUpload({ id, label, description, required, value, onChange }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onChange(file.name);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file.name);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer overflow-visible",
          isDragging && "border-primary bg-primary/5",
          value && "border-success bg-success/5"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <CardContent className="p-6">
          <input
            type="file"
            id={id}
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleChange}
            data-testid={`input-file-${id}`}
          />
          
          {value ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-medium text-sm">{value}</p>
                  <p className="text-xs text-muted-foreground">Document téléchargé</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onChange("")}
                data-testid={`button-remove-${id}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label htmlFor={id} className="cursor-pointer block text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">
                    Glissez-déposez ou <span className="text-primary">parcourir</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {description}
                  </p>
                </div>
              </div>
            </label>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function DocumentsStep({ data, onSave, onBack, onNext }: DocumentsStepProps) {
  const [passportScan, setPassportScan] = useState(data.passportScan || "");
  const [photoId, setPhotoId] = useState(data.photoId || "");
  const [invitationLetter, setInvitationLetter] = useState(data.invitationLetter || "");

  const canProceed = passportScan && photoId;

  const handleNext = () => {
    if (canProceed) {
      onSave({ passportScan, photoId, invitationLetter });
      onNext();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Documents Requis</h2>
        <p className="text-muted-foreground">
          Téléchargez les documents nécessaires pour votre demande
        </p>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Instructions importantes</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Formats acceptés: PDF, JPG, PNG</li>
                <li>Taille maximale: 5 Mo par fichier</li>
                <li>Les documents doivent être lisibles et en couleur</li>
                <li>Le scan du passeport doit montrer la page d'identité complète</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <DocumentUpload
          id="passport"
          label="Scan du passeport"
          description="Page d'identité avec photo (PDF, JPG ou PNG, max 5 Mo)"
          required
          value={passportScan}
          onChange={setPassportScan}
        />

        <DocumentUpload
          id="photo"
          label="Photo d'identité"
          description="Photo récente format passeport (JPG ou PNG, max 2 Mo)"
          required
          value={photoId}
          onChange={setPhotoId}
        />

        <DocumentUpload
          id="invitation"
          label="Lettre d'invitation / Réservation d'hôtel"
          description="Document justificatif de séjour (PDF, max 5 Mo)"
          value={invitationLetter}
          onChange={setInvitationLetter}
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
          className="gap-2"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!canProceed}
          className="gap-2 px-8"
          data-testid="button-next-step"
        >
          Continuer
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
