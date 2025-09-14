import { Scenes } from "telegraf";
import { messages } from "./texts";
import { supabase } from "../../configs/supabase";
import { mainMenuInlineKeyboard, mainMenuKeyboard } from "../../keyboards/main.menu";

export const authScene = new Scenes.BaseScene<Scenes.SceneContext>("auth");

authScene.enter(async (ctx) => {
	const user = ctx.from;
	if (!user) return;

	const { data: existingUser, error: fetchError } = await supabase
		.from("users")
		.select("id")
		.eq("telegram_id", user.id)
		.single();

	if (fetchError && fetchError.code !== "PGRST116") {
		console.error("Failed to check user existence:", fetchError.message);
		return ctx.reply("Kechirasiz, tizimda xatolik yuz berdi.");
	}

	if (!existingUser) {
		const { error: insertError } = await supabase.from("users").insert({
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

	await ctx.reply(`Assalomu alaykum, ${user.first_name}!`, mainMenuKeyboard);
	await ctx.reply(messages.start, mainMenuInlineKeyboard);
});
