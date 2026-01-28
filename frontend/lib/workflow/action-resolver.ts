import { AggregateRequest } from '@/hooks/use-request';

export interface ActionState {
    enabled: boolean;
    visible: boolean;
    reason?: string;
}

export interface RequestActions {
    manageLines: ActionState;
    submit: ActionState;
    approve: ActionState;
    reject: ActionState;
    cancel: ActionState;
    reassign: ActionState;
    reserve: ActionState;
    issue: ActionState;
    confirm: ActionState;
}

/**
 * Resolves availability and state for all primary request actions.
 * Respects EditorialState, Ownership (with Admin override), and Eligibility (Assignment + Stage).
 */
export const getRequestActions = (
    request: AggregateRequest | null,
    user: { id: string; email: string } | null,
    permissions: string[]
): RequestActions | null => {
    if (!request || !user) return null;

    const status = request.status.code;
    const stage = request.currentStageType?.code;
    const isSuperAdmin = permissions.includes('super_admin') || user.email === 'superadmin@gra.local';
    const isOwner = request.requesterUserId === user.id;

    // Eligibility logic
    const activeAssignment = request.assignments.find(a => a.isActive);
    const isAssigned = activeAssignment?.assignedToId === user.id;

    const hasPerm = (p: string) => isSuperAdmin || permissions.includes(p);

    return {
        // EditableStateGuard: Only DRAFT/REJECTED
        manageLines: {
            enabled: ['DRAFT', 'REJECTED'].includes(status),
            visible: true,
            reason: !['DRAFT', 'REJECTED'].includes(status) ? "Request is no longer editable." : undefined
        },

        // EligibilityGuard & Ownership: Submit
        submit: {
            enabled: ['DRAFT', 'REJECTED'].includes(status) && isOwner && request.lines.length > 0,
            visible: ['DRAFT', 'REJECTED'].includes(status),
            reason: !isOwner ? "Only the requester can submit." : request.lines.length === 0 ? "Add items before submitting." : undefined
        },

        // EligibilityGuard: Approve/Reject (Not in fulfillment/confirmation)
        approve: {
            enabled: status === 'IN_FLOW' && isAssigned && !['FULFILLMENT', 'CONFIRMATION'].includes(stage || ''),
            visible: status === 'IN_FLOW' && !['FULFILLMENT', 'CONFIRMATION'].includes(stage || ''),
            reason: !isAssigned ? "Not assigned to you." : undefined
        },

        reject: {
            enabled: status === 'IN_FLOW' && isAssigned && !['FULFILLMENT', 'CONFIRMATION'].includes(stage || ''),
            visible: status === 'IN_FLOW' && !['FULFILLMENT', 'CONFIRMATION'].includes(stage || '')
        },

        // OwnershipGuard: Cancel (SuperAdmin override)
        cancel: {
            enabled: (isOwner || isSuperAdmin) && !['CANCELLED', 'CONFIRMED', 'FULFILLED'].includes(status),
            visible: !['CANCELLED', 'CONFIRMED', 'FULFILLED'].includes(status),
            reason: !(isOwner || isSuperAdmin) ? "Only the owner can cancel." : undefined
        },

        // OwnershipGuard: Reassign (SuperAdmin override)
        reassign: {
            enabled: (isOwner || isSuperAdmin) && status === 'IN_FLOW',
            visible: status === 'IN_FLOW'
        },

        // EligibilityGuard: Reserve (Stage FULFILLMENT + Assigned + Perm)
        reserve: {
            enabled: stage === 'FULFILLMENT' && isAssigned && hasPerm('requests.reserve'),
            visible: stage === 'FULFILLMENT'
        },

        // EligibilityGuard: Issue (Stage FULFILLMENT + Assigned + Perm)
        issue: {
            enabled: stage === 'FULFILLMENT' && isAssigned && hasPerm('requests.issue'),
            visible: stage === 'FULFILLMENT'
        },

        // OwnershipGuard: Confirm (Stage CONFIRMATION + Owner/Admin)
        confirm: {
            enabled: stage === 'CONFIRMATION' && (isOwner || isSuperAdmin),
            visible: stage === 'CONFIRMATION'
        }
    };
};
