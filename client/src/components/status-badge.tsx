import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileCheck, 
  AlertTriangle,
  FileX,
  Timer
} from "lucide-react";
import type { ApplicationStatus } from "@shared/schema";
import { statusLabels } from "@shared/schema";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

const statusIcons: Record<ApplicationStatus, React.ReactNode> = {
  DRAFT: <Clock className="h-3 w-3" />,
  SUBMITTED: <Timer className="h-3 w-3" />,
  UNDER_REVIEW: <Clock className="h-3 w-3 animate-pulse" />,
  NEED_INFO: <AlertTriangle className="h-3 w-3" />,
  APPROVED: <CheckCircle className="h-3 w-3" />,
  REJECTED: <XCircle className="h-3 w-3" />,
  ISSUED: <FileCheck className="h-3 w-3" />,
  EXPIRED: <AlertCircle className="h-3 w-3" />,
  REVOKED: <FileX className="h-3 w-3" />,
};

const statusStyles: Record<ApplicationStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  SUBMITTED: "bg-primary/10 text-primary border-primary/20",
  UNDER_REVIEW: "bg-warning/10 text-warning-foreground border-warning/30 dark:text-warning",
  NEED_INFO: "bg-warning/10 text-warning-foreground border-warning/30 dark:text-warning",
  APPROVED: "bg-success/10 text-success border-success/20",
  REJECTED: "bg-destructive/10 text-destructive border-destructive/20",
  ISSUED: "bg-success/10 text-success border-success/20",
  EXPIRED: "bg-muted text-muted-foreground",
  REVOKED: "bg-destructive/10 text-destructive border-destructive/20",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const label = statusLabels[status];
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "gap-1.5 font-medium border",
        statusStyles[status],
        className
      )}
    >
      {statusIcons[status]}
      {label.fr}
    </Badge>
  );
}
