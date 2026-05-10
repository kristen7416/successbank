import { pgTable, serial, varchar, text, integer, timestamp, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 成功存款记录
export const successDeposits = pgTable(
	"success_deposits",
	{
		id: serial().primaryKey(),
		content: text("content").notNull(),
		type: varchar("type", { length: 20 }).notNull().default("custom"), // preset / custom / challenge
		emotion: varchar("emotion", { length: 20 }),
		difficulty: varchar("difficulty", { length: 10 }).notNull().default("easy"), // easy / medium / hard
		coins: integer("coins").notNull().default(1),
		note: text("note"),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		index("success_deposits_created_at_idx").on(table.created_at),
		index("success_deposits_difficulty_idx").on(table.difficulty),
	]
);

// 21天任务完成记录
export const taskCompletions = pgTable(
	"task_completions",
	{
		id: serial().primaryKey(),
		day: integer("day").notNull(), // 1-21
		completed: integer("completed").notNull().default(1),
		feeling: text("feeling"),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		index("task_completions_day_idx").on(table.day),
		index("task_completions_created_at_idx").on(table.created_at),
	]
);

// 用户成就
export const userAchievements = pgTable(
	"user_achievements",
	{
		id: serial().primaryKey(),
		achievement_id: varchar("achievement_id", { length: 50 }).notNull(), // e.g. streak_7, plan_21
		unlocked_at: timestamp("unlocked_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		index("user_achievements_achievement_id_idx").on(table.achievement_id),
	]
);

// 感恩日记
export const gratitudeEntries = pgTable(
	"gratitude_entries",
	{
		id: serial().primaryKey(),
		items: text("items").notNull(), // JSON array string of gratitude items
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		index("gratitude_entries_created_at_idx").on(table.created_at),
	]
);

// 自我肯定记录
export const affirmationRecords = pgTable(
	"affirmation_records",
	{
		id: serial().primaryKey(),
		content: text("content").notNull(),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		index("affirmation_records_created_at_idx").on(table.created_at),
	]
);

// 价值条件化记录
export const valueConditions = pgTable(
	"value_conditions",
	{
		id: serial().primaryKey(),
		condition_text: text("condition_text").notNull(),
		rewrite_text: text("rewrite_text"),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updated_at: timestamp("updated_at", { withTimezone: true }),
	},
	(table) => [
		index("value_conditions_created_at_idx").on(table.created_at),
	]
);
