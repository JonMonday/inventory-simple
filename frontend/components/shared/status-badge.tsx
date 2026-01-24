import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = "SUCCESS" | "WARNING" | "DANGER" | "INFO" | "NEUTRAL";

interface StatusBadgeProps {
    label: string;
    type?: StatusType;
    className?: string;
}

const typeMap: Record<StatusType, string> = {
    SUCCESS: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    WARNING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    DANGER: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    INFO: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    NEUTRAL: "bg-slate-500/10 text-slate-500 border-slate-500/20",
};

export function StatusBadge({ label, type = "NEUTRAL", className }: StatusBadgeProps) {
    return (
        <Badge
            variant="outline"
            className={cn("px-2 py-0.5 font-medium", typeMap[type], className)}
        >
            {label}
        </Badge>
    );
}
