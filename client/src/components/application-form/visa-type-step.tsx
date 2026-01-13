import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plane, 
  Briefcase, 
  ArrowRightLeft, 
  Calendar,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { VisaType } from "@shared/schema";

interface VisaTypeStepProps {
  selectedType: VisaType | null;
  onSelect: (type: VisaType) => void;
  onNext: () => void;
}

const visaOptions = [
  {
    type: "TOURISM" as VisaType,
    icon: Plane,
    title: "Visa Tourisme",
    description: "Pour les voyages touristiques et de loisirs en RDC.",
    duration: "30 jours",
    price: 50,
    features: ["Entrée unique", "Non prolongeable", "Activités touristiques uniquement"],
  },
  {
    type: "BUSINESS" as VisaType,
    icon: Briefcase,
    title: "Visa Affaires",
    description: "Pour les voyages professionnels et commerciaux.",
    duration: "90 jours",
    price: 100,
    features: ["Entrées multiples", "Prolongeable", "Activités commerciales autorisées"],
  },
  {
    type: "TRANSIT" as VisaType,
    icon: ArrowRightLeft,
    title: "Visa Transit",
    description: "Pour les escales et transits par la RDC.",
    duration: "7 jours",
    price: 30,
    features: ["Entrée unique", "Séjour limité", "Transit aéroportuaire"],
  },
  {
    type: "SHORT_STAY" as VisaType,
    icon: Calendar,
    title: "Visa Court Séjour",
    description: "Pour les visites de courte durée en RDC.",
    duration: "15 jours",
    price: 40,
    features: ["Entrée unique", "Séjour court", "Visite familiale ou amicale"],
  },
];

export function VisaTypeStep({ selectedType, onSelect, onNext }: VisaTypeStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choisissez votre type de visa</h2>
        <p className="text-muted-foreground">
          Sélectionnez le visa qui correspond à votre motif de voyage
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {visaOptions.map((visa) => {
          const isSelected = selectedType === visa.type;
          return (
            <Card
              key={visa.type}
              className={cn(
                "relative cursor-pointer transition-all hover-elevate overflow-visible",
                isSelected && "ring-2 ring-primary"
              )}
              onClick={() => onSelect(visa.type)}
              data-testid={`visa-card-${visa.type.toLowerCase()}`}
            >
              {isSelected && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-primary-foreground" />
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                  )}>
                    <visa.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{visa.title}</h3>
                      <span className="text-lg font-bold text-primary">{visa.price} USD</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {visa.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm mb-3">
                      <span className="text-muted-foreground">Durée:</span>
                      <span className="font-medium">{visa.duration}</span>
                    </div>
                    <ul className="space-y-1">
                      {visa.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-3.5 w-3.5 text-success" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          onClick={onNext}
          disabled={!selectedType}
          className="px-8"
          data-testid="button-next-step"
        >
          Continuer
        </Button>
      </div>
    </div>
  );
}
