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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, UserPlus, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const userSchema = z.object({
    email: z.string().email("Invalid email address"),
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    departmentId: z.string().optional(),
    locationId: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters").optional(),
    roleIds: z.array(z.string()).optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function NewUserPage() {
    const router = useRouter();

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
            email: "",
            fullName: "",
            departmentId: "",
            locationId: "",
            password: "",
            roleIds: [],
        },
    });

    const mutation = useMutation({
        mutationFn: async (values: UserFormValues) => {
            const res = await api.post("/users", values);
            return res.data;
        },
        onSuccess: () => {
            toast.success("User created successfully!");
            router.push("/admin/users");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create user");
        },
    });

    const onSubmit = (values: UserFormValues) => {
        mutation.mutate(values);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <PageHeader
                title="Create New User"
                subtitle="Add a new member to the system and define their department and home location."
            />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
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

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="john@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="departmentId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Primary Department</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select department" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {departments.map((dept: any) => (
                                                        <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
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
                                            <FormLabel>Personal Location (optional)</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select store" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {stores.map((store: any) => (
                                                        <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
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
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Initial Password (optional)</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Leave blank for random" {...field} />
                                        </FormControl>
                                        <FormDescription>User will be forced to change this upon first login.</FormDescription>
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
                                    <UserPlus className="mr-2 h-4 w-4" />
                                )}
                                Create User
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    );
}

const FormDescription = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[11px] text-muted-foreground">{children}</p>
);
