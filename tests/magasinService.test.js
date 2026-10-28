
const magasinRepository = require("../src/repositories/magasinRepository");

jest.mock("../src/repositories/magasinRepository");

const {
    creerMagasin,
    obtenirTousLesMagasins,
    obtenirMagasinParId,
    modifierMagasin,
    supprimerMagasin,
    disactiveMagasinbyId
} = require("../src/services/magasinService");

describe("Magasin Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // CREER MAGASIN
    describe("creerMagasin", () => {
        it("doit créer un magasin avec des données valides", async () => {
            const data = {
                nom: "Magasin Safi",
                adresse: "Safi"
            };

            magasinRepository.creer.mockResolvedValue(data);

            const resultat = await creerMagasin(data);

            expect(resultat).toEqual(data);
            expect(magasinRepository.creer).toHaveBeenCalledWith(data);
        });

        it("doit lancer une erreur si le nom est absent", async () => {
            const data = { adresse: "Safi" };

            await expect(creerMagasin(data)).rejects.toThrow(
                "Le nom et l'adresse sont obligatoires."
            );

            expect(magasinRepository.creer).not.toHaveBeenCalled();
        });

        it("doit lancer une erreur si l'adresse est absente", async () => {
            const data = { nom: "Magasin Safi" };

            await expect(creerMagasin(data)).rejects.toThrow(
                "Le nom et l'adresse sont obligatoires."
            );

            expect(magasinRepository.creer).not.toHaveBeenCalled();
        });
    });

    // OBTENIR TOUS LES MAGASINS
    describe("obtenirTousLesMagasins", () => {
        it("doit retourner tous les magasins", async () => {
            const magasins = [
                { id: "1", nom: "Magasin Safi", adresse: "Safi" },
                { id: "2", nom: "Magasin Casa", adresse: "Casablanca" }
            ];

            magasinRepository.trouverTous.mockResolvedValue(magasins);

            const resultat = await obtenirTousLesMagasins();

            expect(resultat).toEqual(magasins);
            expect(magasinRepository.trouverTous).toHaveBeenCalledTimes(1);
        });
    });

    // OBTENIR MAGASIN PAR ID
    describe("obtenirMagasinParId", () => {
        it("doit retourner le magasin s'il existe", async () => {
            const magasin = {
                id: "1",
                nom: "Magasin Safi",
                adresse: "Safi"
            };

            magasinRepository.trouverParId.mockResolvedValue(magasin);

            const resultat = await obtenirMagasinParId("1");

            expect(resultat).toEqual(magasin);
            expect(magasinRepository.trouverParId).toHaveBeenCalledWith("1");
        });

        it("doit lancer une erreur si le magasin n'existe pas", async () => {
            magasinRepository.trouverParId.mockResolvedValue(null);

            await expect(obtenirMagasinParId("999")).rejects.toThrow(
                "Magasin introuvable."
            );
        });
    });

    // MODIFIER MAGASIN
    describe("modifierMagasin", () => {
        it("doit modifier le magasin avec des données valides", async () => {
            const data = { nom: "Magasin Safi Centre" };
            const magasinModifie = {
                id: "1",
                nom: "Magasin Safi Centre",
                adresse: "Safi"
            };

            magasinRepository.modifierParId.mockResolvedValue(magasinModifie);

            const resultat = await modifierMagasin("1", data);

            expect(resultat).toEqual(magasinModifie);
            expect(magasinRepository.modifierParId).toHaveBeenCalledWith(
                "1",
                data
            );
        });

        it("doit lancer une erreur si aucun champ n'est fourni", async () => {
            await expect(modifierMagasin("1", {})).rejects.toThrow(
                "Au moins un champ est obligatoire pour la modification."
            );

            expect(magasinRepository.modifierParId).not.toHaveBeenCalled();
        });

        it("doit lancer une erreur si le magasin n'existe pas", async () => {
            magasinRepository.modifierParId.mockResolvedValue(null);

            await expect(
                modifierMagasin("999", { nom: "Nouveau nom" })
            ).rejects.toThrow("Magasin introuvable.");
        });
    });

    // SUPPRIMER MAGASIN
    describe("supprimerMagasin", () => {
        it("doit supprimer le magasin s'il existe", async () => {
            const magasin = {
                id: "1",
                nom: "Magasin Safi",
                adresse: "Safi"
            };

            magasinRepository.supprimerParId.mockResolvedValue(magasin);

            const resultat = await supprimerMagasin("1");

            expect(resultat).toEqual(magasin);
            expect(magasinRepository.supprimerParId).toHaveBeenCalledWith("1");
        });

        it("doit lancer une erreur si le magasin n'existe pas", async () => {
            magasinRepository.supprimerParId.mockResolvedValue(null);

            await expect(supprimerMagasin("999")).rejects.toThrow(
                "Magasin introuvable."
            );
        });
    });

    // DESACTIVER MAGASIN
    describe("disactiveMagasinbyId", () => {
        it("doit appeler le repository pour désactiver le magasin", async () => {
            const magasinDesactive = {
                id: "1",
                nom: "Magasin Safi",
                adresse: "Safi",
                actif: false
            };

            magasinRepository.disactiveMagasin.mockResolvedValue(
                magasinDesactive
            );

            const resultat = await disactiveMagasinbyId("1");

            expect(resultat).toEqual(magasinDesactive);
            expect(magasinRepository.disactiveMagasin).toHaveBeenCalledWith("1");
        });
    });
});
