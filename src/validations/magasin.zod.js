const { z } = require('zod');

const magasinSchema = z.object({
  nom: z.string().min(1, { message: "Le nom est requis" }),
  adresse: z.string().min(1, { message: "L'adresse est requise" }),
  actif: z.boolean().default(true),
});

module.exports = { magasinSchema };