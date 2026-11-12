import bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'node:crypto';
import nodemailer from 'nodemailer';
import { UserRepository, type CreateUserInput } from '../repositories/userRepository.ts';
import { AppError } from '../errors/AppError.ts';
import { UnauthorizedError } from '../errors/UnauthorizedError.ts';
import { signToken, type AuthUser } from './tokenService.ts';
import type { ForgotPasswordInput, LoginInput, RegisterInput, ResetPasswordInput } from '../schemas/authSchema.ts';

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

  async requestPasswordReset(input: ForgotPasswordInput): Promise<string | undefined> {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, FRONTEND_URL } = process.env;
    const smtpConfigured = Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASSWORD && SMTP_FROM);
    const developmentResetLink = process.env.NODE_ENV === 'development' && !smtpConfigured;
    if (!smtpConfigured && !developmentResetLink) {
      throw new AppError(503, 'Layanan pemulihan password belum dikonfigurasi');
    }

    const user = await this.userRepository.findByEmail(input.email);
    if (!user) return;

    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await this.userRepository.setPasswordResetToken(user.email, tokenHash, expiresAt);

    const resetUrl = new URL('/reset-password', FRONTEND_URL ?? 'http://localhost:5173');
    resetUrl.searchParams.set('token', token);

    if (developmentResetLink) return resetUrl.toString();

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    });
    try {
      await transporter.sendMail({
        from: SMTP_FROM,
        to: user.email,
        subject: 'Atur ulang password akun',
        text: `Gunakan tautan berikut untuk mengatur ulang password. Tautan berlaku selama 1 jam: ${resetUrl.toString()}`,
        html: `<p>Gunakan tautan berikut untuk mengatur ulang password. Tautan berlaku selama 1 jam:</p><p><a href="${resetUrl.toString()}">Atur ulang password</a></p>`,
      });
    } catch {
      console.error('Password reset email delivery failed');
      throw new AppError(503, 'Email reset password gagal dikirim. Silakan coba lagi nanti.');
    }
  }

  async resetPassword(input: ResetPasswordInput) {
    const tokenHash = createHash('sha256').update(input.token).digest('hex');
    const passwordHash = await bcrypt.hash(input.password, 12);
    const updated = await this.userRepository.consumePasswordReset(tokenHash, passwordHash);
    if (!updated.length) throw new AppError(400, 'Tautan reset tidak valid atau sudah kedaluwarsa');
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