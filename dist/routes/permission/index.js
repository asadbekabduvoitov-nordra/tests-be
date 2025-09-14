"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_1 = require("../../configs/supabase");
const router = (0, express_1.Router)();
router.get("/check", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const user = req.user;
    const { data: permission, error: permission_error } = yield supabase_1.supabase.from("quiz_permissions").select("*").eq("user_id", user === null || user === void 0 ? void 0 : user.id).gt("remaining_quiz_accesses", 0).order("purchased_at", { ascending: false }).limit(1).single();
    // Decrease the count of the permission
    if (permission) {
        const { error: update_error } = yield supabase_1.supabase.from("quiz_permissions").update({ remaining_quiz_accesses: permission.remaining_quiz_accesses - 1 }).eq("id", permission.id);
        if (update_error) {
            return res.status(500).json({
                message: "error",
                error: update_error === null || update_error === void 0 ? void 0 : update_error.message
            });
        }
    }
    if (permission_error) {
        return res.status(500).json({
            message: "error",
            error: permission_error === null || permission_error === void 0 ? void 0 : permission_error.message
        });
    }
    return res.status(200).json({
        message: "success",
        data: {
            hasAccess: (permission === null || permission === void 0 ? void 0 : permission.remaining_quiz_accesses) > 0,
        }
    });
}));
exports.default = router;
