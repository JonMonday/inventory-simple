"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RBACService } from "@/services/rbac.service";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Plus, Edit, UserCircle, AlertCircle } from "lucide-react";

export default function UsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await RBACService.getUsers();
                setUsers(data);
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to load users");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filtered = users.filter((user) => {
        const searchLower = search.toLowerCase();
        return (
            user.fullName?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower) ||
            user.username?.toLowerCase().includes(searchLower)
        );
    });

    const retry = () => {
        setError(null);
        setLoading(true);
        window.location.reload();
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <p className="text-lg font-semibold">Failed to load users</p>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button onClick={retry}>Retry</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Users"
                    subtitle="Manage system users and access."
                />
                <Button onClick={() => router.push('/admin/rbac/users/new')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create User
                </Button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {filtered.length > 0 ? (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Roles</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <UserCircle className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{user.fullName}</p>
                                                <p className="text-xs text-muted-foreground">@{user.username}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">{user.email}</TableCell>
                                    <TableCell className="text-sm">{user.department?.name || 'N/A'}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles?.slice(0, 2).map((role: any) => (
                                                <Badge key={role.id} variant="outline" className="text-xs">
                                                    {role.name}
                                                </Badge>
                                            ))}
                                            {user.roles?.length > 2 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{user.roles.length - 2}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => router.push(`/admin/rbac/users/${user.id}`)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            ) : (
                <Card className="bg-muted/30 border-dashed">
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <h3 className="text-lg font-semibold">No users found</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mt-1">
                            {search ? "No users match your search criteria." : "No users have been created yet."}
                        </p>
                    </div>
                </Card>
            )}
        </div>
    );
}
