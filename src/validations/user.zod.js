const { z } = require('zod');

const roles = ['admin', 'gestionnaire', 'user'];

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

const createGestionnaireSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(100),
});


const loginSchema = z.object({
  email: z
    .string({ required_error: "L'email est requis" })
    .trim()
    .toLowerCase()
    .email('Email invalide'),

  password: z
    .string({ required_error: 'Le mot de passe est requis' })
    .min(1, 'Le mot de passe est requis'),
});

module.exports = {
  createUserSchema,
  loginSchema,
  createGestionnaireSchema
};