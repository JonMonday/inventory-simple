"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { InventoryService } from "@/services/inventory.service";
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
import { Trash2, Plus, Loader2, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";

const receiveSchema = z.object({
    locationId: z.string().min(1, "Target location is required"),
    referenceNo: z.string().optional(),
    comments: z.string().optional(),
    lines: z.array(z.object({
        itemId: z.string().min(1, "Item is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        unitCost: z.number().min(0, "Unit cost cannot be negative"),
    })).min(1, "At least one item is required"),
});

type ReceiveFormValues = z.infer<typeof receiveSchema>;

export default function ReceiveStockPage() {
    const router = useRouter();

    const { data: items } = useQuery({
        queryKey: ["items"],
        queryFn: async () => {
            const res = await api.get("/items");
            return res.data;
        }
    });

    const { data: locations } = useQuery({
        queryKey: ["locations"],
        queryFn: InventoryService.getLocations
    });

    const form = useForm<ReceiveFormValues>({
        resolver: zodResolver(receiveSchema),
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
        mutationFn: InventoryService.receive,
        onSuccess: () => {
            toast.success("Stock received successfully!");
            router.push("/inventory");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to receive stock");
        },
    });

    const onSubmit = (values: ReceiveFormValues) => {
        mutation.mutate(values);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <PageHeader
                title="Receive Inventory Stock"
                subtitle="Record the arrival of new stock into a store or warehouse."
            />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-1">
                            <CardHeader>
                                <CardTitle className="text-sm">Header Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="locationId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">Destination Store</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select location" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {locations?.map((loc: any) => (
                                                        <SelectItem key={loc.id} value={loc.id}>
                                                            {loc.name}
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
                                            <FormLabel className="text-xs">PO / Reference</FormLabel>
                                            <FormControl>
                                                <Input placeholder="REF-001" {...field} />
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
                                    <CardTitle className="text-sm">Items to Post</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="grid grid-cols-12 gap-3 items-end p-3 rounded-lg border bg-muted/20 relative group">
                                            <div className="col-span-7">
                                                <FormField
                                                    control={form.control}
                                                    name={`lines.${index}.itemId`}
                                                    render={({ field }) => (
                                                        <FormItem>
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
                                            <div className="col-span-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`lines.${index}.quantity`}
                                                    render={({ field }) => (
                                                        <FormItem>
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
                                        <Plus className="mr-2 h-4 w-4" /> Add Line
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
