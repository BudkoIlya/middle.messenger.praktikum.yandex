export interface IButton {
  text: string;
  type?: HTMLButtonElement['type'];
  className?: string;
  id?: string;
  path?: string;
  name?: string;
  [key: string]: unknown;
}
