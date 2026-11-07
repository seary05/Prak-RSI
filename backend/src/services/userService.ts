import bcrypt from 'bcryptjs';
import { UserRepository, type CreateUserInput } from '../repositories/userRepository.ts';
import { AppError } from '../errors/AppError.ts';
import { UnauthorizedError } from '../errors/UnauthorizedError.ts';
import { signToken, type AuthUser } from './tokenService.ts';
import type { LoginInput, RegisterInput } from '../schemas/authSchema.ts';

export class UserService {
  constructor(private userRepository: UserRepository = new UserRepository()) {}

  getUsers() {
    return this.userRepository.findAll();
  }

  async register(input: RegisterInput) {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) throw new AppError(409, 'Email sudah terdaftar');

    const passwordHash = await bcrypt.hash(input.password, 12);
    return this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: 'customer',
    });
  }

  async login(input: LoginInput) {
    const row = await this.userRepository.findByEmail(input.email);
    if (!row || !(await bcrypt.compare(input.password, row.passwordHash))) {
      throw new UnauthorizedError('Email atau password salah');
    }

    const user: AuthUser = {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role as AuthUser['role'],
    };
    return {
      token: signToken(user),
      tokenType: 'Bearer' as const,
      expiresIn: process.env.JWT_EXPIRES_IN ?? '2h',
      user,
    };
  }

  async createUser(input: Omit<CreateUserInput, 'passwordHash'> & { password: string }) {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) throw new AppError(409, 'Email sudah terdaftar');
    const passwordHash = await bcrypt.hash(input.password, 12);
    return this.userRepository.create({
      name: input.name,
      email: input.email,
      role: input.role,
      passwordHash,
    });
  }
}