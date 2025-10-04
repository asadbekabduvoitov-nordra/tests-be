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
exports.handleQuizAccess = handleQuizAccess;
const telegraf_1 = require("telegraf");
const supabase_1 = require("../configs/supabase");
const paymet_1 = require("../mock/paymet");
function handleQuizAccess(ctx, quizId, telegramId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data: user, error: userError } = yield supabase_1.supabase
                .from("users")
                .select("id")
                .eq("telegram_id", telegramId)
                .single();
            if (userError || !user) {
                yield ctx.reply("❌ Foydalanuvchi topilmadi.");
                return;
            }
            const { data: permission } = yield supabase_1.supabase
                .from("quiz_permissions")
                .select("*")
                .eq("user_id", user.id)
                .eq("status", "APPROVED")
                .gt("remaining_quiz_accesses", 0)
                .order("purchased_at", { ascending: false })
                .limit(1)
                .single();
            const card = (0, paymet_1.getRandomCard)();
            if (!permission) {
                yield ctx.reply(`❌ Sizda ushbu testni ishlash uchun ruxsat yo‘q.\n` +
                    `💸 Iltimos, 6,500 so‘m to‘lovni amalga oshiring va kvitansiyani yuboring.\n` +
                    `💳 To‘lov uchun karta raqami:\n\n` +
                    `<code>${card.card_number}</code>\n` +
                    `${card.card_holder}`, Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.inlineKeyboard([
                    [
                        telegraf_1.Markup.button.callback("📤 To'lov chekini yuborish", "send_payment_check"),
                    ],
                    [telegraf_1.Markup.button.callback("🔙 Ortga", "go_back")],
                ])));
                return;
            }
            yield supabase_1.supabase.from("quiz_permissions").update({
                remaining_quiz_accesses: permission.remaining_quiz_accesses - 1,
            }).eq("id", permission.id);
            yield ctx.reply(`✅ Siz ushbu testga kira oldingiz!\n`, telegraf_1.Markup.inlineKeyboard([
                [
                    telegraf_1.Markup.button.webApp("🚀 Testni boshlash", `https://oliy-maqsad.vercel.app/${telegramId}/${quizId}`),
                ],
            ]));
        }
        catch (error) {
            console.error("Quiz access error:", error);
            yield ctx.reply("⚠️ Xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.");
        }
    });
}
