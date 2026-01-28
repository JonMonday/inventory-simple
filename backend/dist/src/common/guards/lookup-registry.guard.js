"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LookupRegistryGuard = void 0;
const common_1 = require("@nestjs/common");
let LookupRegistryGuard = class LookupRegistryGuard {
    allowlist = [
        'request_statuses',
        'request_stage_types',
        'request_event_types',
        'comment_types',
        'participant_role_types',
        'ledger_movement_types',
        'stocktake_statuses',
        'item_statuses'
    ];
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const name = request.params.name;
        if (!name) {
            return true;
        }
        if (!this.allowlist.includes(name)) {
            throw new common_1.ForbiddenException(`Invalid lookup table name: ${name}. Access restricted to system registry.`);
        }
        return true;
    }
};
exports.LookupRegistryGuard = LookupRegistryGuard;
exports.LookupRegistryGuard = LookupRegistryGuard = __decorate([
    (0, common_1.Injectable)()
], LookupRegistryGuard);
//# sourceMappingURL=lookup-registry.guard.js.map