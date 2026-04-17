import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { admin } from "../firebase/firebase.config";

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("No token provided");
    }

    const token = authHeader.split(" ")[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      request.user = decodedToken;
      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}