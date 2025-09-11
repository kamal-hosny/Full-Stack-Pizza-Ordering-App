import { cache } from "@/lib/cache";
import { db } from "@/lib/prisma";

export const getUsers = cache(
    () => {
const users = db.user.findMany();
return users
    } , ["users"],
    {revalidate: 3600}
);
export const getUser = (userId: string) =>
  cache(
    () => db.user.findUnique({ where: { id: userId } }),
    [`user-${userId}`], 
    { revalidate: 3600 }
  )();
