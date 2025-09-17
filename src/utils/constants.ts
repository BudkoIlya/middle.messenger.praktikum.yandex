export type InputsName =
  | 'first_name'
  | 'second_name'
  | 'login'
  | 'display_name'
  | 'email'
  | 'password'
  | 'newPassword'
  | 'oldPassword'
  | 'confirmPassword'
  | 'phone'
  | 'message';

export const COMMON_REG_EXP = {
  password: /^(?=.*[A-ZА-ЯЁ])(?=.*\d)\S{8,40}$/,
  name: /^[A-ZА-ЯЁ][A-Za-zА-Яа-яЁё-]*$/,
  textWithNumber: /^(?!\d+$)[A-Za-zА-Яа-яЁё0-9]+$/, // не могут быть только числа
};

export const REG_EXP_BY_INPUT_NAME: Record<InputsName, RegExp> = {
  first_name: COMMON_REG_EXP.name,
  second_name: COMMON_REG_EXP.name,
  login: /^(?=.*[A-Za-z])[A-Za-z0-9_-]{3,20}$/,
  display_name: /^(?=.*[A-Za-z])[A-Za-z0-9_-]{3,20}$/,
  email: /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$/,
  password: COMMON_REG_EXP.password,
  newPassword: COMMON_REG_EXP.password,
  confirmPassword: COMMON_REG_EXP.password,
  oldPassword: COMMON_REG_EXP.password,
  phone: /^\+?\d{10,15}$/,
  message: /.+/,
};
