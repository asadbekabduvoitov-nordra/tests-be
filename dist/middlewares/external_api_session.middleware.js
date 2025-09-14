"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireExternalUser = void 0;
const supabase_1 = require("../configs/supabase");
const requireExternalUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const telegram_id = req.headers["telegram_id"];
    if (!telegram_id) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
    const { data } = yield supabase_1.supabase
        .from("users")
        .select("*")
        .eq("telegram_id", Number(telegram_id))
        .limit(1)
        .single();
    if (!data) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
    // @ts-ignore
    req.user = data;
    return next();
});
exports.requireExternalUser = requireExternalUser;
