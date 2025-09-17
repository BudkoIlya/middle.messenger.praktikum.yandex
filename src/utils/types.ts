export type PlainObject<T = unknown> = { [k in string]: T };
export type Indexed<T = unknown> = Record<string, T>;
export type AnyObject = { [K in PropertyKey]?: unknown };
