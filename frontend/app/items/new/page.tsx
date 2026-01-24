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
import { Loader2, Plus, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const itemSchema = z.object({
    code: z.string().min(3, "SKU must be at least 3 characters"),
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().optional(),
    categoryId: z.string().min(1, "Category is required"),
    unitOfMeasure: z.string().min(1, "UOM is required"),
    reorderLevel: z.number().min(0).optional(),
    reorderQuantity: z.number().min(0).optional(),
});

type ItemFormValues = z.infer<typeof itemSchema>;

export default function NewItemPage() {
    const router = useRouter();

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await api.get("/items/categories");
            return res.data;
        },
    });

    const form = useForm<ItemFormValues>({
        resolver: zodResolver(itemSchema),
        defaultValues: {
            code: "",
            name: "",
            description: "",
            categoryId: "",
            unitOfMeasure: "EA",
            reorderLevel: 0,
            reorderQuantity: 0,
        },
    });

    const mutation = useMutation({
        mutationFn: async (values: ItemFormValues) => {
            const res = await api.post("/items", values);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Item created successfully!");
            router.push("/items");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create item");
        },
    });

    const onSubmit = (values: ItemFormValues) => {
        mutation.mutate(values);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <PageHeader
                title="Create New Inventory Item"
                subtitle="Define a new catalog item with its SKU, category, and replenishment thresholds."
            />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>SKU / Item Code</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="ITEM-001" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="unitOfMeasure"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>UOM</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select UOM" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="EA">Each (EA)</SelectItem>
                                                        <SelectItem value="BX">Box (BX)</SelectItem>
                                                        <SelectItem value="PK">Pack (PK)</SelectItem>
                                                        <SelectItem value="KG">Kilogram (KG)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Item Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Descriptive item name" {...field} />
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
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Detailed description..."
                                                    className="resize-none h-24"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Categorization</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="categoryId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {categories?.map((cat: any) => (
                                                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Thresholds</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="reorderLevel"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Reorder Level</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="reorderQuantity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Reorder Qty</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Button type="submit" className="w-full" disabled={mutation.isPending}>
                                {mutation.isPending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Savve Catalog Item
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
