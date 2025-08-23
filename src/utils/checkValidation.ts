// import type { IEventProps } from '../common/Block/Block';
//
// type InputsName =
//   | 'first_name'
//   | 'second_name'
//   | 'login'
//   | 'email'
//   | 'password'
//   | 'phone'
//   | 'confirm_password'
//   | 'new_password';
//
// const listenerFn = (_setProps: IEventProps['setProps']) => (_e: Event) => {
//   // e.preventDefault();
//   // TODO: здесь должна происходить валидация, которая добавляет класс с ошибкой
//   // const path = el.getAttribute(attribute) || '/';
//   // const target = e.target as HTMLInputElement;
//   // console.log(target.value);
//   // setProps
// };
//
// const checkValidationListener = (
//   element: Element,
//   selector: string,
//   remove = false,
//   setProps: IEventProps['setProps'],
// ) => {
//   const el = element.querySelector(selector);
//   if (!el) return;
//
//   if (remove) {
//     el.removeEventListener('blur', listenerFn(setProps));
//     return;
//   }
//
//   el.addEventListener('blur', listenerFn(setProps));
// };
//
// type ICheckValidationByFields = (props: any, inputNames: InputsName[]) => void;
//
// export const checkValidationByFields: ICheckValidationByFields = (
//   { element, remove, setProps },
//   inputNames: InputsName[],
// ) => {
//   inputNames.forEach((name) => {
//     checkValidationListener(element, `input[name=${name}]`, remove, setProps);
//   });
// };

export const checkValidationByFields = () => {};
