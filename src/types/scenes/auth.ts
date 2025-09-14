export type TLang = "uz" | "ru" | "en";

export interface AuthScene {
	step?: "first_name" | "last_name" | "phone";
	firstName?: string;
	lastName?: string;
	phone?: string;
	language_code?: TLang;
}
