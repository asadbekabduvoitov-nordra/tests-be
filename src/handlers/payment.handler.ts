import { Markup, type Context } from "telegraf";
import { supabase } from "../configs/supabase";
import type { Message } from "telegraf/types";
import { mainMenuInlineKeyboard } from "../keyboards/main.menu";

export async function handlePaymentApproval(ctx: Context, telegramId: number) {
	try {
		// 1. Fetch user
		const { data: user, error: userError } = await supabase
			.from("users")
			.select("id")
			.eq("telegram_id", telegramId)
			.single();

		if (userError || !user) {
			await ctx.reply(`❌ Foydalanuvchi ${telegramId} topilmadi.`);
			await ctx.answerCbQuery("Foydalanuvchi topilmadi.");
			return;
		}

		// 2. Insert or update permission
		const { error: permError } = await supabase
			.from("quiz_permissions")
			.insert({
				user_id: user.id,
				remaining_quiz_accesses: 3,
				status: "APPROVED",
			});

		if (permError) {
			console.error("Permission insert error:", permError);
			await ctx.reply(`❌ Foydalanuvchi ${telegramId} uchun ruxsat berilmadi.`);
			await ctx.answerCbQuery("Xatolik yuz berdi.");
			return;
		}

		// 3. Notify the user
		await ctx.telegram.sendMessage(
			telegramId,
			`✅ To'lovingiz tasdiqlandi. Sizga botdan foydalanish uchun ruxsat berildi.\n\n📌 Qolgan urinishlar soni: 3 ta.`,
			mainMenuInlineKeyboard,
		);

		// 4. Update admin group message
		// @ts-ignore
		const message = ctx.update?.callback_query?.message;
		if (message?.message_id && ctx.chat?.id) {
			await ctx.telegram.editMessageCaption(
				ctx.chat.id,
				message.message_id,
				undefined,
				`✅ Foydalanuvchi ${telegramId} to'lovi tasdiqlandi.`,
				{
					reply_markup: { inline_keyboard: [] }, // Remove buttons
				},
			);
		}

		// 5. Confirm in the group
		await ctx.reply(`✅ Foydalanuvchi ${telegramId} tasdiqlandi.`);
		await ctx.answerCbQuery("To'lov tasdiqlandi.");
	} catch (error) {
		console.error("Payment approval error:", error);
		await ctx.answerCbQuery("Xatolik yuz berdi.");
	}
}

export async function handlePaymentRejection(ctx: Context, telegramId: number) {
	try {
		// 1. Fetch user
		const { data: user, error: userError } = await supabase
			.from("users")
			.select("id")
			.eq("telegram_id", telegramId)
			.single();

		if (userError || !user) {
			await ctx.reply(`❌ Foydalanuvchi ${telegramId} topilmadi.`);
			await ctx.answerCbQuery("Foydalanuvchi topilmadi.");
			return;
		}

		// 2. Insert a new quiz permission with status REJECTED
		const { error: insertError } = await supabase
			.from("quiz_permissions")
			.insert({
				user_id: user.id,
				status: "REJECTED",
			});

		if (insertError) {
			console.error("Insert REJECTED quiz_permission error:", insertError);
			await ctx.reply("❌ Ruxsatnoma saqlanmadi.");
			await ctx.answerCbQuery("Xatolik yuz berdi.");
			return;
		}

		// 3. Notify the user
		await ctx.telegram.sendMessage(
			telegramId,
			`❌ To'lovingiz rad etildi. Iltimos, qaytadan urinib ko'ring.`,
		);

		// 4. Update admin group message
		// @ts-ignore
		const message = ctx.update?.callback_query?.message;
		if (message?.message_id && ctx.chat?.id) {
			await ctx.telegram.editMessageCaption(
				ctx.chat.id,
				message.message_id,
				undefined,
				`❌ Foydalanuvchi ${telegramId} to'lovi rad etildi.`,
				{
					reply_markup: { inline_keyboard: [] }, // Remove buttons
				},
			);
		}

		// 5. Confirm in the group
		await ctx.reply(`❌ Foydalanuvchi ${telegramId} rad etildi.`);
		await ctx.answerCbQuery("To'lov rad etildi.");
	} catch (error) {
		console.error("Payment rejection error:", error);
		await ctx.answerCbQuery("❌ Xatolik yuz berdi.");
	}
}

