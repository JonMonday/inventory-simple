"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const stocktakeSchema = z.object({
    locationId: z.string().min(1, "Location is required"),
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
});

type StocktakeFormValues = z.infer<typeof stocktakeSchema>;

export default function NewStocktakePage() {
    const router = useRouter();

    const { data: locations } = useQuery({
        queryKey: ["locations"],
        queryFn: async () => {
            const res = await api.get("/inventory/locations");
            return res.data;
        },
    });

    const form = useForm<StocktakeFormValues>({
        resolver: zodResolver(stocktakeSchema),
        defaultValues: {
            locationId: "",
            title: "",
            description: "",
        },
    });

    const mutation = useMutation({
        mutationFn: async (values: StocktakeFormValues) => {
            const res = await api.post("/stocktakes", values);
            return res.data;
        },
        onSuccess: (data) => {
            toast.success("Stocktake scheduled successfully!");
            router.push(`/stocktakes/${data.id}`);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to schedule stocktake");
        },
    });

    const onSubmit = (values: StocktakeFormValues) => {
        mutation.mutate(values);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <PageHeader
                title="Schedule New Stocktake"
                subtitle="Create a new stocktake session to reconcile physical inventory at a specific location."
            />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Stocktake Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="locationId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select location for count" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {locations?.map((loc: any) => (
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
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Monthly Stock Reconcilation - Jan 2026" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Provide context or instructions for the counters..."
                                                className="resize-none"
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
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Create & Schedule
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    );
}
