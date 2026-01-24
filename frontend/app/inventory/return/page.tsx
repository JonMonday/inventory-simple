"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
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
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowLeftRight, Save, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
        queryFn: async () => {
            const res = await api.get("/inventory/locations");
            return res.data;
        },
    });

    const { data: items } = useQuery({
        queryKey: ["items"],
        queryFn: async () => {
            const res = await api.get("/items");
            return res.data;
        },
    });

    const { data: reasonCodes } = useQuery({
        queryKey: ["reason-codes"],
        queryFn: async () => {
            const res = await api.get("/inventory/reason-codes");
            return res.data;
        },
    });

    // Filter locations: Origin can be anything (usually Dept), Destination usually STORE/WAREHOUSE
    const originLocations = locations || [];
    const destinationLocations = locations?.filter((l: any) => l.type !== 'DEPARTMENT') || [];

    // Filter reason codes for returns
    const returnReasons = reasonCodes?.filter((rc: any) =>
        rc.allowedMovements.some((m: any) => m.movementType === 'RETURN' || m.movementType === 'RECEIVE')
    ) || [];

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
        mutationFn: async (values: ReturnFormValues) => {
            const res = await api.post("/inventory/return", values);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Stock return recorded successfully!");
            router.push("/items");
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
                subtitle="Return unused or incorrect items from a department back to a store or warehouse."
            />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Return Details</CardTitle>
                            <CardDescription>
                                Specify the item, locations, and the reason for the return.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="fromLocationId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Return From (Origin)</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select origin location" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {originLocations.map((loc: any) => (
                                                        <SelectItem key={loc.id} value={loc.id}>
                                                            {loc.name} ({loc.code})
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
                                    name="toLocationId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Return To (Destination)</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select destination" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {destinationLocations.map((loc: any) => (
                                                        <SelectItem key={loc.id} value={loc.id}>
                                                            {loc.name} ({loc.code})
                                                        </SelectItem>
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
                                        <FormLabel>Item</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Search or select item" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {items?.map((item: any) => (
                                                    <SelectItem key={item.id} value={item.id}>
                                                        {item.name} ({item.code})
                                                    </SelectItem>
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
                                            <FormLabel>Quantity</FormLabel>
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
                                            <FormLabel>Reason for Return</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select reason" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {returnReasons.map((rc: any) => (
                                                        <SelectItem key={rc.id} value={rc.id}>
                                                            {rc.name}
                                                        </SelectItem>
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
                                        <FormLabel>Comments (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Provide any additional details or context for this return..."
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
                            <Button variant="ghost" onClick={() => router.back()} type="button">
                                Cancel
                            </Button>
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
