import EditUserForm from "@/components/edit-user-form";
import { Pages, Routes } from "@/constants/enums";
import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import { getUser, getUsers } from "@/server/db/users";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { requireUserEditAccess } from "@/lib/auth-guards";

export async function generateStaticParams() {
    const users = await getUsers();
    
    return users.map((user) => ({ userId: user.id }));
}

async function EditUserPage({ params }: {
    params: Promise<{ userId: string; locale: Locale }>;
}) {
    const { locale, userId } = await params;
    const translations = await getTrans(locale);
    const user = await getUser(userId);
    
    if (!user) {
        redirect(`/${locale}/${Routes.ADMIN}/${Pages.USERS}`);
    }
    
    // التحقق من صلاحية تعديل المستخدم
    const session = await getServerSession(authOptions);
    const isOwnProfile = session?.user?.id === user.id;
    requireUserEditAccess(session?.user?.role, user.role, locale, isOwnProfile);

    return (
        <main>
            <section className="section-gap">
                <div className="container">
                    <EditUserForm translations={translations} user={user} />
                </div>
            </section>
        </main>
    )
}

export default EditUserPage;
