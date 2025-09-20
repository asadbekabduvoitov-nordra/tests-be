import { Markup } from "telegraf";

export const mainMenuKeyboard = Markup.keyboard([
	["📚 Mavjud Yo'nalishlar"],
	["📞 Biz bilan bog'lanish"],
])
	.resize()
	.persistent();

export const mainMenuInlineKeyboard = Markup.inlineKeyboard([
	[Markup.button.callback("📚 Mavjud Yo'nalishlar", "choose_directions")],
	[Markup.button.callback("📞 Biz bilan bog'lanish", "contact_us")],
]);


