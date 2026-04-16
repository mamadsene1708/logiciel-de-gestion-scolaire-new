const { z } = require('zod');

const userRoleSchema = z.enum(['ADMIN', 'STAFF', 'TEACHER']);
const enrollmentStatusSchema = z.enum(['ACTIVE', 'SUSPENDED', 'COMPLETED']);
const idParamSchema = z.object({
  id: z.string().min(1, 'id is required.')
});

const createUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  role: userRoleSchema.optional()
});

const createStudentSchema = z.object({
  matricule: z.string().trim().min(1),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  dateOfBirth: z.coerce.date()
});

const updateStudentSchema = z.object({
  matricule: z.string().trim().min(1).optional(),
  firstName: z.string().trim().min(1).optional(),
  lastName: z.string().trim().min(1).optional(),
  dateOfBirth: z.coerce.date().optional()
}).refine((value) => Object.values(value).some((item) => item !== undefined), {
  message: 'At least one field must be provided.'
});

const createClassSchema = z.object({
  code: z.string().trim().min(1),
  name: z.string().trim().min(1),
  level: z.string().trim().min(1)
});

const updateClassSchema = z.object({
  code: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).optional(),
  level: z.string().trim().min(1).optional()
}).refine((value) => Object.values(value).some((item) => item !== undefined), {
  message: 'At least one field must be provided.'
});

const createEnrollmentSchema = z.object({
  studentId: z.string().min(1),
  classId: z.string().min(1),
  status: enrollmentStatusSchema.optional()
});

const updateEnrollmentStatusSchema = z.object({
  status: enrollmentStatusSchema
});

module.exports = {
  idParamSchema,
  createUserSchema,
  createStudentSchema,
  updateStudentSchema,
  createClassSchema,
  updateClassSchema,
  createEnrollmentSchema,
  updateEnrollmentStatusSchema
};
