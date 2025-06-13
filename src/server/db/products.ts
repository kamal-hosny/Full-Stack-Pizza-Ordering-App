import { cache } from "@/lib/cache";
import { db } from "@/lib/prisma";

export const getBestSellers = cache(
  () => {
    const bestSellers = db.product.findMany({
      include: {
        Size: true,
        extras: true,
      },
    });
    return bestSellers;
  },
  ["best-sellers"],
  { revalidate: 60 * 60 * 1 }
); // Revalidate every `1` hour
