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
exports.handlePaymentApproval = handlePaymentApproval;
exports.handlePaymentRejection = handlePaymentRejection;
exports.handleUserBan = handleUserBan;
exports.setupPaymentHandlers = setupPaymentHandlers;
exports.handlePaymentCheckPhoto = handlePaymentCheckPhoto;
const telegraf_1 = require("telegraf");
const supabase_1 = require("../configs/supabase");
const main_menu_1 = require("../keyboards/main.menu");
function handlePaymentApproval(ctx, telegramId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            // 1. Fetch user
            const { data: user, error: userError } = yield supabase_1.supabase
                .from("users")
                .select("id")
                .eq("telegram_id", telegramId)
                .single();
            if (userError || !user) {
                yield ctx.reply(`❌ Foydalanuvchi ${telegramId} topilmadi.`);
                yield ctx.answerCbQuery("Foydalanuvchi topilmadi.");
                return;
            }
            // 2. Insert or update permission
            const { error: permError } = yield supabase_1.supabase
                .from("quiz_permissions")
                .insert({
                user_id: user.id,
                remaining_quiz_accesses: 3,
                status: "APPROVED",
            });
            if (permError) {
                console.error("Permission insert error:", permError);
                yield ctx.reply(`❌ Foydalanuvchi ${telegramId} uchun ruxsat berilmadi.`);
                yield ctx.answerCbQuery("Xatolik yuz berdi.");
                return;
            }
            // 3. Notify the user
            yield ctx.telegram.sendMessage(telegramId, `✅ To'lovingiz tasdiqlandi. Sizga botdan foydalanish uchun ruxsat berildi.\n\n📌 Qolgan urinishlar soni: 3 ta.`, main_menu_1.mainMenuInlineKeyboard);
            // 4. Update admin group message
            // @ts-ignore
            const message = (_b = (_a = ctx.update) === null || _a === void 0 ? void 0 : _a.callback_query) === null || _b === void 0 ? void 0 : _b.message;
            if ((message === null || message === void 0 ? void 0 : message.message_id) && ((_c = ctx.chat) === null || _c === void 0 ? void 0 : _c.id)) {
                yield ctx.telegram.editMessageCaption(ctx.chat.id, message.message_id, undefined, `✅ Foydalanuvchi ${telegramId} to'lovi tasdiqlandi.`, {
                    reply_markup: { inline_keyboard: [] }, // Remove buttons
                });
            }
            // 5. Confirm in the group
            yield ctx.reply(`✅ Foydalanuvchi ${telegramId} tasdiqlandi.`);
            yield ctx.answerCbQuery("To'lov tasdiqlandi.");
        }
        catch (error) {
            console.error("Payment approval error:", error);
            yield ctx.answerCbQuery("Xatolik yuz berdi.");
        }
    });
}
function handlePaymentRejection(ctx, telegramId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            // 1. Fetch user
            const { data: user, error: userError } = yield supabase_1.supabase
                .from("users")
                .select("id")
                .eq("telegram_id", telegramId)
                .single();
            if (userError || !user) {
                yield ctx.reply(`❌ Foydalanuvchi ${telegramId} topilmadi.`);
                yield ctx.answerCbQuery("Foydalanuvchi topilmadi.");
                return;
            }
            // 2. Insert a new quiz permission with status REJECTED
            const { error: insertError } = yield supabase_1.supabase
                .from("quiz_permissions")
                .insert({
                user_id: user.id,
                status: "REJECTED",
            });
            if (insertError) {
                console.error("Insert REJECTED quiz_permission error:", insertError);
                yield ctx.reply("❌ Ruxsatnoma saqlanmadi.");
                yield ctx.answerCbQuery("Xatolik yuz berdi.");
                return;
            }
            // 3. Notify the user
            yield ctx.telegram.sendMessage(telegramId, `❌ To'lovingiz rad etildi. Iltimos, qaytadan urinib ko'ring.`);
            // 4. Update admin group message
            // @ts-ignore
            const message = (_b = (_a = ctx.update) === null || _a === void 0 ? void 0 : _a.callback_query) === null || _b === void 0 ? void 0 : _b.message;
            if ((message === null || message === void 0 ? void 0 : message.message_id) && ((_c = ctx.chat) === null || _c === void 0 ? void 0 : _c.id)) {
                yield ctx.telegram.editMessageCaption(ctx.chat.id, message.message_id, undefined, `❌ Foydalanuvchi ${telegramId} to'lovi rad etildi.`, {
                    reply_markup: { inline_keyboard: [] }, // Remove buttons
                });
            }
            // 5. Confirm in the group
            yield ctx.reply(`❌ Foydalanuvchi ${telegramId} rad etildi.`);
            yield ctx.answerCbQuery("To'lov rad etildi.");
        }
        catch (error) {
            console.error("Payment rejection error:", error);
            yield ctx.answerCbQuery("❌ Xatolik yuz berdi.");
        }
    });
}
function handleUserBan(ctx, telegramId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            // 1. Fetch user
            const { data: user, error: userError } = yield supabase_1.supabase
                .from("users")
                .select("id")
                .eq("telegram_id", telegramId)
                .single();
            if (userError || !user) {
                yield ctx.reply(`❌ Foydalanuvchi ${telegramId} topilmadi.`);
                yield ctx.answerCbQuery("Foydalanuvchi topilmadi.");
                return;
            }
            // 2. Insert a new quiz permission with status REJECTED
            const { error: insertError } = yield supabase_1.supabase
                .from("quiz_permissions")
                .insert({
                user_id: user.id,
                status: "BLOCKED",
            });
            if (insertError) {
                console.error("Insert REJECTED quiz_permission error:", insertError);
                yield ctx.reply("❌ Ruxsatnoma saqlanmadi.");
                yield ctx.answerCbQuery("Xatolik yuz berdi.");
                return;
            }
            // Also deactivate the user in the users table
            const { error: updateUserError } = yield supabase_1.supabase
                .from("users")
                .update({ status: "BANNED" })
                .match({ telegram_id: telegramId });
            if (updateUserError) {
                console.error("Error updating user is_active status:", updateUserError);
            }
            // Update original message caption (if exists)
            const chatId = (_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id;
            // @ts-ignore
            const messageId = (_d = (_c = (_b = ctx.update) === null || _b === void 0 ? void 0 : _b.callback_query) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.message_id;
            if (chatId && messageId) {
                yield ctx.telegram.editMessageCaption(chatId, messageId, undefined, `🚫 Foydalanuvchi ${telegramId} bloklandi.`, {
                    reply_markup: { inline_keyboard: [] },
                });
            }
            // Notify group/admins
            yield ctx.reply(`🚫 Foydalanuvchi ${telegramId} bloklandi.`);
            // Notify the user
            yield ctx.telegram.sendMessage(telegramId, "🚫 Siz bloklandingiz va botdan foydalana olmaysiz.");
            yield ctx.answerCbQuery("Foydalanuvchi bloklandi.");
        }
        catch (err) {
            console.error("User ban error:", err);
            yield ctx.answerCbQuery("❌ Xatolik yuz berdi.");
        }
    });
}
function setupPaymentHandlers(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ctx.answerCbQuery(); // dismiss loading on button
        yield ctx.reply("📸 Iltimos, to‘lov chek rasmini yuboring.", telegraf_1.Markup.removeKeyboard());
        // Set session flag or save in DB to wait for image
        // @ts-ignore
        ctx.session = ctx.session || {};
        // @ts-ignore
        ctx.session.awaiting_payment_check = true;
    });
}
function handlePaymentCheckPhoto(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        // @ts-ignore
        ctx.session = ctx.session || {};
        // @ts-ignore
        if (!ctx.session.awaiting_payment_check)
            return;
        console.log("📨 Chek yuborildi...");
        const photo = (_a = ctx.message.photo) === null || _a === void 0 ? void 0 : _a.pop(); // Highest resolution
        if (!photo)
            return;
        const fileId = photo.file_id;
        const adminChatId = process.env.ADMIN_CHAT_ID;
        if (!adminChatId) {
            console.error("❌ ADMIN_CHAT_ID is not set in environment.");
            yield ctx.reply("❌ Admin sozlamalari to‘g‘ri emas. Keyinroq urinib ko‘ring.");
            return;
        }
        try {
            yield ctx.telegram.sendPhoto(Number(`-${adminChatId}`), fileId, {
                caption: `🧾 Yangi to‘lov chek:\n👤 ${(_b = ctx.from) === null || _b === void 0 ? void 0 : _b.first_name} (${(_c = ctx.from) === null || _c === void 0 ? void 0 : _c.id})`,
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "✅ Tasdiqlash", callback_data: `approve:${(_d = ctx === null || ctx === void 0 ? void 0 : ctx.from) === null || _d === void 0 ? void 0 : _d.id}` },
                            { text: "❌ Rad Etish", callback_data: `reject:${(_e = ctx === null || ctx === void 0 ? void 0 : ctx.from) === null || _e === void 0 ? void 0 : _e.id}` },
                            { text: "🚫 Bloklash", callback_data: `block:${(_f = ctx === null || ctx === void 0 ? void 0 : ctx.from) === null || _f === void 0 ? void 0 : _f.id}` },
                        ],
                    ],
                },
            });
            yield ctx.reply("✅ Chek yuborildi. Admin tasdiqlashini kuting.");
        }
        catch (err) {
            console.error("❌ Rasm yuborishda xatolik:", err);
            yield ctx.reply(`❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko‘ring. ${JSON.stringify(err)}`);
        }
        // @ts-ignore
        ctx.session.awaiting_payment_check = false;
    });
}
