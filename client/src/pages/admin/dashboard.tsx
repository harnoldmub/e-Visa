import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/status-badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  FileText,
  Search,
  Filter,
  Eye,
  Check,
  X,
  MessageSquare,
  Download,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  LogOut,
  Loader2,
  RefreshCw,
} from "lucide-react";
import type { Application, ApplicationStatus } from "@shared/schema";
import { visaTypeLabels, applicationStatuses } from "@shared/schema";

interface DashboardStats {
  total: number;
  submitted: number;
  underReview: number;
  approved: number;
  rejected: number;
  issued: number;
}

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | "request_info" | null>(null);
  const [actionNote, setActionNote] = useState("");

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: applications, isLoading: appsLoading, refetch } = useQuery<Application[]>({
    queryKey: ["/api/admin/applications"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/applications/${id}/status`, { status, notes });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setSelectedApp(null);
      setActionType(null);
      setActionNote("");
      toast({
        title: "Statut mis à jour",
        description: "La demande a été mise à jour avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour.",
        variant: "destructive",
      });
    },
  });

  const handleAction = () => {
    if (!selectedApp || !actionType) return;

    let newStatus: ApplicationStatus;
    switch (actionType) {
      case "approve":
        newStatus = "APPROVED";
        break;
      case "reject":
        newStatus = "REJECTED";
        break;
      case "request_info":
        newStatus = "NEED_INFO";
        break;
      default:
        return;
    }

    updateStatusMutation.mutate({
      id: selectedApp.id,
      status: newStatus,
      notes: actionNote,
    });
  };

  const filteredApps = applications?.filter((app) => {
    const matchesSearch =
      searchQuery === "" ||
      app.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${app.firstName} ${app.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.passportNumber?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 w-full border-b bg-sidebar text-sidebar-foreground">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <span className="font-semibold">e-Visa RDC</span>
              <span className="text-sm text-sidebar-foreground/70 ml-2">| Administration DGM</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 text-sidebar-foreground hover:bg-sidebar-accent">
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tableau de Bord</h1>
          <p className="text-muted-foreground">
            Gestion des demandes de visa électronique
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats?.total || 0}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-muted-foreground/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En attente</p>
                  <p className="text-2xl font-bold text-warning">{stats?.submitted || 0}</p>
                </div>
                <Clock className="h-8 w-8 text-warning/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En examen</p>
                  <p className="text-2xl font-bold text-primary">{stats?.underReview || 0}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approuvées</p>
                  <p className="text-2xl font-bold text-success">{stats?.approved || 0}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejetées</p>
                  <p className="text-2xl font-bold text-destructive">{stats?.rejected || 0}</p>
                </div>
                <XCircle className="h-8 w-8 text-destructive/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
            <CardTitle>Demandes de Visa</CardTitle>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                  data-testid="input-search"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48" data-testid="select-status-filter">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  {applicationStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => refetch()} data-testid="button-refresh">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {appsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredApps && filteredApps.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° Demande</TableHead>
                      <TableHead>Demandeur</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Nationalité</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApps.map((app) => (
                      <TableRow key={app.id} className="hover-elevate">
                        <TableCell className="font-mono font-medium">
                          {app.applicationNumber}
                        </TableCell>
                        <TableCell>
                          {app.firstName} {app.lastName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {visaTypeLabels[app.visaType as keyof typeof visaTypeLabels]?.fr || app.visaType}
                          </Badge>
                        </TableCell>
                        <TableCell>{app.nationality}</TableCell>
                        <TableCell>
                          <StatusBadge status={app.status as ApplicationStatus} />
                        </TableCell>
                        <TableCell>
                          {app.submittedAt
                            ? new Date(app.submittedAt).toLocaleDateString("fr-FR")
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedApp(app)}
                              data-testid={`button-view-${app.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {app.status === "SUBMITTED" || app.status === "UNDER_REVIEW" ? (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-success hover:text-success"
                                  onClick={() => {
                                    setSelectedApp(app);
                                    setActionType("approve");
                                  }}
                                  data-testid={`button-approve-${app.id}`}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => {
                                    setSelectedApp(app);
                                    setActionType("reject");
                                  }}
                                  data-testid={`button-reject-${app.id}`}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-warning hover:text-warning"
                                  onClick={() => {
                                    setSelectedApp(app);
                                    setActionType("request_info");
                                  }}
                                  data-testid={`button-info-${app.id}`}
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              </>
                            ) : null}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune demande trouvée</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={!!selectedApp && !actionType} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la demande</DialogTitle>
            <DialogDescription>
              {selectedApp?.applicationNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <StatusBadge status={selectedApp.status as ApplicationStatus} />
                <span className="text-sm text-muted-foreground">
                  Soumis le {selectedApp.submittedAt ? new Date(selectedApp.submittedAt).toLocaleDateString("fr-FR") : "N/A"}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nom complet</p>
                  <p className="font-medium">{selectedApp.firstName} {selectedApp.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nationalité</p>
                  <p className="font-medium">{selectedApp.nationality}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedApp.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{selectedApp.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Passeport</p>
                  <p className="font-medium">{selectedApp.passportNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type de visa</p>
                  <p className="font-medium">
                    {visaTypeLabels[selectedApp.visaType as keyof typeof visaTypeLabels]?.fr}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dates de voyage</p>
                  <p className="font-medium">
                    {new Date(selectedApp.arrivalDate).toLocaleDateString("fr-FR")} - {new Date(selectedApp.departureDate).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Point d'entrée</p>
                  <p className="font-medium">{selectedApp.entryPoint}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Adresse en RDC</p>
                <p className="font-medium">{selectedApp.addressInDRC}</p>
              </div>

              {selectedApp.sponsorName && (
                <div>
                  <p className="text-sm text-muted-foreground">Sponsor/Hôte</p>
                  <p className="font-medium">{selectedApp.sponsorName}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedApp(null)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!actionType} onOpenChange={() => { setActionType(null); setActionNote(""); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" && "Approuver la demande"}
              {actionType === "reject" && "Rejeter la demande"}
              {actionType === "request_info" && "Demander des informations"}
            </DialogTitle>
            <DialogDescription>
              Demande: {selectedApp?.applicationNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder={
                actionType === "approve" 
                  ? "Notes (optionnel)..." 
                  : actionType === "reject"
                  ? "Motif du refus..."
                  : "Informations requises..."
              }
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
              className="min-h-[100px]"
              data-testid="textarea-action-note"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setActionType(null); setActionNote(""); }}>
              Annuler
            </Button>
            <Button
              onClick={handleAction}
              disabled={updateStatusMutation.isPending || (actionType !== "approve" && !actionNote.trim())}
              className={
                actionType === "approve" 
                  ? "bg-success hover:bg-success/90" 
                  : actionType === "reject"
                  ? "bg-destructive hover:bg-destructive/90"
                  : ""
              }
              data-testid="button-confirm-action"
            >
              {updateStatusMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
