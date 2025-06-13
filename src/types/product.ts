import { Prisma } from "@prisma/client";

export type ProductWithRelations = Prisma.ProductGetPayload<{
    include:{
        Size: true;
        extras: true;
    }
}> 
