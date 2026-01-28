// Workflow guard resolver types and logic

export interface ActionConfig {
    visible: boolean;
    disabled: boolean;
    reason?: string;
    confirmModal?: {
        title: string;
        message: string;
    };
}

export interface RequestActions {
    clone: ActionConfig;
    editHeader: ActionConfig;
    editLines: ActionConfig;
    submit: ActionConfig;
    approve: ActionConfig;
    reject: ActionConfig;
    cancel: ActionConfig;
    reassign: ActionConfig;
    confirm: ActionConfig;
    reserve: ActionConfig;
    issue: ActionConfig;
    addComment: ActionConfig;
    manageReviewers: ActionConfig;
}

/**
 * Central workflow guard resolver for request actions.
 * Returns configuration for each action based on permissions, status, stage, and ownership.
 * 
 * @param request - The request object
 * @param user - The current user
 * @param permissions - Array of permission strings the user has
 */
export function getRequestActions(
    request: any,
    user: any,
    permissions: string[]
): RequestActions {
    const hasPermission = (perm: string) => permissions.includes(perm);
    const isOwner = request.requesterUserId === user.id;
    const isAdmin = hasPermission('requests.admin') || hasPermission('admin.all');
    const status = request.status?.code;
    const stage = request.currentStageType?.code;
    const isAssignedToMe = request.assignments?.some((a: any) => a.assignedToId === user.id && a.isActive);

    // Helper to create action config
    const action = (visible: boolean, disabled: boolean, reason?: string, confirmModal?: any): ActionConfig => ({
        visible,
        disabled,
        reason,
        confirmModal
    });

    return {
        clone: action(
            hasPermission('requests.clone'),
            false
        ),

        editHeader: action(
            hasPermission('requests.update'),
            !(isOwner || isAdmin) || !['DRAFT', 'REJECTED'].includes(status),
            !(isOwner || isAdmin) ? 'Only the requester can edit this request' :
                !['DRAFT', 'REJECTED'].includes(status) ? 'Request cannot be edited in current state' : undefined
        ),

        editLines: action(
            hasPermission('requests.lines.manage'),
            !(isOwner || isAdmin) || !['DRAFT', 'REJECTED'].includes(status),
            !(isOwner || isAdmin) ? 'Only the requester can manage lines' :
                !['DRAFT', 'REJECTED'].includes(status) ? 'Lines cannot be edited in current state' : undefined
        ),

        submit: action(
            hasPermission('requests.submit'),
            !isOwner || !['DRAFT', 'REJECTED'].includes(status),
            !isOwner ? 'Only the requester can submit' :
                !['DRAFT', 'REJECTED'].includes(status) ? 'Request is not in a submittable state' : undefined
        ),

        approve: action(
            hasPermission('requests.approve'),
            status !== 'IN_FLOW' || !isAssignedToMe,
            status !== 'IN_FLOW' ? 'Request is not in flow' :
                !isAssignedToMe ? 'You are not assigned to review/approve this request' : undefined
        ),

        reject: action(
            hasPermission('requests.reject'),
            status !== 'IN_FLOW' || !isAssignedToMe,
            status !== 'IN_FLOW' ? 'Request is not in flow' :
                !isAssignedToMe ? 'You are not assigned to review/reject this request' : undefined,
            {
                title: 'Reject Request',
                message: 'Please provide a reason for rejection. This will be sent back to the requester.'
            }
        ),

        cancel: action(
            hasPermission('requests.cancel'),
            !(isOwner || isAdmin) || ['CONFIRMED', 'CANCELLED'].includes(status),
            !(isOwner || isAdmin) ? 'Only the requester or admin can cancel' :
                ['CONFIRMED', 'CANCELLED'].includes(status) ? 'Request is in a terminal state' : undefined,
            {
                title: 'Cancel Request',
                message: 'Are you sure you want to cancel this request? This action cannot be undone.'
            }
        ),

        reassign: action(
            hasPermission('requests.reassign'),
            status !== 'IN_FLOW' || !(isAssignedToMe || isAdmin),
            status !== 'IN_FLOW' ? 'Request is not in flow' :
                !(isAssignedToMe || isAdmin) ? 'You cannot reassign this request' : undefined
        ),

        confirm: action(
            hasPermission('requests.confirm'),
            !isOwner || stage !== 'CONFIRMATION',
            !isOwner ? 'Only the requester can confirm receipt' :
                stage !== 'CONFIRMATION' ? 'Request is not awaiting confirmation' : undefined
        ),

        reserve: action(
            hasPermission('requests.reserve'),
            stage !== 'FULFILLMENT' || status !== 'IN_FLOW',
            stage !== 'FULFILLMENT' ? 'Request must be in fulfillment stage' :
                status !== 'IN_FLOW' ? 'Request is not in flow' : undefined
        ),

        issue: action(
            hasPermission('requests.issue'),
            stage !== 'FULFILLMENT' || status !== 'IN_FLOW',
            stage !== 'FULFILLMENT' ? 'Request must be in fulfillment stage' :
                status !== 'IN_FLOW' ? 'Request is not in flow' : undefined,
            {
                title: 'Issue Stock',
                message: 'This will deduct stock from inventory and move the request to confirmation. Continue?'
            }
        ),

        addComment: action(
            hasPermission('comments.create'),
            false
        ),
        manageReviewers: action(
            hasPermission('requests.reviewers.manage'),
            status !== 'IN_FLOW' || !request.assignments?.some((a: any) => a.assignmentType === 'POOL' && a.status === 'ACTIVE'),
            status !== 'IN_FLOW' ? 'Request is not in flow' :
                !request.assignments?.some((a: any) => a.assignmentType === 'POOL' && a.status === 'ACTIVE') ? 'No pool assignments pending manual selection' : undefined
        )
    };
}
