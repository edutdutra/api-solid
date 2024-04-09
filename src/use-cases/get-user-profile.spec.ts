import {beforeEach, describe, expect, it} from "vitest";
import {InMemoryUsersRepository} from "@/repositories/in-memory/in-memory-users-repository";
import {ResourceNotFoundError} from "@/use-cases/errors/resource-not-found-error";
import {GetUserProfileUseCase} from "@/use-cases/get-user-profile";
import {hash} from "bcryptjs";

let userRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe('Get User Profile Use Case', () => {
    beforeEach(() => {
        userRepository = new InMemoryUsersRepository()
        sut = new GetUserProfileUseCase(userRepository)
    })

    it('should be able to get user profile', async () => {
        const createdUser = await userRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('123456', 6),
        })

        const {user} = await sut.execute({
            userId: createdUser.id
        })

        expect(user.name).toEqual('John Doe')
    })

    it('should not be able to authenticate with wrong email', async () => {
        expect(() => sut.execute({
            userId: 'non-exists-id'
        })).rejects.toBeInstanceOf(ResourceNotFoundError)
    })
})
