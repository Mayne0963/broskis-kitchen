import { User } from 'firebase/auth';

export const checkUserRole = async (user: User, roles: string[]) => {
  const token = await user.getIdTokenResult();
  return roles.includes(token.claims?.role);
};