import * as mongoose from 'mongoose';

const userRoleSchema = new mongoose.Schema({
    role: { type: String, default: 'User', alias: 'name'},
    isActive: { type: Boolean, default: true },
});

const UserRole = mongoose.model('userRole', userRoleSchema);

export default UserRole;