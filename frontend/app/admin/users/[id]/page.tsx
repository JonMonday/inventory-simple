"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";

const userSchema = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    departmentId: z.string().optional(),
    locationId: z.string().optional(),
    isActive: z.boolean().optional(),
    roleIds: z.array(z.string()).optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function EditUserPage() {
    const router = useRouter();
    const { id } = useParams();
    const queryClient = useQueryClient();

    const { data: user, isLoading: userLoading } = useQuery({
        queryKey: ["user", id],
        queryFn: async () => {
            const res = await api.get(`/users/${id}`);
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

    const departments = locations?.filter((loc: any) => loc.type === 'DEPARTMENT') || [];
    const stores = locations?.filter((loc: any) => loc.type === 'STORE' || loc.type === 'WAREHOUSE') || [];

    const { data: roles } = useQuery({
        queryKey: ["roles"],
        queryFn: async () => {
            const res = await api.get("/users/roles");
            return res.data;
        },
    });

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            fullName: "",
            departmentId: "",
            locationId: "",
            isActive: true,
            roleIds: [],
        },
    });

    // Populate form when user data loads
    useEffect(() => {
        if (user) {
            form.reset({
                fullName: user.fullName || "",
                departmentId: user.departmentId || "",
                locationId: user.locationId || "",
                isActive: user.isActive ?? true,
                roleIds: user.roles?.map((r: any) => r.role.id) || [],
            });
        }
    }, [user, form]);

    const mutation = useMutation({
        mutationFn: async (values: UserFormValues) => {
            const res = await api.patch(`/users/${id}`, values);
            return res.data;
        },
        onSuccess: () => {
            toast.success("User updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["user", id] });
            router.push("/admin/users");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update user");
        },
    });

    const onSubmit = (values: UserFormValues) => {
        mutation.mutate(values);
    };

    if (userLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <PageHeader
                title={`Edit User: ${user.fullName}`}
                subtitle={user.email}
            />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Information</CardTitle>
                            <CardDescription>
                                Update user details, assignments, and roles.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="departmentId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Department</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value || undefined}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="No department assigned" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {departments.map((dept: any) => (
                                                        <SelectItem key={dept.id} value={dept.id}>
                                                            {dept.name}
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
                                    name="locationId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Home Location</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value || undefined}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="No location assigned" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {stores.map((loc: any) => (
                                                        <SelectItem key={loc.id} value={loc.id}>
                                                            {loc.name} ({loc.type})
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
                                name="roleIds"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Roles</FormLabel>
                                        <div className="grid grid-cols-2 gap-2">
                                            {roles?.map((role: any) => (
                                                <div key={role.id} className="flex items-center space-x-2 border rounded p-2 hover:bg-muted/50 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        id={role.id}
                                                        checked={field.value?.includes(role.id)}
                                                        onChange={(e) => {
                                                            const current = Array.isArray(field.value) ? field.value : [];
                                                            if (e.target.checked) {
                                                                field.onChange([...current, role.id]);
                                                            } else {
                                                                field.onChange(current.filter((id: string) => id !== role.id));
                                                            }
                                                        }}
                                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                    />
                                                    <label htmlFor={role.id} className="text-xs font-medium cursor-pointer">
                                                        {role.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between border rounded-lg p-4">
                                        <div>
                                            <FormLabel>Account Status</FormLabel>
                                            <p className="text-xs text-muted-foreground">
                                                {field.value ? "User can log in and access the system" : "User account is disabled"}
                                            </p>
                                        </div>
                                        <FormControl>
                                            <input
                                                type="checkbox"
                                                checked={field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="flex justify-between border-t p-6 bg-muted/50">
                            <Button variant="ghost" onClick={() => router.back()} type="button">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Save Changes
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    );
}
