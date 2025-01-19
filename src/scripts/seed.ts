"use server";

import { db } from "@/server/db";
import { category, levels, subCategory } from "@/server/db/schema";

export async function seedDB() {
  try {
    const categoryData = [
      { name: "IT & Software" },
      { name: "Business" },
      { name: "Design" },
      { name: "Health" },
    ];

    const insertedCategories = await db
      .insert(category)
      .values(categoryData)
      .returning()
      .execute();

    const subCategoriesData = insertedCategories.flatMap((cat) => {
      const subCats = getSubCategoriesForCategory(cat.name!);
      return subCats.map((subCatName) => ({
        categoryId: cat.id,
        name: subCatName,
      }));
    });

    await db.insert(subCategory).values(subCategoriesData).execute();

    await db
      .insert(levels)
      .values([
        { name: "Beginner" },
        { name: "Intermediate" },
        { name: "Expert" },
        { name: "All levels" },
      ])
      .execute();

    console.log("Seeding successfully");
  } catch (error) {
    console.log("Seeding failed", error);
  }
}

function getSubCategoriesForCategory(categoryName: string): string[] {
  const subCategoriesMap: Record<string, string[]> = {
    "IT & Software": [
      "Web Development",
      "Data Science",
      "Cybersecurity",
      "Others",
    ],
    Business: ["E-Commerce", "Marketing", "Finance", "Others"],
    Design: ["Graphic Design", "3D & Animation", "Interior Design", "Others"],
    Health: ["Fitness", "Yoga", "Nutrition", "Others"],
  };

  return subCategoriesMap[categoryName] ?? [];
}
