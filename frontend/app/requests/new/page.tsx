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
import { Trash2, Plus, Loader2, Save, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const requestSchema = z.object({
    templateId: z.string().min(1, "Workflow template is required"),
    lines: z.array(z.object({
        itemId: z.string().min(1, "Item is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
    })).min(1, "At least one item is required"),
});

type RequestFormValues = z.infer<typeof requestSchema>;

export default function NewRequestPage() {
    const router = useRouter();

    const { data: items } = useQuery({
        queryKey: ["items"],
        queryFn: async () => {
            const res = await api.get("/items");
            return res.data;
        },
    });

    const { data: templates } = useQuery({
        queryKey: ["templates"],
        queryFn: async () => {
            const res = await api.get("/templates");
            return res.data;
        },
    });

    const form = useForm<RequestFormValues>({
        resolver: zodResolver(requestSchema),
        defaultValues: {
            templateId: "",
            lines: [{ itemId: "", quantity: 1 }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "lines",
    });

    const mutation = useMutation({
        mutationFn: async (values: RequestFormValues) => {
            const res = await api.post("/requests", values);
            return res.data;
        },
        onSuccess: (data) => {
            toast.success("Request created successfully!");
            router.push(`/requests/${data.id}`);
        },
        onError: () => {
            toast.error("Failed to create request. Please try again.");
        },
    });

    const onSubmit = (values: RequestFormValues) => {
        mutation.mutate(values);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <PageHeader
                title="Create Material Request"
                subtitle="Select items and quantities you wish to requisition from inventory."
            />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Request Settings</CardTitle>
                            <CardDescription>Select the workflow this request should follow.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="templateId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Workflow Template</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a workflow template" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {templates?.map((t: any) => (
                                                    <SelectItem key={t.id} value={t.id}>
                                                        {t.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>

                        <CardHeader>
                            <CardTitle>Request Items</CardTitle>
                            <CardDescription>Add the items and quantities you need. Stock will be reserved upon submission.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex items-end gap-4 p-4 rounded-lg border bg-muted/30 relative group">
                                    <div className="flex-1 space-y-4 lg:grid lg:grid-cols-4 lg:gap-4 lg:space-y-0">
                                        <div className="lg:col-span-3">
                                            <FormField
                                                control={form.control}
                                                name={`lines.${index}.itemId`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Item</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select an item" />
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
                                        <div>
                                            <FormField
                                                control={form.control}
                                                name={`lines.${index}.quantity`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Quantity</FormLabel>
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
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => remove(index)}
                                        disabled={fields.length === 1}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-full border-dashed"
                                onClick={() => append({ itemId: "", quantity: 1 })}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add Another Item
                            </Button>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t p-6 bg-muted/50">
                            <Button variant="ghost" onClick={() => router.back()} type="button">Cancel</Button>
                            <div className="flex gap-3">
                                <Button type="submit" disabled={mutation.isPending}>
                                    {mutation.isPending ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="mr-2 h-4 w-4" />
                                    )}
                                    Save as Draft
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    );
}