export async function handleUserBan(ctx: Context, telegramId: number) {
	try {
		// 1. Fetch user
		const { data: user, error: userError } = await supabase
			.from("users")
			.select("id")
			.eq("telegram_id", telegramId)
			.single();

		if (userError || !user) {
			await ctx.reply(`❌ Foydalanuvchi ${telegramId} topilmadi.`);
			await ctx.answerCbQuery("Foydalanuvchi topilmadi.");
			return;
		}

		// 2. Insert a new quiz permission with status REJECTED
		const { error: insertError } = await supabase
			.from("quiz_permissions")
			.insert({
				user_id: user.id,
				status: "BLOCKED",
			});

		if (insertError) {
			console.error("Insert REJECTED quiz_permission error:", insertError);
			await ctx.reply("❌ Ruxsatnoma saqlanmadi.");
			await ctx.answerCbQuery("Xatolik yuz berdi.");
			return;
		}

		// Also deactivate the user in the users table
		const { error: updateUserError } = await supabase
			.from("users")
			.update({ status: "BANNED" })
			.match({ telegram_id: telegramId });

		if (updateUserError) {
			console.error("Error updating user is_active status:", updateUserError);
		}

		// Update original message caption (if exists)
		const chatId = ctx.chat?.id;
		// @ts-ignore
		const messageId = ctx.update?.callback_query?.message?.message_id;

		if (chatId && messageId) {
			await ctx.telegram.editMessageCaption(
				chatId,
				messageId,
				undefined,
				`🚫 Foydalanuvchi ${telegramId} bloklandi.`,
				{
					reply_markup: { inline_keyboard: [] },
				},
			);
		}

		// Notify group/admins
		await ctx.reply(`🚫 Foydalanuvchi ${telegramId} bloklandi.`);

		// Notify the user
		await ctx.telegram.sendMessage(
			telegramId,
			"🚫 Siz bloklandingiz va botdan foydalana olmaysiz.",
		);

		await ctx.answerCbQuery("Foydalanuvchi bloklandi.");
	} catch (err) {
		console.error("User ban error:", err);
		await ctx.answerCbQuery("❌ Xatolik yuz berdi.");
	}
}

export async function setupPaymentHandlers(ctx: Context) {
	await ctx.answerCbQuery(); // dismiss loading on button

	await ctx.reply(
		"📸 Iltimos, to‘lov chek rasmini yuboring.",
		Markup.removeKeyboard(),
	);

	// Set session flag or save in DB to wait for image
	// @ts-ignore
	ctx.session = ctx.session || {};
	// @ts-ignore
	ctx.session.awaiting_payment_check = true;
}

export async function handlePaymentCheckPhoto(ctx: Context) {
	// @ts-ignore
	ctx.session = ctx.session || {};

	// @ts-ignore
	if (!ctx.session.awaiting_payment_check) return;

	console.log("📨 Chek yuborildi...");

	const photo = (ctx.message as Message.PhotoMessage).photo?.pop(); // Highest resolution
	if (!photo) return;

	const fileId = photo.file_id;
	const adminChatId = process.env.ADMIN_CHAT_ID;

	if (!adminChatId) {
		console.error("❌ ADMIN_CHAT_ID is not set in environment.");
		await ctx.reply(
			"❌ Admin sozlamalari to‘g‘ri emas. Keyinroq urinib ko‘ring.",
		);
		return;
	}

	try {
		await ctx.telegram.sendPhoto(adminChatId, fileId, {
			caption: `🧾 Yangi to‘lov chek:\n👤 ${ctx.from?.first_name} (${ctx.from?.id})`,
			reply_markup: {
				inline_keyboard: [
					[
						{ text: "✅ Tasdiqlash", callback_data: `approve:${ctx?.from?.id}` },
						{ text: "❌ Rad Etish", callback_data: `reject:${ctx?.from?.id}` },
						{ text: "🚫 Bloklash", callback_data: `block:${ctx?.from?.id}` },
					],
				],
			},
		});
		await ctx.reply("✅ Chek yuborildi. Admin tasdiqlashini kuting.");
	} catch (err) {
		console.error("❌ Rasm yuborishda xatolik:", err);
		await ctx.reply("❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko‘ring.");
	}

	// @ts-ignore
	ctx.session.awaiting_payment_check = false;
}
