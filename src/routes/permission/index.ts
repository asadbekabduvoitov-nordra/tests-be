import { Request, Response, Router } from "express";
import { supabase } from "../../configs/supabase";

const router = Router();

router.get("/check", async (req: Request, res: Response) => {
    // @ts-ignore
    const user = req.user;

    const { data: permission, error: permission_error } = await supabase.from("quiz_permissions").select("*").eq("user_id", user?.id).gt("remaining_quiz_accesses", 0).order("purchased_at", { ascending: false }).limit(1).single();

    // Decrease the count of the permission
    if (permission) {
        const { error: update_error } = await supabase.from("quiz_permissions").update({ remaining_quiz_accesses: permission.remaining_quiz_accesses - 1 }).eq("id", permission.id);

        if (update_error) {
            return res.status(500).json({
                message: "error",
                error: update_error?.message
            });
        }
    }

    if (permission_error) {
        return res.status(500).json({
            message: "error",
            error: permission_error?.message
        });
    }

    return res.status(200).json({
        message: "success",
        data: {
            hasAccess: permission?.remaining_quiz_accesses > 0,
        }
    });
});

export default router;