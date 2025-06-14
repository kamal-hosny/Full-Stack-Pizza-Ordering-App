import { cache } from "@/lib/cache";
import { db } from "@/lib/prisma";

export const getBestSellers = cache(
  (limit?: number | undefined) => {
    const bestSellers = db.product.findMany({
      where: {
        orders: {
          some: {},
        },
      },
      orderBy: {
        orders: {
          _count: "desc",
        },
      },
      include: {
        Size: true,
        extras: true,
      },
      take: limit || 3, // Limit to top 3 best sellers
    });
    return bestSellers;
  },
  ["best-sellers"],
  { revalidate: 60 * 60 * 1 }
); // Revalidate every `1` hour
