import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { entryPoints, countries } from "@shared/schema";
import { ArrowLeft, ArrowRight } from "lucide-react";

const travelInfoSchema = z.object({
  arrivalDate: z.string().min(1, "Date d'arrivée requise"),
  departureDate: z.string().min(1, "Date de départ requise"),
  entryPoint: z.string().min(2, "Point d'entrée requis"),
  addressInDRC: z.string().min(5, "Adresse en RDC requise"),
  purposeOfVisit: z.string().optional(),
  sponsorName: z.string().optional(),
  sponsorAddress: z.string().optional(),
  sponsorPhone: z.string().optional(),
  passportNumber: z.string().min(5, "Numéro de passeport invalide"),
  passportIssueDate: z.string().min(1, "Date d'émission requise"),
  passportExpiryDate: z.string().min(1, "Date d'expiration requise"),
  passportIssuingCountry: z.string().min(2, "Pays d'émission requis"),
});

type TravelInfoData = z.infer<typeof travelInfoSchema>;

interface TravelInfoStepProps {
  data: Partial<TravelInfoData>;
  onSave: (data: TravelInfoData) => void;
  onBack: () => void;
  onNext: () => void;
}

export function TravelInfoStep({ data, onSave, onBack, onNext }: TravelInfoStepProps) {
  const form = useForm<TravelInfoData>({
    resolver: zodResolver(travelInfoSchema),
    defaultValues: {
      arrivalDate: data.arrivalDate || "",
      departureDate: data.departureDate || "",
      entryPoint: data.entryPoint || "",
      addressInDRC: data.addressInDRC || "",
      purposeOfVisit: data.purposeOfVisit || "",
      sponsorName: data.sponsorName || "",
      sponsorAddress: data.sponsorAddress || "",
      sponsorPhone: data.sponsorPhone || "",
      passportNumber: data.passportNumber || "",
      passportIssueDate: data.passportIssueDate || "",
      passportExpiryDate: data.passportExpiryDate || "",
      passportIssuingCountry: data.passportIssuingCountry || "",
    },
  });

  const onSubmit = (values: TravelInfoData) => {
    onSave(values);
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Informations de Voyage</h2>
        <p className="text-muted-foreground">
          Renseignez les détails de votre voyage et votre passeport
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">Passeport</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="passportNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de passeport *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="AB1234567" 
                        {...field} 
                        className="h-12"
                        data-testid="input-passport-number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passportIssuingCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays d'émission *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12" data-testid="select-passport-country">
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="passportIssueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'émission *</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        className="h-12"
                        data-testid="input-passport-issue"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passportExpiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'expiration *</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        className="h-12"
                        data-testid="input-passport-expiry"
                      />
                    </FormControl>
                    <FormDescription>
                      Doit être valide 6 mois après la date de départ
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">Détails du voyage</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="arrivalDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'arrivée *</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        className="h-12"
                        data-testid="input-arrival"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="departureDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de départ *</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        className="h-12"
                        data-testid="input-departure"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="entryPoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Point d'entrée en RDC *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12" data-testid="select-entry-point">
                        <SelectValue placeholder="Sélectionnez le point d'entrée" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {entryPoints.map((point) => (
                        <SelectItem key={point} value={point}>
                          {point}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressInDRC"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse de séjour en RDC *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Nom de l'hôtel ou adresse complète..."
                      {...field} 
                      className="min-h-[80px]"
                      data-testid="input-address-drc"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purposeOfVisit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motif détaillé du voyage</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Décrivez le but de votre voyage..."
                      {...field} 
                      className="min-h-[80px]"
                      data-testid="input-purpose"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">
              Sponsor / Hôte en RDC
              <span className="text-sm font-normal text-muted-foreground ml-2">(optionnel)</span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="sponsorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du sponsor/hôte</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nom complet" 
                        {...field} 
                        className="h-12"
                        data-testid="input-sponsor-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sponsorPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone du sponsor</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel"
                        placeholder="+243 XXX XXX XXX" 
                        {...field} 
                        className="h-12"
                        data-testid="input-sponsor-phone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="sponsorAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse du sponsor</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Adresse complète du sponsor en RDC..."
                      {...field} 
                      className="min-h-[80px]"
                      data-testid="input-sponsor-address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
              type="submit"
              className="gap-2 px-8"
              data-testid="button-next-step"
            >
              Continuer
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
