import { supabase } from "../configs/supabase";
import { NextFunction, Request, Response } from "express";

export const requireExternalUser = async (req: Request, res: Response, next: NextFunction) => {

	const telegram_id = req.headers["telegram_id"];


	if (!telegram_id) {
		return res.status(401).json({
			message: "Unauthorized",
		});
	}

	const { data } = await supabase
		.from("users")
		.select("*")
		.eq("telegram_id", Number(telegram_id))
		.limit(1)
		.single();

	if (!data) {
		return res.status(401).json({
			message: "Unauthorized",
		});
	}

	// @ts-ignore
	req.user = data;

	return next();
};
