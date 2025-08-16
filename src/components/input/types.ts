export interface IInput {
  title: string;
  name: string;
  disabled?: string;
  accept?: string;
  type?: HTMLInputElement['type'];
  class?: string;
  placeholder?: string;
  value?: string;
}
