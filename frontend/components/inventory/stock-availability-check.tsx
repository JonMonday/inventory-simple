import { useState } from "react";
import { InventoryService } from "@/services/inventory.service";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, Info } from "lucide-react";

interface StockAvailabilityCheckProps {
    itemId: string;
    storeLocationId: string;
    quantity: number;
    onResult?: (available: boolean, data?: any) => void;
}

export function StockAvailabilityCheck({ itemId, storeLocationId, quantity, onResult }: StockAvailabilityCheckProps) {
    const [checking, setChecking] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [backendPending, setBackendPending] = useState(false);

    const checkAvailability = async () => {
        try {
            setChecking(true);
            setError(null);
            setBackendPending(false);

            const data = await InventoryService.checkAvailability({
                itemId,
                storeLocationId,
                quantity
            });

            setResult(data);
            onResult?.(data.available, data);
        } catch (err: any) {
            if (err.response?.status === 404 || err.response?.status === 501) {
                setBackendPending(true);
                setError("Backend endpoint pending: POST /inventory/availability");
            } else {
                setError(err.response?.data?.message || "Failed to check availability");
            }
            onResult?.(false);
        } finally {
            setChecking(false);
        }
    };

    if (backendPending) {
        return (
            <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                    <strong>Backend Pending:</strong> Stock availability check endpoint is not yet implemented.
                    You can still proceed with the operation.
                </AlertDescription>
            </Alert>
        );
    }

    if (checking) {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Checking availability...</span>
            </div>
        );
    }

    if (error && !backendPending) {
        return (
            <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (result) {
        return (
            <div className="flex items-center gap-2">
                {result.available ? (
                    <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-600">Stock Available</span>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            {result.availableQuantity || quantity} units
                        </Badge>
                    </>
                ) : (
                    <>
                        <XCircle className="h-4 w-4 text-destructive" />
                        <span className="text-sm font-medium text-destructive">Insufficient Stock</span>
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Only {result.availableQuantity || 0} available
                        </Badge>
                    </>
                )}
            </div>
        );
    }

    return null;
}

export function useStockAvailability() {
    const [checking, setChecking] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const checkAvailability = async (itemId: string, storeLocationId: string, quantity: number) => {
        try {
            setChecking(true);
            setError(null);

            const data = await InventoryService.checkAvailability({
                itemId,
                storeLocationId,
                quantity
            });

            setResult(data);
            return data;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || "Failed to check availability";
            setError(errorMsg);
            throw err;
        } finally {
            setChecking(false);
        }
    };

    return {
        checking,
        result,
        error,
        checkAvailability
    };
}
