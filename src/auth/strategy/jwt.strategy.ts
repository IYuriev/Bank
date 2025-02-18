import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import 'dotenv/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req.cookies?.jwt || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: String(process.env.SECRET_KEY),
    });
  }

  async validate(payload: any) {
    return { user_id: payload.sub, role: payload.role };
  }
}
