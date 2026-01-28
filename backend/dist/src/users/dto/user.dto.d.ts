export declare class CreateUserDto {
    email: string;
    fullName: string;
    username: string;
    password: string;
    departmentId?: string;
    unitId?: string;
    jobRoleId?: string;
}
export declare class UpdateUserDto {
    fullName?: string;
    email?: string;
    departmentId?: string;
    unitId?: string;
    jobRoleId?: string;
}
export declare class AssignRoleDto {
    roleId: string;
}
export declare class CreateRoleDto {
    name: string;
    description?: string;
}
export declare class UpdateRoleDto {
    name?: string;
    description?: string;
}
export declare class AssignPermissionDto {
    permissionId: string;
}
