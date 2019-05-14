"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const userRoleSchema = new mongoose.Schema({
    role: { type: String, default: 'User', alias: 'name' },
    isActive: { type: Boolean, default: true },
});
const UserRole = mongoose.model('userRole', userRoleSchema);
exports.default = UserRole;
//# sourceMappingURL=UserRoleModel.js.map