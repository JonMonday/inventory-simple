import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Search, Plus, Edit, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface GenericEntity {
    id: string;
    name: string;
    code?: string;
    description?: string;
    isActive: boolean;
    [key: string]: any;
}

interface GenericCRUDListProps {
    title: string;
    data: GenericEntity[];
    loading: boolean;
    error: string | null;
    onRetry: () => void;
    onCreate?: () => void;
    onEdit?: (id: string) => void;
    onActivate?: (id: string) => void;
    onDeactivate?: (id: string) => void;
    canCreate?: boolean;
    canEdit?: boolean;
    canManage?: boolean;
    columns?: { key: string; label: string; render?: (item: GenericEntity) => React.ReactNode }[];
    emptyMessage?: string;
}

export function GenericCRUDList({
    title,
    data,
    loading,
    error,
    onRetry,
    onCreate,
    onEdit,
    onActivate,
    onDeactivate,
    canCreate = true,
    canEdit = true,
    canManage = true,
    columns,
    emptyMessage = "No records found"
}: GenericCRUDListProps) {
    const [search, setSearch] = useState("");
    const [showActiveOnly, setShowActiveOnly] = useState(false);

    const filtered = data.filter((item) => {
        const searchLower = search.toLowerCase();
        const matchesSearch =
            item.name?.toLowerCase().includes(searchLower) ||
            item.code?.toLowerCase().includes(searchLower) ||
            item.description?.toLowerCase().includes(searchLower);
        const matchesActive = !showActiveOnly || item.isActive;
        return matchesSearch && matchesActive;
    });

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
                <p className="text-lg font-semibold">Failed to load {title}</p>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button onClick={onRetry}>Retry</Button>
            </div>
        );
    }

    const defaultColumns = columns || [
        { key: 'code', label: 'Code', render: (item) => item.code ? <span className="font-mono text-xs">{item.code}</span> : '-' },
        { key: 'name', label: 'Name', render: (item) => <span className="font-medium">{item.name}</span> },
        { key: 'description', label: 'Description', render: (item) => <span className="text-sm text-muted-foreground">{item.description || 'No description'}</span> },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={`Search ${title.toLowerCase()}...`}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch
                            id="active-only"
                            checked={showActiveOnly}
                            onCheckedChange={setShowActiveOnly}
                        />
                        <Label htmlFor="active-only" className="text-sm cursor-pointer">
                            Active only
                        </Label>
                    </div>
                </div>
                {onCreate && canCreate && (
                    <Button onClick={onCreate}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create
                    </Button>
                )}
            </div>

            {filtered.length > 0 ? (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {defaultColumns.map((col) => (
                                    <TableHead key={col.key}>{col.label}</TableHead>
                                ))}
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((item) => (
                                <TableRow key={item.id}>
                                    {defaultColumns.map((col) => (
                                        <TableCell key={col.key}>
                                            {col.render ? col.render(item) : item[col.key]}
                                        </TableCell>
                                    ))}
                                    <TableCell>
                                        <Badge variant={item.isActive ? "default" : "outline"}>
                                            {item.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {onEdit && canEdit && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => onEdit(item.id)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            )}
                                            {canManage && (
                                                <>
                                                    {item.isActive && onDeactivate && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => onDeactivate(item.id)}
                                                            title="Deactivate"
                                                        >
                                                            <XCircle className="w-4 h-4 text-destructive" />
                                                        </Button>
                                                    )}
                                                    {!item.isActive && onActivate && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => onActivate(item.id)}
                                                            title="Activate"
                                                        >
                                                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            ) : (
                <Card className="bg-muted/30 border-dashed">
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <h3 className="text-lg font-semibold">No records found</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mt-1">
                            {search || showActiveOnly ? "No records match your filters." : emptyMessage}
                        </p>
                    </div>
                </Card>
            )}
        </div>
    );
}
