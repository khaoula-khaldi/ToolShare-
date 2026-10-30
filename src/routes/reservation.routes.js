const express = require("express");
const router = express.Router();

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const reservationController = require("../controllers/reservationController");
const authorizeGestionnaire =require("../middlewares/gestionnaireAuthorization");
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   - name: Réservations
 *     description: Réservations de matériel
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         utilisateurId: { type: string }
 *         materielId: { type: string }
 *         magasinId: { type: string }
 *         dateDebut: { type: string, format: date-time }
 *         dureeHeures: { type: number, example: 3 }
 *         dateFin: { type: string, format: date-time }
 *         statut: { type: string, enum: [CONFIRMEE, ANNULEE, EN_COURS, TERMINEE], example: CONFIRMEE }
 *         dateSortieReelle: { type: string, format: date-time, nullable: true }
 *         dateRetourReelle: { type: string, format: date-time, nullable: true }
 *         etatRetour: { type: string, nullable: true }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *     CreateReservationInput:
 *       type: object
 *       required: [magasinId, materielId, dateDebut, duree]
 *       properties:
 *         magasinId: { type: string, example: '665f1c2e8b3a4d0012ab34ce' }
 *         materielId: { type: string, example: '665f1c2e8b3a4d0012ab34cf' }
 *         dateDebut: { type: string, format: date-time, example: '2026-11-03T09:00:00.000Z' }
 *         duree: { type: number, example: 3, description: 'Durée en heures, strictement positive' }
 */

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Créer une réservation (utilisateur)
 *     description: >
 *       Le matériel doit appartenir au magasin choisi, être actif et disponible.
 *       La date de début ne peut pas être dans le passé, la date de fin = début + durée.
 *       Deux réservations actives d'un même matériel ne peuvent pas se chevaucher
 *       (une réservation peut commencer exactement à la fin de la précédente).
 *       Deux demandes simultanées sur le même matériel ne produisent jamais de double réservation.
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateReservationInput' }
 *     responses:
 *       201:
 *         description: Réservation confirmée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'Réservation confirmée.' }
 *                 data: { $ref: '#/components/schemas/Reservation' }
 *       400:
 *         description: Champs manquants, id invalide, date passée, durée non positive ou matériel hors du magasin
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Réservé aux utilisateurs
 *       404:
 *         description: Matériel ou magasin introuvable ou désactivé
 *       409:
 *         description: Matériel indisponible, créneau déjà réservé, ou demande simultanée en cours
 */
router.post("/", authorize("user"), reservationController.creer);

/**
 * @swagger
 * components:
 *   schemas:
 *     MaReservation:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         materiel:
 *           type: object
 *           properties:
 *             id: { type: string }
 *             nom: { type: string, example: 'Perceuse Bosch GSB 18V' }
 *             description: { type: string }
 *             etat: { type: string, enum: [BON, ENDOMMAGE, EN_MAINTENANCE] }
 *         magasin:
 *           type: object
 *           properties:
 *             id: { type: string }
 *             nom: { type: string, example: 'Magasin Safi Nord' }
 *             adresse: { type: string }
 *         dateDebut: { type: string, format: date-time }
 *         dureeHeures: { type: number, example: 3 }
 *         dateFin: { type: string, format: date-time }
 *         statut: { type: string, enum: [CONFIRMEE, ANNULEE, EN_COURS, TERMINEE] }
 *         enRetard: { type: boolean, description: 'EN_COURS et date de fin prévue dépassée' }
 *         dateSortieReelle: { type: string, format: date-time, nullable: true }
 *         dateRetourReelle: { type: string, format: date-time, nullable: true }
 *         etatRetour: { type: string, nullable: true }
 *         createdAt: { type: string, format: date-time }
 */

/**
 * @swagger
 * /reservations/mes-reservations:
 *   get:
 *     summary: Consulter mes réservations et leurs statuts (utilisateur)
 *     description: Retourne uniquement les réservations de l'utilisateur connecté, de la plus récente à la plus ancienne.
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: statut
 *         schema: { type: string, example: 'CONFIRMEE,EN_COURS' }
 *         description: Un ou plusieurs statuts séparés par des virgules (CONFIRMEE, ANNULEE, EN_COURS, TERMINEE)
 *       - in: query
 *         name: du
 *         schema: { type: string, format: date-time }
 *         description: Début de la période
 *       - in: query
 *         name: au
 *         schema: { type: string, format: date-time }
 *         description: Fin de la période
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 20, maximum: 100 } }
 *     responses:
 *       200:
 *         description: Liste paginée de mes réservations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: array, items: { $ref: '#/components/schemas/MaReservation' } }
 *                 total: { type: integer }
 *                 page: { type: integer }
 *                 limit: { type: integer }
 *                 pages: { type: integer }
 *       400:
 *         description: Statut ou dates invalides
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Réservé aux utilisateurs
 */
router.get("/mes-reservations", authorize("user"), reservationController.mesReservations);

/**
 * @swagger
 * /reservations/mes-reservations/{id}:
 *   get:
 *     summary: Consulter une de mes réservations (utilisateur)
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Réservation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/MaReservation' }
 *       400:
 *         description: Id invalide
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Réservé aux utilisateurs
 *       404:
 *         description: Réservation introuvable (ou appartenant à un autre utilisateur)
 */
router.get("/mes-reservations/:id", authorize("user"), reservationController.maReservation);

router.get("/gestionnaire",authorizeGestionnaire , reservationController.reservationMagasin);

module.exports = router;