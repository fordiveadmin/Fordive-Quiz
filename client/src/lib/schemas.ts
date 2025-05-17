import * as z from 'zod';

export const questionOptionSchema = z.object({
  id: z.string().optional(),
  text: z.string(),
  value: z.string().optional(),
  label: z.string().optional(),
  description: z.string().optional(),
  scentMappings: z.record(z.string(), z.number()).default({})
});

export const questionSchema = z.object({
  text: z.string().min(3, { message: "Pertanyaan harus diisi minimal 3 karakter" }),
  type: z.enum(['multiple_choice', 'checkbox', 'rating_scale']),
  order: z.number().min(1, { message: "Urutan harus minimal 1" }),
  isMainQuestion: z.boolean().default(false),
  parentId: z.number().nullable(),
  parentOptionId: z.string().nullable(),
  options: z.array(questionOptionSchema),
  
  // Rating scale properties
  scaleMin: z.string().optional(),
  scaleMax: z.string().optional(),
  scaleSteps: z.number().optional()
});

export type QuestionFormValues = z.infer<typeof questionSchema>;
export type QuestionOption = z.infer<typeof questionOptionSchema>;