const materielRepository = require("../src/repositories/materielRepository");

jest.mock("../src/repositories/materielRepository");

const {
    creerMateriel,
    obtenirTousLesMateriels,
    obtenirMaterielParId,
    modifierMateriel,
    desactiverMateriel
} = require("../src/services/materielService");
describe("Materiel Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("creerMateriel", () => {
        it("doit créer un matériel avec des données valides", async () => {
            const data = {
                nom: "Perceuse",
                magasinId: "123456789012345678901234"
            };

            const materiel = {
                id: "1",
                ...data
            };

            materielRepository.creer.mockResolvedValue(materiel);

            const resultat = await creerMateriel(data);

            expect(resultat).toEqual(materiel);
            expect(materielRepository.creer).toHaveBeenCalledWith(data);
        });

        it("doit lancer une erreur si le nom est absent", async () => {
            const data = {
                magasinId: "123456789012345678901234"
            };

            await expect(creerMateriel(data)).rejects.toThrow(
                "Le nom et le magasin sont obligatoires."
            );

            expect(materielRepository.creer).not.toHaveBeenCalled();
        });

        it("doit lancer une erreur si le magasin est absent", async () => {
            const data = {
                nom: "Perceuse"
            };

            await expect(creerMateriel(data)).rejects.toThrow(
                "Le nom et le magasin sont obligatoires."
            );

            expect(materielRepository.creer).not.toHaveBeenCalled();
        });
    });

    describe("obtenirTousLesMateriels", () => {
        it("doit retourner tous les matériels selon les filtres", async () => {
            const filtres = { actif: true };

            const materiels = [
                { id: "1", nom: "Perceuse" },
                { id: "2", nom: "Marteau" }
            ];

            materielRepository.trouverTous.mockResolvedValue(materiels);

            const resultat = await obtenirTousLesMateriels(filtres);

            expect(resultat).toEqual(materiels);
            expect(materielRepository.trouverTous).toHaveBeenCalledWith(filtres);
        });

        it("doit utiliser un objet vide si aucun filtre n'est fourni", async () => {
            materielRepository.trouverTous.mockResolvedValue([]);

            const resultat = await obtenirTousLesMateriels();

            expect(resultat).toEqual([]);
            expect(materielRepository.trouverTous).toHaveBeenCalledWith({});
        });
    });

    describe("obtenirMaterielParId", () => {
        it("doit retourner le matériel s'il existe", async () => {
            const materiel = { id: "1", nom: "Perceuse" };

            materielRepository.trouverParId.mockResolvedValue(materiel);

            const resultat = await obtenirMaterielParId("1");

            expect(resultat).toEqual(materiel);
            expect(materielRepository.trouverParId).toHaveBeenCalledWith("1");
        });

        it("doit lancer une erreur si le matériel n'existe pas", async () => {
            materielRepository.trouverParId.mockResolvedValue(null);

            await expect(obtenirMaterielParId("999")).rejects.toThrow(
                "Matériel introuvable."
            );

            expect(materielRepository.trouverParId).toHaveBeenCalledWith("999");
        });
    });

    describe("modifierMateriel", () => {
        it("doit modifier le matériel s'il existe", async () => {
            const data = { nom: "Perceuse électrique" };
            const materielModifie = { id: "1", ...data };

            materielRepository.modifierParId.mockResolvedValue(materielModifie);

            const resultat = await modifierMateriel("1", data);

            expect(resultat).toEqual(materielModifie);
            expect(materielRepository.modifierParId).toHaveBeenCalledWith("1", data);
        });

        it("doit lancer une erreur si le matériel à modifier n'existe pas", async () => {
            materielRepository.modifierParId.mockResolvedValue(null);

            await expect(
                modifierMateriel("999", { nom: "Perceuse électrique" })
            ).rejects.toThrow("Matériel introuvable.");
        });
    });

    describe("desactiverMateriel", () => {
        it("doit désactiver le matériel existant", async () => {
            const materielDesactive = {
                id: "1",
                nom: "Perceuse",
                actif: false
            };

            materielRepository.modifierParId.mockResolvedValue(materielDesactive);

            const resultat = await desactiverMateriel("1");

            expect(resultat).toEqual(materielDesactive);
            expect(materielRepository.modifierParId).toHaveBeenCalledWith(
                "1",
                { actif: false }
            );
        });

        it("doit lancer une erreur si le matériel à désactiver n'existe pas", async () => {
            materielRepository.modifierParId.mockResolvedValue(null);

            await expect(desactiverMateriel("999")).rejects.toThrow(
                "Matériel introuvable."
            );
        });
    });
});