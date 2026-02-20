import { syncUser } from "@/actions/user";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const user = await syncUser();

    if (!user) {
        redirect("/sign-in");
    }

    const role = user.role;

    if (role === "ADMIN") {
        redirect("/dashboard/admin");
    } else if (role === "MENTOR") {
        redirect("/dashboard/mentor");
    } else {
        redirect("/dashboard/mentee");
    }
}
