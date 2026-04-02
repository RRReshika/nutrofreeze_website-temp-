export type AdminPermissionKey = `${string}:${string}`;

export type AdminProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
};

export type AdminTokenPayload = {
  sub: string;
  email: string;
  type: 'admin';
};
