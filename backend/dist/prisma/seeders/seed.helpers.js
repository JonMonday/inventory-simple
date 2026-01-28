"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permsMap = exports.log = exports.upsertByEmail = exports.upsertByCode = exports.asCode = void 0;
exports.assert = assert;
const asCode = (val) => val.trim().toUpperCase().replace(/[^A-Z0-9]/g, '_');
exports.asCode = asCode;
const upsertByCode = async (delegate, code, data) => {
    return await delegate.upsert({
        where: { code },
        update: data,
        create: { ...data, code },
    });
};
exports.upsertByCode = upsertByCode;
const upsertByEmail = async (delegate, email, data) => {
    return await delegate.upsert({
        where: { email },
        update: data,
        create: { ...data, email },
    });
};
exports.upsertByEmail = upsertByEmail;
function assert(condition, message) {
    if (!condition) {
        throw new Error(`[SEED VALIDATION FAILED]: ${message}`);
    }
}
const log = (section, msg) => {
    console.log(`[${section}] ${msg}`);
};
exports.log = log;
const permsMap = (p) => {
    const [resource, action] = p.split('.');
    return { resource, action };
};
exports.permsMap = permsMap;
//# sourceMappingURL=seed.helpers.js.map