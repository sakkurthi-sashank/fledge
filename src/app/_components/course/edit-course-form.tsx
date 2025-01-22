"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { InferSelectModel } from "drizzle-orm";
import { courses } from "@/server/db/schema";
import { Combobox } from "@/components/ui/combo-box";
import { useToast } from "@/hooks/use-toast";
import { DropzoneField } from "../file-upload";
import { api } from "@/trpc/react";
import { Delete } from "../common/delete";
import PublishButton from "../common/publish-button";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title is required and must be at least 2 characters long",
  }),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1, {
    message: "Category is required",
  }),
  subCategoryId: z.string().min(1, {
    message: "Subcategory is required",
  }),
  levelId: z.string().min(1, {
    message: "Level is required",
  }),
  imageUrl: z.string().optional(),
  price: z.string().min(1, {
    message: "Price is required",
  }),
  file: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditCourseFormProps {
  course: InferSelectModel<typeof courses>;
  categories: {
    label: string;
    value: string;
    subCategories: { label: string; value: string }[];
  }[];
  levels: { label: string; value: string }[];
  isCompleted: boolean;
}

export const EditCourseForm = ({
  course,
  categories,
  levels,
  isCompleted,
}: EditCourseFormProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const { mutateAsync: updateCourse, isPending } =
    api.courses.updateCourse.useMutation({
      onSuccess: () => {
        toast({
          title: "Course Updated",
        });
        router.refresh();
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Failed to update course",
        });
      },
    });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course.title ?? "",
      subtitle: course.subtitle ?? "",
      description: course.description ?? "",
      categoryId: course.categoryId ?? "",
      subCategoryId: course.subCategoryId ?? "",
      levelId: course.levelId ?? "",
      imageUrl: course.imageUrl ?? "",
      price: course.price?.toString() ?? "",
      file: undefined,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await updateCourse({
        coursesId: course.id,
        ...values,
      });
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };

  const selectedCategory = categories.find(
    (category) => category.value === form.watch("categoryId"),
  );

  const routes = [
    {
      label: "Basic Information",
      path: `/instructor/courses/${course.id}/basic`,
    },
    {
      label: "Curriculum",
      path: `/instructor/courses/${course.id}/sections`,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <div className="flex gap-5">
          {routes.map((route) => (
            <Link key={route.path} href={route.path}>
              <Button variant={pathname === route.path ? "default" : "outline"}>
                {route.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="flex items-start gap-5">
          <PublishButton
            disabled={!isCompleted}
            courseId={course.id}
            isPublished={course.isPublished ?? false}
            page="Course"
          />
          <Delete item="course" courseId={course.id} />
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
          noValidate
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Web Development for Beginners"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtitle</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Become a Full-stack Developer..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Describe about this course" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Combobox options={categories} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Subcategory <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      options={selectedCategory?.subCategories ?? []}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="levelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Level <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Combobox options={levels} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Course Banner <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <DropzoneField
                    filePathName="imageUrl"
                    destinationPathPrefix="course-banner"
                    description="Upload your course banner image"
                    multiple={false}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Price (USD) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="text" placeholder="29.99" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-5">
            <Link href="/instructor/courses">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
