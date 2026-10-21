const { z } = require('zod');

const roles = ['admin', 'manager', 'user'];

const createUserSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(100),
  role: z.enum(roles).default('user'),
  store: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid store id').optional(),
}).refine(d => d.role !== 'manager' || d.store, {
  message: 'Manager must be assigned to a store',
  path: ['store'],
});


module.exports = {
  createUserSchema
};