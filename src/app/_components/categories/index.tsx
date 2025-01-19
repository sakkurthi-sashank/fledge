"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { type InferSelectModel } from "drizzle-orm";
import { type category } from "@/server/db/schema";

interface CategoriesProps {
  categories: InferSelectModel<typeof category>[] | undefined;
  selectedCategory: string | null;
}

export const Categories = ({
  categories,
  selectedCategory,
}: CategoriesProps) => {
  const router = useRouter();

  const onClick = (categoryId: string | null) => {
    router.push(categoryId ? `/categories/${categoryId}` : "/");
  };

  return (
    <div className="flex flex-wrap justify-center gap-7 px-4">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => onClick(null)}
      >
        All Categories
      </Button>
      {categories?.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          onClick={() => onClick(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};
