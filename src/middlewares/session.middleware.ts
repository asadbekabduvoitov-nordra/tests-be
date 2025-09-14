import type { MiddlewareFn } from "telegraf";
import { supabase } from "../configs/supabase";

export const requireUser: MiddlewareFn<any> = async (ctx, next) => {
	const telegramId = ctx.from?.id;

	if (!telegramId) {
		return ctx.scene.enter("auth");
	}

	const { data } = await supabase
		.from("users")
		.select("*")
		.eq("telegram_id", telegramId)
		.limit(1)
		.single();

	if (!data) {
		await ctx.reply("🔐 Ro'yxatdan o'tishingiz kerak.");
		return ctx.scene.enter("auth");
	}

	ctx.state.user = data;
	return next();
};
