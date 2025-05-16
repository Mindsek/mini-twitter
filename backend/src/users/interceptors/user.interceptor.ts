import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../entities/user.entity';

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UserInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<UserResponse | UserResponse[] | null> {
    return next.handle().pipe(
      map((data: User | User[] | null) => {
        if (Array.isArray(data)) {
          return data
            .map((user) => this.excludePassword(user))
            .filter((user): user is UserResponse => user !== null);
        }
        return this.excludePassword(data);
      }),
    );
  }

  private excludePassword(user: User | null): UserResponse | null {
    if (!user) return null;
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
