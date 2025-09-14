import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.types";
import dotenv from "dotenv";
dotenv.config();

export const supabase = createClient<Database>(
	String(process.env.SUPABASE_URL),
	String(process.env.SUPABASE_KEY),
);
