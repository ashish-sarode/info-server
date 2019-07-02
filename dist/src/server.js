"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const PORT = app_1.default.get("port");
const ENV_MODE = app_1.default.get("mode");
const server = app_1.default.listen(PORT, () => {
    console.log(`API are successfully running on http://localhost:${PORT} in ${ENV_MODE} mode`);
});
exports.default = server;
//# sourceMappingURL=server.js.map