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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("./scenes/auth");
const error_handler_1 = require("./handlers/error.handler");
const subjects_handler_1 = require("./handlers/subjects.handler");
const quiz_handler_1 = require("./handlers/quiz.handler");
const payment_handler_1 = require("./handlers/payment.handler");
const check_ban_middleware_1 = require("./middlewares/check-ban.middleware");
dotenv_1.default.config();
const bot = new telegraf_1.Telegraf(String(process.env.BOT_TOKEN));
// Setup stage (multi-scene support)
const stage = new telegraf_1.Scenes.Stage([auth_1.authScene]);
bot.use((0, telegraf_1.session)());
bot.use(stage.middleware());
bot.use(check_ban_middleware_1.checkIfBanned);
// Entry command
bot.command("start", (ctx) => __awaiter(void 0, void 0, void 0, function* () { return ctx.scene.enter("auth"); }));
bot.command("yonalishlar", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, subjects_handler_1.sendSubjectsPage)(ctx, 1);
}));
bot.command("testhelp", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply(`🆘 Test Yordamchi Qo‘llanma

📚 Testlarni qanday boshlash mumkin?

1️⃣ Yo‘nalishlarni ko‘rish
👉 /yonalishlar tugmasini bosing.
Bu yerda siz turli fanlar va yo‘nalishlarni ko‘rasiz.

2️⃣ Yo‘nalish tanlash
Sizni qiziqtirgan yo‘nalishni tanlang.
Uning ichida mavjud testlar ro‘yxati chiqadi.

3️⃣ Testni boshlash
	•	Agar sizda ruxsat mavjud bo‘lsa → testni darhol boshlashingiz mumkin.
	•	Agar ruxsat mavjud bo‘lmasa → tizim sizdan to‘lovni amalga oshirishingizni so‘raydi.

4️⃣ Urinishlar soni
Har bir testda faqat 3 ta urinish mavjud. Shuning uchun har bir savolga e’tiborli bo‘ling!

⸻

💡 Eslatma: Savollar yoki muammolar yuzaga kelsa, menyudan 📞 Biz bilan bog‘lanish tugmasini tanlang.

Omad tilaymiz! 🚀`);
}));
bot.catch(error_handler_1.catch_error);
// When user clicks 📚 Mavjud Yo'nalishlar (inline button)
bot.action("choose_directions", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.answerCbQuery();
    yield (0, subjects_handler_1.sendSubjectsPage)(ctx, 1);
}));
// When user clicks 📞 Biz bilan bog'lanish (inline button)
bot.action("contact_us", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.answerCbQuery(); // remove "loading" animation on button click
    yield ctx.reply("📞 Siz biz bilan bog‘lanishingiz mumkin:\n\n" +
        "👤 Admin: Mahkamova Anora\n" +
        "📱 Telefon raqam: +998 99 832 47 90\n" +
        "✈️ Telegram: @MahkamovaAnora\n\n" +
        "Agar savollaringiz bo‘lsa, bemalol murojaat qiling 😊");
}));
// Handle subject selection
bot.action(/^subject:(.*?)(:page:(\d+))?$/, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const subjectMatch = ctx.match;
    const subjectId = subjectMatch[1];
    const page = subjectMatch[3] ? Number.parseInt(subjectMatch[3]) : 1;
    return yield (0, subjects_handler_1.handleSubjectSelected)(ctx, subjectId, page);
}));
// Register the action handler for quiz access
bot.action(/quiz:(.+)/, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const quizId = ctx.match[1];
    const telegramId = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id;
    yield (0, quiz_handler_1.handleQuizAccess)(ctx, quizId, telegramId);
}));
// Payments
bot.action(/approve:(\d+)/, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const telegramId = Number.parseInt(ctx.match[1], 10);
    yield (0, payment_handler_1.handlePaymentApproval)(ctx, telegramId);
}));
bot.action(/reject:(\d+)/, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const telegramId = ctx.match[1];
    // @ts-ignore
    yield (0, payment_handler_1.handlePaymentRejection)(ctx, telegramId);
}));
bot.action(/block:(\d+)/, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const telegramId = ctx.match[1];
    // @ts-ignore
    yield (0, payment_handler_1.handleUserBan)(ctx, telegramId);
}));
bot.action("send_payment_check", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, payment_handler_1.setupPaymentHandlers)(ctx);
}));
// Handle "Mavjud Yo'nalishlar"
bot.hears("📚 Mavjud Yo'nalishlar", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, subjects_handler_1.sendSubjectsPage)(ctx, 1);
}));
// Handle "Biz bilan bog'lanish"
bot.hears("📞 Biz bilan bog'lanish", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply("📞 Siz biz bilan bog‘lanishingiz mumkin:\n\n" +
        "👤 Admin: Mahkamova Anora\n" +
        "📱 Telefon raqam: +998 99 832 47 90\n" +
        "✈️ Telegram: @MahkamovaAnora\n\n" +
        "Agar savollaringiz bo‘lsa, bemalol murojaat qiling 😊");
}));
bot.on("photo", payment_handler_1.handlePaymentCheckPhoto);
bot.on("message", (ctx) => {
    console.log("Chat ID:", ctx.chat.id);
});
exports.default = bot;
