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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Trash2, Plus, Loader2, Save, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const restockSchema = z.object({
    locationId: z.string().min(1, "Target location is required"),
    referenceNo: z.string().optional(),
    comments: z.string().optional(),
    lines: z.array(z.object({
        itemId: z.string().min(1, "Item is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        unitCost: z.number().min(0, "Unit cost cannot be negative"),
    })).min(1, "At least one item is required"),
});

type RestockFormValues = z.infer<typeof restockSchema>;

export default function ReceiveStockPage() {
    const router = useRouter();

    const { data: items } = useQuery({
        queryKey: ["items"],
        queryFn: async () => {
            const res = await api.get("/items");
            return res.data;
        },
    });

    const { data: locations } = useQuery({
        queryKey: ["locations"],
        queryFn: async () => {
            const res = await api.get("/inventory/locations");
            return res.data;
        },
    });

    const form = useForm<RestockFormValues>({
        resolver: zodResolver(restockSchema),
        defaultValues: {
            locationId: "",
            referenceNo: "",
            comments: "",
            lines: [{ itemId: "", quantity: 1, unitCost: 0 }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "lines",
    });

    const mutation = useMutation({
        mutationFn: async (values: RestockFormValues) => {
            const res = await api.post("/inventory/receive", values);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Stock received successfully!");
            router.push("/items");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to receive stock");
        },
    });

    const onSubmit = (values: RestockFormValues) => {
        mutation.mutate(values);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <PageHeader
                title="Receive Inventory Stock"
                subtitle="Record the arrival of new stock from suppliers or other branches."
            />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-1">
                            <CardHeader>
                                <CardTitle>Header Details</CardTitle>
                                <CardDescription>Basic information about this shipment.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="locationId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Target Location</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select destination" />
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
                                    name="referenceNo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>PO / Invoice Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="REF-12345" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="comments"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Comments</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Additional notes..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <div className="md:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Shipment Lines</CardTitle>
                                    <CardDescription>Items and quantities being received.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="grid grid-cols-12 gap-3 items-end p-3 rounded-lg border bg-muted/20 relative group">
                                            <div className="col-span-12 lg:col-span-6">
                                                <FormField
                                                    control={form.control}
                                                    name={`lines.${index}.itemId`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">Item</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="h-9">
                                                                        <SelectValue placeholder="Select item" />
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
                                            </div>
                                            <div className="col-span-6 lg:col-span-3">
                                                <FormField
                                                    control={form.control}
                                                    name={`lines.${index}.quantity`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">Qty</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    className="h-9"
                                                                    {...field}
                                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-5 lg:col-span-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`lines.${index}.unitCost`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">Unit Cost</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    step="0.01"
                                                                    className="h-9"
                                                                    {...field}
                                                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-1 flex justify-end">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => remove(index)}
                                                    disabled={fields.length === 1}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="w-full border-dashed"
                                        onClick={() => append({ itemId: "", quantity: 1, unitCost: 0 })}
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> Add Another Item
                                    </Button>
                                </CardContent>
                                <CardFooter className="flex justify-between border-t p-6 bg-muted/50">
                                    <Button variant="ghost" onClick={() => router.back()} type="button">Cancel</Button>
                                    <Button type="submit" disabled={mutation.isPending}>
                                        {mutation.isPending ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Download className="mr-2 h-4 w-4" />
                                        )}
                                        Post Shipment
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
