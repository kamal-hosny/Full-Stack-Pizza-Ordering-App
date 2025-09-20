import { db } from "@/lib/prisma";

export const getUsers = async () => {
    try {
        console.log('Fetching users from database...');
        const users = await db.user.findMany();
        console.log('Found users:', users.length);
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};
export const getUser = async (userId: string) => {
    try {
        const user = await db.user.findUnique({ where: { id: userId } });
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
};
