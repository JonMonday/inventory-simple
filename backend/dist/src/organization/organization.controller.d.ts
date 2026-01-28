import { OrganizationService } from './organization.service';
import { CreateBranchDto, CreateDepartmentDto, CreateJobRoleDto, CreateStoreLocationDto, CreateUnitDto, UpdateBranchDto, UpdateDepartmentDto, UpdateJobRoleDto, UpdateStoreLocationDto, UpdateUnitDto } from './dto/org-entities.dto';
import { CreateCategoryDto, CreateReasonCodeDto, UpdateCategoryDto, UpdateReasonCodeDto } from './dto/catalog-entities.dto';
export declare class OrganizationController {
    private readonly orgService;
    constructor(orgService: OrganizationService);
    getBranches(): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
    }[]>;
    getBranch(id: string): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
    }>;
    createBranch(dto: CreateBranchDto): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
    }>;
    updateBranch(id: string, dto: UpdateBranchDto): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
    }>;
    activateBranch(id: string): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
    }>;
    deactivateBranch(id: string): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
    }>;
    getDepartments(branchId?: string): Promise<({
        branch: {
            id: string;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
        };
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        branchId: string;
    })[]>;
    getDepartment(id: string): Promise<{
        branch: {
            id: string;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
        };
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        branchId: string;
    }>;
    createDepartment(dto: CreateDepartmentDto): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        branchId: string;
    }>;
    updateDepartment(id: string, dto: UpdateDepartmentDto): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        branchId: string;
    }>;
    activateDepartment(id: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        branchId: string;
    }>;
    deactivateDepartment(id: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        branchId: string;
    }>;
    getUnits(departmentId?: string): Promise<({
        department: {
            id: string;
            description: string | null;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
            updatedAt: Date;
            branchId: string;
        };
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        departmentId: string;
    })[]>;
    getUnit(id: string): Promise<{
        department: {
            id: string;
            description: string | null;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
            updatedAt: Date;
            branchId: string;
        };
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        departmentId: string;
    }>;
    createUnit(dto: CreateUnitDto): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        departmentId: string;
    }>;
    updateUnit(id: string, dto: UpdateUnitDto): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        departmentId: string;
    }>;
    activateUnit(id: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        departmentId: string;
    }>;
    deactivateUnit(id: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        departmentId: string;
    }>;
    getJobRoles(unitId?: string): Promise<({
        unit: {
            id: string;
            description: string | null;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
            updatedAt: Date;
            departmentId: string;
        };
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        unitId: string;
    })[]>;
    getJobRole(id: string): Promise<{
        unit: {
            id: string;
            description: string | null;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
            updatedAt: Date;
            departmentId: string;
        };
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        unitId: string;
    }>;
    createJobRole(dto: CreateJobRoleDto): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        unitId: string;
    }>;
    updateJobRole(id: string, dto: UpdateJobRoleDto): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        unitId: string;
    }>;
    activateJobRole(id: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        unitId: string;
    }>;
    deactivateJobRole(id: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        unitId: string;
    }>;
    getStoreLocations(): Promise<({
        branch: {
            id: string;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
        };
    } & {
        id: string;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        branchId: string;
    })[]>;
    getStoreLocation(id: string): Promise<{
        branch: {
            id: string;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
        };
    } & {
        id: string;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        branchId: string;
    }>;
    createStoreLocation(dto: CreateStoreLocationDto): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        branchId: string;
    }>;
    updateStoreLocation(id: string, dto: UpdateStoreLocationDto): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        branchId: string;
    }>;
    activateStoreLocation(id: string): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        branchId: string;
    }>;
    deactivateStoreLocation(id: string): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        branchId: string;
    }>;
    getCategories(): Promise<({
        parentCategory: {
            id: string;
            description: string | null;
            createdAt: Date;
            isActive: boolean;
            name: string;
            updatedAt: Date;
            parentCategoryId: string | null;
        } | null;
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        updatedAt: Date;
        parentCategoryId: string | null;
    })[]>;
    getCategory(id: string): Promise<{
        parentCategory: {
            id: string;
            description: string | null;
            createdAt: Date;
            isActive: boolean;
            name: string;
            updatedAt: Date;
            parentCategoryId: string | null;
        } | null;
        childCategories: {
            id: string;
            description: string | null;
            createdAt: Date;
            isActive: boolean;
            name: string;
            updatedAt: Date;
            parentCategoryId: string | null;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        updatedAt: Date;
        parentCategoryId: string | null;
    }>;
    createCategory(dto: CreateCategoryDto): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        updatedAt: Date;
        parentCategoryId: string | null;
    }>;
    updateCategory(id: string, dto: UpdateCategoryDto): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        updatedAt: Date;
        parentCategoryId: string | null;
    }>;
    activateCategory(id: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        updatedAt: Date;
        parentCategoryId: string | null;
    }>;
    deactivateCategory(id: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        updatedAt: Date;
        parentCategoryId: string | null;
    }>;
    getReasonCodes(): Promise<{
        label: string | null;
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        requiresFreeText: boolean;
        requiresApproval: boolean;
        approvalThreshold: number | null;
    }[]>;
    getReasonCode(id: string): Promise<{
        label: string | null;
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        requiresFreeText: boolean;
        requiresApproval: boolean;
        approvalThreshold: number | null;
    }>;
    createReasonCode(dto: CreateReasonCodeDto): Promise<{
        label: string | null;
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        requiresFreeText: boolean;
        requiresApproval: boolean;
        approvalThreshold: number | null;
    }>;
    updateReasonCode(id: string, dto: UpdateReasonCodeDto): Promise<{
        label: string | null;
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        requiresFreeText: boolean;
        requiresApproval: boolean;
        approvalThreshold: number | null;
    }>;
    activateReasonCode(id: string): Promise<{
        label: string | null;
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        requiresFreeText: boolean;
        requiresApproval: boolean;
        approvalThreshold: number | null;
    }>;
    deactivateReasonCode(id: string): Promise<{
        label: string | null;
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        requiresFreeText: boolean;
        requiresApproval: boolean;
        approvalThreshold: number | null;
    }>;
}
