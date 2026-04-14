export interface NameParts {
  firstName?: string | null;
  lastName?: string | null;
}

export function buildFullName(user: NameParts): string {
  return [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
}

export function getNameInitial(user: NameParts): string {
  const fullName = buildFullName(user);
  return fullName ? fullName.charAt(0).toUpperCase() : '?';
}
