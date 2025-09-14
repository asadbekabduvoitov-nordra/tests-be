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
exports.requireUser = void 0;
const supabase_1 = require("../configs/supabase");
const requireUser = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const telegramId = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id;
    if (!telegramId) {
        return ctx.scene.enter("auth");
    }
    const { data } = yield supabase_1.supabase
        .from("users")
        .select("*")
        .eq("telegram_id", telegramId)
        .limit(1)
        .single();
    if (!data) {
        yield ctx.reply("🔐 Ro'yxatdan o'tishingiz kerak.");
        return ctx.scene.enter("auth");
    }
    ctx.state.user = data;
    return next();
});
exports.requireUser = requireUser;
