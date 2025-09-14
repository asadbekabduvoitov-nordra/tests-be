// handlers/subjects.ts
import { Markup, type Context } from "telegraf";
import { supabase } from "../configs/supabase";

const PAGE_SIZE = 5;

export async function sendSubjectsPage(ctx: Context, page: number) {
	const offset = (page - 1) * PAGE_SIZE;

	const {
		data: subjects,
		count,
		error,
	} = await supabase
		.from("subjects")
		.select("*", { count: "exact" })
		.range(offset, offset + PAGE_SIZE - 1);

	if (error) {
		console.error("Failed to fetch subjects:", error);
		return ctx.reply("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
	}

	if (!subjects || subjects.length === 0) {
		return ctx.reply("Hozircha yo'nalishlar mavjud emas.");
	}

	const totalPages = Math.ceil((count || 0) / PAGE_SIZE);

	const buttons = subjects.map((subject) => [
		{ text: subject.name, callback_data: `subject:${subject.id}` },
	]);

	const navButtons = [];
	if (page > 1)
		navButtons.push({
			text: "⬅️ Orqaga",
			callback_data: `subjects_page_${page - 1}`,
		});
	if (page < totalPages)
		navButtons.push({
			text: "➡️ Keyingi",
			callback_data: `subjects_page_${page + 1}`,
		});

	if (navButtons.length > 0) {
		buttons.push(navButtons);
	}

	await ctx.reply(`📚 Mavjud yo'nalishlar (sahifa ${page}/${totalPages})`, {
		reply_markup: {
			inline_keyboard: buttons,
		},
	});
}

export const handleSubjectSelected = async (
	ctx: Context,
	subjectId: string,
	page = 1,
) => {
	const offset = (page - 1) * PAGE_SIZE;

	const { data: quizzes, count } = await supabase
		.from("quizzes")
		.select("*", { count: "exact" })
		.eq("subject_id", subjectId)
		.range(offset, offset + PAGE_SIZE - 1);

	if (!quizzes || quizzes.length === 0) {
		return ctx.reply("Ushbu fan bo'yicha testlar topilmadi.");
	}

	// Generate quiz buttons
	const buttons = quizzes.map((quiz) => [
		Markup.button.callback(quiz.title, `quiz:${quiz.id}`),
	]);

	// Pagination buttons
	const paginationRow = [];
	if (page > 1) {
		paginationRow.push(
			Markup.button.callback(
				"⬅️ Orqaga",
				`subject:${subjectId}:page:${page - 1}`,
			),
		);
	}
	if (offset + PAGE_SIZE < (count ?? 0)) {
		paginationRow.push(
			Markup.button.callback(
				"➡️ Keyingi",
				`subject:${subjectId}:page:${page + 1}`,
			),
		);
	}
	if (paginationRow.length) buttons.push(paginationRow);

	await ctx.editMessageText(
		"Testlardan birini tanlang:",
		Markup.inlineKeyboard(buttons),
	);
};
