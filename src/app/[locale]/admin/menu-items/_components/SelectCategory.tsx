"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category } from "@prisma/client";

interface SelectCategoryProps {
  categoryId: string;
  categories: Category[];
  setCategoryId: (id: string) => void;
}

function SelectCategory({ categoryId, categories, setCategoryId }: SelectCategoryProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Category
      </label>
      <Select value={categoryId} onValueChange={setCategoryId}>
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectCategory;
