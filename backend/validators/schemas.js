const { z } = require("zod");

const initializeAdminSchema = z.object({
  setupToken: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100),
});

const selfRegisterSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
});

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100),
  role: z.enum(["user", "super_admin"]).optional().default("user"),
  mobile: z.string().optional().default(""),
});

const updateUserRoleSchema = z.object({
  uid: z.string().min(1),
  newRole: z.enum(["user", "super_admin"]),
});

const deleteUserSchema = z.object({
  uid: z.string().min(1),
});

const listUsersSchema = z.object({}).passthrough();

const schemeSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(5000).optional().default(""),
  category: z.string().max(200).optional().default(""),
  link: z.string().max(2000).optional().default(""),
  eligibility: z.string().max(5000).optional().default(""),
});

const schemeUpdateSchema = z.object({
  schemeId: z.string().min(1),
  updates: z.record(z.any()).refine((v) => Object.keys(v).length > 0, "updates cannot be empty"),
});

const deleteSchemeSchema = z.object({
  schemeId: z.string().min(1),
});

const reminderSchema = z.object({
  text: z.string().min(1).max(1000),
  mode: z.enum(["once", "interval"]),
  date: z.string().optional().default(""),
  time: z.string().optional().default(""),
  everyHrs: z.union([z.string(), z.number()]).optional().default(""),
  everyMin: z.union([z.string(), z.number()]).optional().default(""),
});

const reminderUpdateSchema = z.object({
  reminderId: z.string().min(1),
  updates: z.record(z.any()).refine((v) => Object.keys(v).length > 0, "updates cannot be empty"),
});

const reminderDeleteSchema = z.object({
  reminderId: z.string().min(1),
});

const calendarNoteAddSchema = z.object({
  date: z.string().min(1),
  text: z.string().min(1).max(1000),
});

const calendarNoteUpdateSchema = z.object({
  date: z.string().min(1),
  index: z.number().int().min(0),
  text: z.string().min(1).max(1000),
});

const calendarNoteDeleteSchema = z.object({
  date: z.string().min(1),
  index: z.number().int().min(0),
});

const askHealthAssistantSchema = z.object({
  prompt: z.string().min(1).max(4000),
});

const analyzeMedicalDocumentSchema = z.object({
  systemPrompt: z.string().min(1).max(4000),
  ocrText: z.string().min(1).max(20000),
});

module.exports = {
  initializeAdminSchema,
  selfRegisterSchema,
  createUserSchema,
  updateUserRoleSchema,
  deleteUserSchema,
  listUsersSchema,
  schemeSchema,
  schemeUpdateSchema,
  deleteSchemeSchema,
  reminderSchema,
  reminderUpdateSchema,
  reminderDeleteSchema,
  calendarNoteAddSchema,
  calendarNoteUpdateSchema,
  calendarNoteDeleteSchema,
  askHealthAssistantSchema,
  analyzeMedicalDocumentSchema,
};
