import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';
import { verifyToken } from '../modules/Auth/auth.utils';

const auth = (...requiredRoles: TUserRole[]) => {
  // rest operator makes an Array
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!'); // browser token aneni, tai jate browser refreshToken diye notun accessToken ney o sheta niye ashe
    }

    // checking if the given token is valid
    const decoded = verifyToken(token, config.jwt.jwt_access_secret as string); // accessToken er meyad sesh tai jate browser refreshToken diye notun accessToken ney

    const { role, userId, iat } = decoded;

    // checking if the user is exist
    const user = await User.isUserExistsByCustomId(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
    }

    // checking if the user is already deleted
    const isDeleted = user.isDeleted;
    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
    }

    // checking if the user is blocked
    const userStatus = user.status;
    if (userStatus === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
    }

    // checking if any hacker using a token even-after the user changed the password
    if (
      user.passwordChangedAt &&
      (await User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number,
      ))
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    } // password change hoyeche tai jate browser refreshToken diye notun accessToken ney

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized yet!',
      );
    } // ei route a user er access nei, tai kono vul hole jate browser refreshToken diye notun accessToken ney

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
