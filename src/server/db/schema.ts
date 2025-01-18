import { relations, sql } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `fledge_${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  coursesTeaching: many(courses, { relationName: "instructor" }),
  coursesPurchased: many(purchases, { relationName: "student" }),
  progress: many(progress, { relationName: "student" }),
  stripeCustomer: many(stripeCustomers),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("sessions_user_id_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const courses = createTable("course", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  instructorId: varchar("instructor_id", { length: 255 }).references(
    () => users.id,
  ),
  title: text("title"),
  subtitle: text("subtitle"),
  description: text("description"),
  imageUrl: text("image_url"),
  price: decimal("price"),
  isPublished: boolean("is_published").default(false),
  categoryId: varchar("category_id", { length: 255 }).references(
    () => category.id,
  ),
  subCategoryId: varchar("sub_category_id", { length: 255 }).references(
    () => subCategory.id,
  ),
  levelId: varchar("level_id", { length: 255 }).references(() => levels.id),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }),
});

export const coursesRelations = relations(courses, ({ one, many }) => ({
  instructor: one(users, {
    fields: [courses.instructorId],
    references: [users.id],
    relationName: "instructor",
  }),
  category: one(category, {
    fields: [courses.categoryId],
    references: [category.id],
  }),
  subCategory: one(subCategory, {
    fields: [courses.subCategoryId],
    references: [subCategory.id],
  }),
  level: one(levels, { fields: [courses.levelId], references: [levels.id] }),
  sections: many(sections),
  purchases: many(purchases),
}));

export const category = createTable("category", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
});

export const categoryRelations = relations(category, ({ many }) => ({
  courses: many(courses),
  subCategories: many(subCategory),
}));

export const subCategory = createTable("sub_category", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  categoryId: text("category_id").references(() => category.id),
});

export const subCategoryRelations = relations(subCategory, ({ one, many }) => ({
  category: one(category, {
    fields: [subCategory.categoryId],
    references: [category.id],
  }),
  courses: many(courses),
}));

export const levels = createTable("level", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("text"),
});

export const levelsRelations = relations(levels, ({ many }) => ({
  courses: many(courses),
}));

export const sections = createTable(
  "sections",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    videoUrl: text("video_url"),
    position: integer("position").notNull(),
    isPublished: boolean("is_published").default(false).notNull(),
    isFree: boolean("is_free").default(false).notNull(),
    courseId: varchar("course_id", { length: 36 })
      .notNull()
      .references(() => courses.id),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    }),
  },
  (table) => ({
    courseIdIdx: index("sections_course_id_idx").on(table.courseId),
  }),
);

export const sectionsRelations = relations(sections, ({ one, many }) => ({
  course: one(courses, {
    fields: [sections.courseId],
    references: [courses.id],
  }),
  muxData: one(muxData),
  resources: many(resources),
  progress: many(progress),
}));

export const muxData = createTable(
  "mux_data",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    assetId: varchar("asset_id", { length: 255 }).notNull(),
    playbackId: varchar("playback_id", { length: 255 }),
    sectionId: varchar("section_id", { length: 255 })
      .notNull()
      .unique()
      .references(() => sections.id),
  },
  (table) => ({
    sectionIdIdx: index("mux_data_section_id_idx").on(table.sectionId),
  }),
);

export const muxDataRelations = relations(muxData, ({ one }) => ({
  section: one(sections, {
    fields: [muxData.sectionId],
    references: [sections.id],
  }),
}));

export const resources = createTable(
  "resources",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    fileUrl: varchar("file_url", { length: 255 }).notNull(),
    sectionId: varchar("section_id", { length: 36 })
      .notNull()
      .references(() => sections.id),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    }),
  },
  (table) => ({
    sectionIdIdx: index("resources_section_id_idx").on(table.sectionId),
  }),
);

export const resourcesRelations = relations(resources, ({ one }) => ({
  section: one(sections, {
    fields: [resources.sectionId],
    references: [sections.id],
  }),
}));

export const progress = createTable(
  "progress",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    studentId: varchar("student_id", { length: 255 }).notNull(),
    sectionId: varchar("section_id", { length: 255 }).notNull(),
    isCompleted: boolean("is_completed").default(false).notNull(),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    }),
  },
  (table) => ({
    sectionIdIdx: index("progress_section_id_idx").on(table.sectionId),
    studentSectionUnique: uniqueIndex("progress_student_section_unique").on(
      table.studentId,
      table.sectionId,
    ),
  }),
);

export const progressRelations = relations(progress, ({ one }) => ({
  section: one(sections, {
    fields: [progress.sectionId],
    references: [sections.id],
  }),
  student: one(users, {
    fields: [progress.studentId],
    references: [users.id],
    relationName: "student",
  }),
}));

export const purchases = createTable(
  "purchases",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    customerId: varchar("customer_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    courseId: varchar("course_id", { length: 255 })
      .notNull()
      .references(() => courses.id),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    }),
  },
  (table) => ({
    courseIdIdx: index("purchases_course_id_idx").on(table.courseId),
    customerCourseUnique: uniqueIndex("purchases_customer_course_unique").on(
      table.customerId,
      table.courseId,
    ),
  }),
);

export const purchasesRelations = relations(purchases, ({ one }) => ({
  course: one(courses, {
    fields: [purchases.courseId],
    references: [courses.id],
  }),
  customer: one(users, {
    fields: [purchases.customerId],
    references: [users.id],
    relationName: "student",
  }),
}));

export const stripeCustomers = createTable("stripe_customers", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  customerId: varchar("customer_id", { length: 255 })
    .notNull()
    .unique()
    .references(() => users.id),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 })
    .notNull()
    .unique(),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }),
});

export const stripeCustomersRelations = relations(
  stripeCustomers,
  ({ one }) => ({
    user: one(users, {
      fields: [stripeCustomers.customerId],
      references: [users.id],
    }),
  }),
);
