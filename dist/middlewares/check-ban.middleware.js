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
exports.checkIfBanned = void 0;
const supabase_1 = require("../configs/supabase");
const checkIfBanned = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const telegramId = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id;
        if (!telegramId)
            return next(); // allow if telegramId not found
        // Fetch user info
        const { data, error } = yield supabase_1.supabase
            .from("users")
            .select("status")
            .eq("telegram_id", telegramId)
            .single();
        if ((data === null || data === void 0 ? void 0 : data.status) === "BANNED") {
            return ctx.reply("🚫 Siz bloklangansiz va botdan foydalana olmaysiz.");
        }
        // User is not banned, continue processing
        return next();
    }
    catch (error) {
        console.error("Middleware checkIfBanned error:", error);
        return next();
    }
});
exports.checkIfBanned = checkIfBanned;
