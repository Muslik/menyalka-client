import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const resources = {
  en: {
    translation: {
      errors: {
        internalServerError: {
          title: 'Something Went Wrong',
          description: 'We encountered an unexpected error. Please try again later',
        },
      },
      notification: {
        info: 'Info',
        success: 'Success',
        error: 'Error',
      },
      rules: {
        title: 'Terms of Service',
        description: 'By creating an account, you agree to our Terms of Service',
      },
      signUp: {
        title: 'Sign Up',
        description: 'Create an account to continue',
        submit: 'Sign Up',
      },
      username: {
        title: 'Username',
        placeholder: 'Enter username',
      },
      description: {
        title: 'Description',
        placeholder: 'Enter description',
      },
      sex: {
        title: 'Sex',
        none: 'Not specified',
        male: 'Male',
        female: 'Female',
      },
      validation: {
        username: {
          minLength: 'Username must be at least {{val}} characters long',
          maxLength: 'Username must be at most {{val}} characters long',
          matches: 'Username must contain only letters, numbers, dashes and underscores',
          unique: 'This username is already taken. Please choose another',
          letters: 'Username must contain at least one letter',
        },
        description: {
          maxLength: 'Description must be at most {{val}} characters long',
        },
      },
    },
  },
  ru: {
    translation: {
      errors: {
        internalServerError: {
          title: 'Что-то пошло не так',
          description: 'Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже',
        },
      },
      notification: {
        info: 'Информация',
        success: 'Успешно',
        error: 'Ошибка',
      },
      rules: {
        title: 'Правила пользования сервисом',
        description: 'Создавая аккаунт, вы соглашаетесь с нашими правилами пользования сервисом',
      },
      signUp: {
        title: 'Регистрация',
        description: 'Создайте аккаунт, чтобы продолжить',
        submit: 'Зарегистрироваться',
      },
      username: {
        title: 'Имя пользователя',
        placeholder: 'Введите имя пользователя',
      },
      description: {
        title: 'Описание',
        placeholder: 'Введите описание',
      },
      sex: {
        title: 'Пол',
        none: 'Не указан',
        male: 'Мужской',
        female: 'Женский',
      },
      validation: {
        username: {
          minLength: 'Имя пользователя должно быть не менее {{val}} символов',
          maxLength: 'Имя пользователя должно быть не более {{val}} символов',
          matches: 'Имя пользователя должно содержать только буквы, цифры, дефисы и подчеркивания',
          unique: 'Это имя пользователя уже занято. Пожалуйста, выберите другое',
          letters: 'Имя пользователя должно содержать хотя бы одну букву',
        },
        description: {
          maxLength: 'Описание должно быть не более {{val}} символов',
        },
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ru',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
