"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
exports.db = promise_1.default.createPool({
    host: "167.235.222.200",
    user: "rakhmat1_asadbek",
    password: "Asadbek_995321025",
    database: "rakhmat1_oliy_maqsad",
    port: 3306,
});
