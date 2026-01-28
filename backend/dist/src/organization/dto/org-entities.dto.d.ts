export declare class CreateBranchDto {
    code: string;
    name: string;
}
export declare class UpdateBranchDto {
    name?: string;
}
export declare class CreateDepartmentDto {
    code: string;
    name: string;
    branchId: string;
    description?: string;
}
export declare class UpdateDepartmentDto {
    name?: string;
    description?: string;
    branchId?: string;
}
export declare class CreateUnitDto {
    code: string;
    name: string;
    departmentId: string;
    description?: string;
}
export declare class UpdateUnitDto {
    name?: string;
    description?: string;
    departmentId?: string;
}
export declare class CreateJobRoleDto {
    code: string;
    name: string;
    unitId: string;
    description?: string;
}
export declare class UpdateJobRoleDto {
    name?: string;
    description?: string;
    unitId?: string;
}
export declare class CreateStoreLocationDto {
    code: string;
    name: string;
    branchId: string;
}
export declare class UpdateStoreLocationDto {
    name?: string;
    branchId?: string;
}
