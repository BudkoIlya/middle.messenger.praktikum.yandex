export const typedObjectEntries = <T extends object>(obj: T): [[keyof T, T[keyof T]]] =>
  Object.entries(obj) as [[keyof T, T[keyof T]]];
