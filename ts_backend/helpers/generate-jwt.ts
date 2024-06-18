import jwt from 'jsonwebtoken';
import { User } from '../models/index'; // Assuming User model import

interface JwtPayload {
  uid: string; // Type for the payload data
}

const generateJwt = async (uid = ''): Promise<string | null> => {
  try {
    const payload: JwtPayload = { uid };
    const token = jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
      expiresIn: '7d',
    });
    return token;
  } catch (error) {
    console.error('Error generating JWT:', error);
    return null;
  }
};

const verifyToken = async (token = ''): Promise<User | null> => {
  try {
    if (token.length < 10) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY) as JwtPayload; // Type assertion for decoded payload
    const usuario = await User.findById(decoded.uid); // Access uid using destructuring

    return usuario ?? null; // Nullish coalescing for optional chaining safety
  } catch (error) {
    console.error('Error verifying JWT:', error);
    return null;
  }
};

export { generateJwt, verifyToken };
