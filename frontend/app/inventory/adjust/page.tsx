"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { InventoryService } from "@/services/inventory.service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";

const adjustSchema = z.object({
    itemId: z.string().min(1, "Item is required"),
    locationId: z.string().min(1, "Location is required"),
    quantity: z.number(),
    reasonCodeId: z.string().min(1, "Reason is required"),
    comments: z.string().optional(),
});

type AdjustFormValues = z.infer<typeof adjustSchema>;

export default function AdjustStockPage() {
    const router = useRouter();

    const { data: locations } = useQuery({ queryKey: ["locations"], queryFn: InventoryService.getLocations });
    const { data: items } = useQuery({ queryKey: ["items"], queryFn: async () => (await api.get("/items")).data });
    const { data: reasonCodes } = useQuery({ queryKey: ["reason-codes"], queryFn: InventoryService.getReasonCodes });

    const form = useForm<AdjustFormValues>({
        resolver: zodResolver(adjustSchema),
        defaultValues: { itemId: "", locationId: "", quantity: 0, reasonCodeId: "", comments: "" },
    });

    const mutation = useMutation({
        mutationFn: InventoryService.adjust,
        onSuccess: () => {
            toast.success("Manual adjustment posted!");
            router.push("/inventory");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Adjustment failed");
        },
    });

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <PageHeader title="Manual Adjustment" subtitle="Correct stock discrepancies for spoilage, theft, or donation." />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(v => mutation.mutate(v))} className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle className="text-sm">Correction Details</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="itemId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">Item</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select item" /></SelectTrigger></FormControl>
                                                <SelectContent>{items?.map((i: any) => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}</SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="locationId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">Location</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger></FormControl>
                                                <SelectContent>{locations?.map((l: any) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="quantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">Discrepancy (+ or -)</FormLabel>
                                            <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="reasonCodeId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">Adjustment Reason</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger></FormControl>
                                                <SelectContent>{reasonCodes?.map((rc: any) => <SelectItem key={rc.id} value={rc.id}>{rc.name}</SelectItem>)}</SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t p-6 bg-muted/50">
                            <Button variant="ghost" onClick={() => router.back()} type="button">Cancel</Button>
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SlidersHorizontal className="mr-2 h-4 w-4" />}
                                Post Adjustment
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    );
}
