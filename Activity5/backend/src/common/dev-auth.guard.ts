import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class DevAuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    // quick dev user — adjust id/username to a real user in your DB if needed
    req.user = { id: 1, username: 'dev' };
    return true;
  }
}