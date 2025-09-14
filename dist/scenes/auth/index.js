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
exports.authScene = void 0;
const telegraf_1 = require("telegraf");
const texts_1 = require("./texts");
const supabase_1 = require("../../configs/supabase");
const main_menu_1 = require("../../keyboards/main.menu");
exports.authScene = new telegraf_1.Scenes.BaseScene("auth");
exports.authScene.enter((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const user = ctx.from;
    if (!user)
        return;
    const { data: existingUser, error: fetchError } = yield supabase_1.supabase
        .from("users")
        .select("id")
        .eq("telegram_id", user.id)
        .single();
    if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Failed to check user existence:", fetchError.message);
        return ctx.reply("Kechirasiz, tizimda xatolik yuz berdi.");
    }
    if (!existingUser) {
        const { error: insertError } = yield supabase_1.supabase.from("users").insert({
            first_name: String(user.first_name || ""),
            last_name: String(user.last_name || ""),
            phone_number: "",
            telegram_id: Number(user.id),
        });
        if (insertError) {
            console.error("User insert failed:", insertError.message);
            return ctx.reply("Ro'yxatdan o'tishda xatolik yuz berdi.");
        }
    }
    yield ctx.reply(`Assalomu alaykum, ${user.first_name}!`, main_menu_1.mainMenuKeyboard);
    yield ctx.reply(texts_1.messages.start, main_menu_1.mainMenuInlineKeyboard);
}));
