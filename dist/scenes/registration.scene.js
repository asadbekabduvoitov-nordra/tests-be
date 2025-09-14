"use strict";
// import { Scenes, Markup } from "telegraf";
// import type { TRegistration } from "../types/scenes/registration";
// import type { SceneBuilder } from "../types";
// export const authScene = new Scenes.BaseScene<
// 	Scenes.SceneContext<SceneBuilder<TRegistration>>
// >("auth");
// authScene.enter((ctx) => {
// 	ctx.reply(
// 		"👋 Assalomu alaykum, Asadbek! Testlarimizdan foydalanish uchun avval ro'yxatdan o'tishingiz kerak.",
// 	);
// 	ctx.reply("Iltimos, ismingizni kiriting:");
// });
// authScene.on("text", async (ctx) => {
// 	const state = ctx.scene.session;
// 	console.log(state, "state");
// 	// if (!state.step) {
// 	// 	state.step = "last_name";
// 	// 	state.firstName = ctx.message.text;
// 	// 	await ctx.reply(
// 	// 		`👍 Yaxshi, ${state?.firstName}! Endi familiyangizni kiriting:`,
// 	// 	);
// 	// } else if (state.step === "last_name") {
// 	// 	state.step = "phone";
// 	// 	state.lastName = ctx.message.text;
// 	// 	await ctx.reply(
// 	// 		"📱 Juda yaxshi! Endi telefon raqamingizni yuboring yoki kiriting. Namuna: +998901234567",
// 	// 		Markup.keyboard([
// 	// 			Markup.button.contactRequest("📲 Telefon Raqamni Yuborish"),
// 	// 		]).resize(),
// 	// 	);
// 	// } else {
// 	// 	await ctx.reply("Please use the phone share button.");
// 	// }
// });
// authScene.on("contact", async (ctx) => {
// 	const state = ctx.scene.session as any;
// 	state.phone = ctx.message.contact.phone_number;
// 	// Save or process user data here
// 	const fullName = `${state.firstName} ${state.lastName}`;
// 	await ctx.reply(
// 		`✅ Registered!\n👤 ${fullName}\n📞 ${state.phone}`,
// 		Markup.removeKeyboard(),
// 	);
// 	await ctx.scene.leave(); // End scene
// });
