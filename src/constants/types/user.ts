import { Role } from '../enums/role';

export interface IUser {
  id: number;
  email: string;
  password: string;
  role: Role;
  isBlocked: boolean;
}
