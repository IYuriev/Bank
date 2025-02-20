import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { TransactionType } from 'src/constants/enums/transactionType';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(dto: CreateUserDto) {
    const { password, ...userData } = dto;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashPassword,
      },
    });
    const payload = {
      user_id: user.id,
      sub: user.id,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);
    return token;
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async getHistory(userId: number) {
    return this.prisma.transaction.findMany({
      where: {
        userId: userId,
        type: TransactionType.CONTRUBUTION,
      },
    });
  }

  async blockUser(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { isBlocked: true },
    });
  }

  async unblockUser(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { isBlocked: false },
    });
  }
}
