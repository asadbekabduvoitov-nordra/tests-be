import type { Context, MiddlewareFn } from "telegraf";
import { supabase } from "../configs/supabase";

export const checkIfBanned: MiddlewareFn<Context> = async (ctx, next) => {
	try {
		const telegramId = ctx.from?.id;

		if (!telegramId) return next(); // allow if telegramId not found

		// Fetch user info
		const { data, error } = await supabase
			.from("users")
			.select("status")
			.eq("telegram_id", telegramId)
			.single();

		if (data?.status === "BANNED") {
			return ctx.reply("🚫 Siz bloklangansiz va botdan foydalana olmaysiz.");
		}

		// User is not banned, continue processing
		return next();
	} catch (error) {
		console.error("Middleware checkIfBanned error:", error);
		return next();
	}
};
