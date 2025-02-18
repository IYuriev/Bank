import { Injectable } from '@nestjs/common';
import { COOKIE } from 'src/constants/enums/cookie';

@Injectable()
export class CookieService {
  setUserCookie(res, token: string) {
    res.cookie(COOKIE.TYPE, token, {
      httpOnly: true,
      secure: false,
      sameSite: COOKIE.SAME_SITE,
      maxAge: COOKIE.MAX_AGE,
    });
  }
}
