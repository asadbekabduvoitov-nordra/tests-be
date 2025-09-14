import type { TLang } from "../types/scenes/auth";
import type { SceneContext, SceneSessionData } from "telegraf/typings/scenes";

export const catch_error = async (
	err: unknown,
	ctx: SceneContext<SceneSessionData>,
) => {
	console.error("Error occurred:", err);

	const lang = (ctx.state?.language_code || "uz") as TLang;

	const apologyMessages = {
		uz: "❌ Kechirasiz, kutilmagan xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.",
		ru: "❌ Извините, произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.",
		en: "❌ Sorry, an unexpected error occurred. Please try again later.",
	};

	try {
		await ctx.reply(apologyMessages[lang]);
	} catch (e) {
		console.error("Failed to send error message to user:", e);
	}
};
