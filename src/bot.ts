import { Telegraf, Scenes, session, Markup } from "telegraf";
import dotenv from "dotenv";
import { authScene } from "./scenes/auth";
import { catch_error } from "./handlers/error.handler";
import {
	handleSubjectSelected,
	sendSubjectsPage,
} from "./handlers/subjects.handler";
import { handleQuizAccess } from "./handlers/quiz.handler";
import {
	handlePaymentApproval,
	handlePaymentCheckPhoto,
	handlePaymentRejection,
	handleUserBan,
	setupPaymentHandlers,
} from "./handlers/payment.handler";
import { checkIfBanned } from "./middlewares/check-ban.middleware";

dotenv.config();

const bot = new Telegraf<Scenes.SceneContext>(String(process.env.BOT_TOKEN));

// Setup stage (multi-scene support)
const stage = new Scenes.Stage<Scenes.SceneContext>([authScene]);

bot.use(session());
bot.use(stage.middleware());
bot.use(checkIfBanned);

// Entry command
bot.command("start", async (ctx) => ctx.scene.enter("auth"));

bot.catch(catch_error);

// When user clicks 📚 Mavjud Yo'nalishlar (inline button)
bot.action("choose_directions", async (ctx) => {
	await ctx.answerCbQuery();
	await sendSubjectsPage(ctx, 1);
});

// When user clicks 📞 Biz bilan bog'lanish (inline button)
bot.action("contact_us", async (ctx) => {
	await ctx.answerCbQuery(); // remove "loading" animation on button click
	await ctx.reply(
		"📞 Siz biz bilan bog‘lanishingiz mumkin:\n\n" +
		"👤 Admin: Mahkamova Anora\n" +
		"📱 Telefon raqam: +998 99 832 47 90\n" +
		"✈️ Telegram: @MahkamovaAnora\n\n" +
		"Agar savollaringiz bo‘lsa, bemalol murojaat qiling 😊"
	);
});

// Handle subject selection
bot.action(/^subject:(.*?)(:page:(\d+))?$/, async (ctx) => {
	const subjectMatch = ctx.match;
	const subjectId = subjectMatch[1];

	const page = subjectMatch[3] ? Number.parseInt(subjectMatch[3]) : 1;
	return await handleSubjectSelected(ctx, subjectId, page);
});

// Register the action handler for quiz access
bot.action(/quiz:(.+)/, async (ctx) => {
	const quizId = ctx.match[1];
	const telegramId = ctx.from?.id;

	await handleQuizAccess(ctx, quizId, telegramId);
});

// Payments
bot.action(/approve:(\d+)/, async (ctx) => {
	const telegramId = Number.parseInt(ctx.match[1], 10);
	await handlePaymentApproval(ctx, telegramId);
});

bot.action(/reject:(\d+)/, async (ctx) => {
	const telegramId = ctx.match[1];
	// @ts-ignore
	await handlePaymentRejection(ctx, telegramId);
});

bot.action(/block:(\d+)/, async (ctx) => {
	const telegramId = ctx.match[1];
	// @ts-ignore
	await handleUserBan(ctx, telegramId);
});

bot.action("send_payment_check", async (ctx) => {
	await setupPaymentHandlers(ctx);
});

// Handle "Mavjud Yo'nalishlar"
bot.hears("📚 Mavjud Yo'nalishlar", async (ctx) => {
	await sendSubjectsPage(ctx, 1);
});

// Handle "Biz bilan bog'lanish"
bot.hears("📞 Biz bilan bog'lanish", async (ctx) => {
	await ctx.reply(
		"📞 Siz biz bilan bog‘lanishingiz mumkin:\n\n" +
		"👤 Admin: Mahkamova Anora\n" +
		"📱 Telefon raqam: +998 99 832 47 90\n" +
		"✈️ Telegram: @MahkamovaAnora\n\n" +
		"Agar savollaringiz bo‘lsa, bemalol murojaat qiling 😊"
	);
});

bot.on("photo", handlePaymentCheckPhoto);

bot.on("message", (ctx) => {
	console.log("Chat ID:", ctx.chat.id);
});

export default bot;
