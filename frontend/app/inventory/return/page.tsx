"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { InventoryService } from "@/services/inventory.service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";

const returnSchema = z.object({
    itemId: z.string().min(1, "Please select an item"),
    fromLocationId: z.string().min(1, "Please select origin location"),
    toLocationId: z.string().min(1, "Please select destination location"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    reasonCodeId: z.string().min(1, "Please select a reason code"),
    comments: z.string().optional(),
});

type ReturnFormValues = z.infer<typeof returnSchema>;

export default function ReturnStockPage() {
    const router = useRouter();

    const { data: locations } = useQuery({
        queryKey: ["locations"],
        queryFn: InventoryService.getLocations
    });

    const { data: items } = useQuery({
        queryKey: ["items"],
        queryFn: async () => {
            const res = await api.get("/items");
            return res.data;
        }
    });

    const { data: reasonCodes } = useQuery({
        queryKey: ["reason-codes"],
        queryFn: InventoryService.getReasonCodes
    });

    const form = useForm<ReturnFormValues>({
        resolver: zodResolver(returnSchema),
        defaultValues: {
            itemId: "",
            fromLocationId: "",
            toLocationId: "",
            quantity: 1,
            reasonCodeId: "",
            comments: "",
        },
    });

    const mutation = useMutation({
        mutationFn: InventoryService.return,
        onSuccess: () => {
            toast.success("Stock return recorded successfully!");
            router.push("/inventory");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to record return");
        },
    });

    const onSubmit = (values: ReturnFormValues) => {
        mutation.mutate(values);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <PageHeader
                title="Return Stock"
                subtitle="Return unused or incorrect items back to a store or warehouse."
            />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Return Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="fromLocationId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">Return From</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select origin" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {locations?.map((loc: any) => (
                                                        <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="toLocationId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">Return To</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select destination" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {locations?.map((loc: any) => (
                                                        <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="itemId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Item</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select item" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {items?.map((item: any) => (
                                                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="quantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">Quantity</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="reasonCodeId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">Reason</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select reason" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {reasonCodes?.map((rc: any) => (
                                                        <SelectItem key={rc.id} value={rc.id}>{rc.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="comments"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Comments (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="resize-none h-20"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="flex justify-between border-t p-6 bg-muted/50">
                            <Button variant="ghost" onClick={() => router.back()} type="button">Cancel</Button>
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Undo2 className="mr-2 h-4 w-4" />
                                )}
                                Process Return
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    );
}
