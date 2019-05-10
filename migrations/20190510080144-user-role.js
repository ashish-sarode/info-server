'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  db.createTable('userroles', {
    role: { type: String, unique: true, default: 'User' },
    isActive: { type: Boolean, default: true },
  });

  db.insert('userroles',[{role:"User",isActive:true},{role:"Admin",isActive:true}]);
  console.log('UserRoles is migrated and seeded successfully!');
  return true;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
/*
https://db-migrate.readthedocs.io/en/latest/
npm install -g db-migrate
npm install -g db-migrate-mongodb
db-migrate create user-role
db-migrate up -c 5
*/
