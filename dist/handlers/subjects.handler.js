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
exports.handleSubjectSelected = void 0;
exports.sendSubjectsPage = sendSubjectsPage;
// handlers/subjects.ts
const telegraf_1 = require("telegraf");
const supabase_1 = require("../configs/supabase");
const PAGE_SIZE = 5;
function sendSubjectsPage(ctx, page) {
    return __awaiter(this, void 0, void 0, function* () {
        const offset = (page - 1) * PAGE_SIZE;
        const { data: subjects, count, error, } = yield supabase_1.supabase
            .from("subjects")
            .select("*", { count: "exact" })
            .range(offset, offset + PAGE_SIZE - 1);
        if (error) {
            console.error("Failed to fetch subjects:", error);
            return ctx.reply("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
        }
        if (!subjects || subjects.length === 0) {
            return ctx.reply("Hozircha yo'nalishlar mavjud emas.");
        }
        const totalPages = Math.ceil((count || 0) / PAGE_SIZE);
        const buttons = subjects.map((subject) => [
            { text: subject.name, callback_data: `subject:${subject.id}` },
        ]);
        const navButtons = [];
        if (page > 1)
            navButtons.push({
                text: "⬅️ Orqaga",
                callback_data: `subjects_page_${page - 1}`,
            });
        if (page < totalPages)
            navButtons.push({
                text: "➡️ Keyingi",
                callback_data: `subjects_page_${page + 1}`,
            });
        if (navButtons.length > 0) {
            buttons.push(navButtons);
        }
        yield ctx.reply(`📚 Mavjud yo'nalishlar (sahifa ${page}/${totalPages})`, {
            reply_markup: {
                inline_keyboard: buttons,
            },
        });
    });
}
const handleSubjectSelected = (ctx_1, subjectId_1, ...args_1) => __awaiter(void 0, [ctx_1, subjectId_1, ...args_1], void 0, function* (ctx, subjectId, page = 1) {
    const offset = (page - 1) * PAGE_SIZE;
    const { data: quizzes, count } = yield supabase_1.supabase
        .from("quizzes")
        .select("*", { count: "exact" })
        .eq("subject_id", subjectId)
        .range(offset, offset + PAGE_SIZE - 1);
    if (!quizzes || quizzes.length === 0) {
        return ctx.reply("Ushbu fan bo'yicha testlar topilmadi.");
    }
    // Generate quiz buttons
    const buttons = quizzes.map((quiz) => [
        telegraf_1.Markup.button.callback(quiz.title, `quiz:${quiz.id}`),
    ]);
    // Pagination buttons
    const paginationRow = [];
    if (page > 1) {
        paginationRow.push(telegraf_1.Markup.button.callback("⬅️ Orqaga", `subject:${subjectId}:page:${page - 1}`));
    }
    if (offset + PAGE_SIZE < (count !== null && count !== void 0 ? count : 0)) {
        paginationRow.push(telegraf_1.Markup.button.callback("➡️ Keyingi", `subject:${subjectId}:page:${page + 1}`));
    }
    if (paginationRow.length)
        buttons.push(paginationRow);
    yield ctx.editMessageText("Testlardan birini tanlang:", telegraf_1.Markup.inlineKeyboard(buttons));
});
exports.handleSubjectSelected = handleSubjectSelected;
