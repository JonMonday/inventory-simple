"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const itemSchema = z.object({
    name: z.string().min(2, "Name is required"),
    code: z.string().min(2, "Code is required"),
    description: z.string().optional().default(""),
    categoryId: z.string().min(1, "Category is required"),
    unitOfMeasure: z.string().min(1, "UOM is required"),
    reorderLevel: z.coerce.number().min(0),
    reorderQuantity: z.coerce.number().min(0),
});

type ItemFormValues = {
    name: string;
    code: string;
    description: string;
    categoryId: string;
    unitOfMeasure: string;
    reorderLevel: number;
    reorderQuantity: number;
};

interface ItemDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: any) => void;
    title: string;
    loading?: boolean;
    initialData?: any;
    categories: { id: string; name: string }[];
}

export function ItemDialog({
    open,
    onOpenChange,
    onSubmit,
    title,
    loading,
    initialData,
    categories
}: ItemDialogProps) {
    const form = useForm<ItemFormValues>({
        resolver: zodResolver(itemSchema) as any,
        defaultValues: {
            name: "",
            code: "",
            description: "",
            categoryId: "",
            unitOfMeasure: "EA",
            reorderLevel: 0,
            reorderQuantity: 0
        }
    });

    useEffect(() => {
        if (open) {
            if (initialData) {
                form.reset({
                    name: initialData.name || "",
                    code: initialData.code || "",
                    description: initialData.description || "",
                    categoryId: initialData.categoryId || "",
                    unitOfMeasure: initialData.unitOfMeasure || "EA",
                    reorderLevel: initialData.reorderLevel || 0,
                    reorderQuantity: initialData.reorderQuantity || 0
                });
            } else {
                form.reset({
                    name: "",
                    code: "",
                    description: "",
                    categoryId: "",
                    unitOfMeasure: "EA",
                    reorderLevel: 0,
                    reorderQuantity: 0
                });
            }
        }
    }, [initialData, form, open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs uppercase font-bold text-muted-foreground">Item Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ITM-001" {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs uppercase font-bold text-muted-foreground">Item Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Laptop Stand" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs uppercase font-bold text-muted-foreground">Category</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((c: any) => (
                                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="unitOfMeasure"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs uppercase font-bold text-muted-foreground">Unit of Measure</FormLabel>
                                        <FormControl>
                                            <Input placeholder="EA / PKT / BOX" {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="reorderLevel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs uppercase font-bold text-muted-foreground">Reorder Level</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
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
                                        <FormLabel className="text-xs uppercase font-bold text-muted-foreground">Reorder Quantity</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs uppercase font-bold text-muted-foreground">Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Technical specifications..." {...field} className="h-20" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4 border-t">
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Item
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
