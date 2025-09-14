import type { Context } from "telegraf";
import { Markup } from "telegraf";
import { supabase } from "../configs/supabase";

export async function handleQuizAccess(
	ctx: Context,
	quizId: string,
	telegramId: number,
) {
	try {
		const { data: user, error: userError } = await supabase
			.from("users")
			.select("id")
			.eq("telegram_id", telegramId)
			.single();

		if (userError || !user) {
			await ctx.reply("❌ Foydalanuvchi topilmadi.");
			return;
		}

		const { data: permission } = await supabase
			.from("quiz_permissions")
			.select("*")
			.eq("user_id", user.id)
			.eq("status", "APPROVED")
			.gt("remaining_quiz_accesses", 0)
			.order("purchased_at", { ascending: false })
			.limit(1)
			.single();

		if (!permission) {
			await ctx.reply(
				"❌ Sizda ushbu testni ishlash uchun ruxsat yo‘q. 💸 Iltimos, 6,500 so‘m to‘lovni amalga oshiring va kvitansiyani yuboring. 💳 To‘lov uchun karta raqami: 8600 1234 5678 9012  ",
				Markup.inlineKeyboard([
					[
						Markup.button.callback(
							"📤 To'lov chekini yuborish",
							"send_payment_check",
						),
					],
					[Markup.button.callback("🔙 Ortga", "go_back")],
				]),
			);
			return;
		}

		await supabase.from("quiz_permissions").update({
			remaining_quiz_accesses: permission.remaining_quiz_accesses - 1,
		}).eq("id", permission.id);

		await ctx.reply(
			`✅ Siz ushbu testga kira oldingiz!\n🧾 Quiz ID: ${quizId}`,
			Markup.inlineKeyboard([
				[
					Markup.button.webApp(
						"🚀 Testni boshlash",
						`https://oliy-maqsad.vercel.app/${telegramId}/${quizId}`,
					),
				],
			]),
		);
	} catch (error) {
		console.error("Quiz access error:", error);
		await ctx.reply("⚠️ Xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.");
	}
}
