import { cache } from "@/lib/cache";
import { db } from "@/lib/prisma";

export const getProductsByCategory = cache(
  async () => {
    const products = await db.category.findMany({
      include:{
        products:{
          include:{
            sizes:true,
            extras:true,
          }
        }
      }
    });
    return products;
  },
  ["products-by-category"],
  { revalidate: 60 * 60 * 1 } // Revalidate every `1` hour
)

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
        sizes: true,
        extras: true,
      },
      take: limit || 3, // Limit to top 3 best sellers
    });
    return bestSellers;
  },
  ["best-sellers"],
  { revalidate: 60 * 60 * 1 }
); // Revalidate every `1` hour


export const getProducts = cache(
  () => {
    const products = db.product.findMany({
      include: {
        sizes: true,
        extras: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return products;
  },
  ["products"],
  { revalidate: 60 * 60 * 1 } // Revalidate every `1` hour
);

export const getProduct = (id: string) => {
  return db.product.findUnique({
    where: { id },
    include: {
      sizes: true,
      extras: true,
    },
  });
}