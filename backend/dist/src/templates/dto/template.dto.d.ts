export declare class WorkflowStageDto {
    stageTypeId: string;
    order: number;
    enabled?: boolean;
}
export declare class CreateTemplateDto {
    name: string;
    description?: string;
    stages: WorkflowStageDto[];
}
export declare class UpdateTemplateDto {
    name?: string;
    description?: string;
}
export declare class UpdateWorkflowStagesDto {
    stages: WorkflowStageDto[];
}
