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

const entitySchema = z.object({
    name: z.string().min(2, "Name is required"),
    code: z.string().min(2, "Code is required").toUpperCase(),
    description: z.string().optional(),
    // For entities that need parent/branch linking
    parentId: z.string().optional(),
});

type EntityFormValues = z.infer<typeof entitySchema>;

interface EntityDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: any) => void;
    title: string;
    loading?: boolean;
    initialData?: any;
    parentLabel?: string;
    parentOptions?: { id: string; name: string }[];
}

export function EntityDialog({
    open,
    onOpenChange,
    onSubmit,
    title,
    loading,
    initialData,
    parentLabel,
    parentOptions
}: EntityDialogProps) {
    const form = useForm<EntityFormValues>({
        resolver: zodResolver(entitySchema),
        defaultValues: {
            name: "",
            code: "",
            description: "",
            parentId: ""
        }
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name || "",
                code: initialData.code || "",
                description: initialData.description || "",
                parentId: initialData.branchId || initialData.departmentId || initialData.unitId || ""
            });
        } else {
            form.reset({
                name: "",
                code: "",
                description: "",
                parentId: ""
            });
        }
    }, [initialData, form, open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
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
                                        <FormLabel className="text-xs uppercase font-bold text-muted-foreground">Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="CODE-01" {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} />
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
                                        <FormLabel className="text-xs uppercase font-bold text-muted-foreground">Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Operations" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {parentLabel && parentOptions && (
                            <FormField
                                control={form.control}
                                name="parentId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs uppercase font-bold text-muted-foreground">{parentLabel}</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={`Select ${parentLabel.toLowerCase()}`} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {parentOptions.map((opt) => (
                                                    <SelectItem key={opt.id} value={opt.id}>{opt.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs uppercase font-bold text-muted-foreground">Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Brief description..." {...field} className="resize-none" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4 border-t">
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
