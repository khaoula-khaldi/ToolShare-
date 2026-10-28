
const userRepository = require("../src/repositories/user.repo");
const bcrypt = require("bcrypt");

jest.mock("../src/repositories/user.repo");
jest.mock("bcrypt");

const { createUser } = require("../src/services/gestionnaireUser.service");

describe("User Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createUser", () => {
        it("doit créer un utilisateur avec des données valides", async () => {
            const data = {
                name: "Sara",
                email: "sara@gmail.com",
                password: "password123"
            };

            const passwordHash = "hashedPassword123";
            const userCree = {
                id: "1",
                name: "Sara",
                email: "sara@gmail.com",
                role: "user"
            };

            userRepository.findByEmail.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue(passwordHash);
            userRepository.create.mockResolvedValue(userCree);

            const resultat = await createUser(data);

            expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);

            expect(userRepository.findByEmail).toHaveBeenCalledWith(
                "sara@gmail.com"
            );

            expect(userRepository.create).toHaveBeenCalledWith({
                name: "Sara",
                email: "sara@gmail.com",
                password: passwordHash,
                role: "user"
            });

            expect(resultat).toEqual(userCree);
        });

        it("doit lancer une erreur si l'email existe déjà", async () => {
            const data = {
                name: "Sara",
                email: "sara@gmail.com",
                password: "password123"
            };

            userRepository.findByEmail.mockResolvedValue({
                id: "2",
                email: "sara@gmail.com"
            });

            bcrypt.hash.mockResolvedValue("hashedPassword123");

            await expect(createUser(data)).rejects.toThrow(
                "ce mail est déja utiliser à une autre compte"
            );

            expect(userRepository.create).not.toHaveBeenCalled();
        });

        it("doit toujours attribuer le rôle user", async () => {
            const data = {
                name: "Sara",
                email: "sara@gmail.com",
                password: "password123",
                role: "admin"
            };

            userRepository.findByEmail.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue("hashedPassword123");
            userRepository.create.mockResolvedValue({
                id: "1",
                name: "Sara",
                email: "sara@gmail.com",
                role: "user"
            });

            await createUser(data);

            expect(userRepository.create).toHaveBeenCalledWith({
                name: "Sara",
                email: "sara@gmail.com",
                password: "hashedPassword123",
                role: "user"
            });
        });
    });
});
