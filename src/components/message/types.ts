export interface IMessage {
  class?: string;
  text: string;
  time: string;
  needStatus?: boolean;
  styles?: CSSModuleClasses;
  [key: string]: unknown;
}
