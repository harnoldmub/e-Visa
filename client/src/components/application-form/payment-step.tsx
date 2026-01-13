import { useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CreditCard, Shield, Phone, CheckCircle, Loader2 } from "lucide-react";
import { visaTypeLabels, type VisaType } from "@shared/schema";

const paymentSchema = z.object({
  phoneNumber: z.string().min(9, "Numéro de téléphone invalide").max(15),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions générales",
  }),
});

type PaymentData = z.infer<typeof paymentSchema>;

interface PaymentStepProps {
  visaType: VisaType;
  onBack: () => void;
  onSubmit: (phoneNumber: string) => void;
  isSubmitting?: boolean;
}

export function PaymentStep({ visaType, onBack, onSubmit, isSubmitting }: PaymentStepProps) {
  const visaInfo = visaTypeLabels[visaType];
  
  const form = useForm<PaymentData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      phoneNumber: "",
      acceptTerms: false,
    },
  });

  const handleSubmit = (values: PaymentData) => {
    onSubmit(values.phoneNumber);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Paiement</h2>
        <p className="text-muted-foreground">
          Finalisez votre demande en effectuant le paiement
        </p>
      </div>

      <Card className="bg-card border-2">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-muted-foreground">Type de visa</span>
              <span className="font-medium">{visaInfo.fr}</span>
            </div>
            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-muted-foreground">Durée de validité</span>
              <span className="font-medium">{visaInfo.duration} jours</span>
            </div>
            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-muted-foreground">Frais de visa</span>
              <span className="font-medium">{visaInfo.price} USD</span>
            </div>
            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-muted-foreground">Frais de service</span>
              <span className="font-medium">5 USD</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-lg font-semibold">Total à payer</span>
              <span className="text-2xl font-bold text-primary">{visaInfo.price + 5} USD</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-success/20 bg-success/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-lg bg-success/10 flex items-center justify-center">
              <CreditCard className="h-7 w-7 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Paiement M-Pesa</h3>
              <p className="text-sm text-muted-foreground">
                Paiement sécurisé via mobile money
              </p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro M-Pesa *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                          type="tel"
                          placeholder="+243 XXX XXX XXX" 
                          {...field} 
                          className="h-12 pl-10"
                          data-testid="input-mpesa-phone"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Entrez le numéro de téléphone associé à votre compte M-Pesa
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-terms"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal cursor-pointer">
                        J'accepte les{" "}
                        <a href="#" className="text-primary underline">conditions générales</a>
                        {" "}et la{" "}
                        <a href="#" className="text-primary underline">politique de confidentialité</a>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                <Shield className="h-4 w-4 shrink-0" />
                <span>Votre paiement est sécurisé par chiffrement SSL 256-bit</span>
              </div>

              <div className="flex justify-between pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onBack}
                  className="gap-2"
                  disabled={isSubmitting}
                  data-testid="button-back"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-2 px-8"
                  data-testid="button-submit-payment"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Payer {visaInfo.price + 5} USD
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Après le paiement, vous recevrez une notification de confirmation
          et pourrez suivre l'état de votre demande.
        </p>
      </div>
    </div>
  );
}
