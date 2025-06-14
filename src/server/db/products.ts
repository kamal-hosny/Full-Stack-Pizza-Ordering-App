import { cache } from "@/lib/cache";
import { db } from "@/lib/prisma";

export const getProductsByCategory = cache(
  () => {
    const products = db.category.findMany({
      include:{
        Product:{
          include:{
            Size:true,
            extras:true,
          }
        }
      }
    })
    return products
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


export const getProduct = cache(
  (id: string) => {
    const product = db.product.findUnique({
      where: { id },
      include: {
        Size: true,
        extras: true,
      },
    })
    return product;
  },
  [`product-${crypto.randomUUID()}`],
  { revalidate: 60 * 60 * 1 } // Revalidate every `1` hour
)