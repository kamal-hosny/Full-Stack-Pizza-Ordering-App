import { Pages } from "@/constants/enums";
import { IFormField, IFormFieldsVariables } from "@/types/app";
import { Translations } from "@/types/translations";

interface Props extends IFormFieldsVariables {
  // slug: any
  translations?: Translations;
}

const useFormFields = ({ slug, translations }: Props) => {
  const loginFields = (): IFormField[] => [
    {
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "Enter your email",
      autoFocus: true,
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      placeholder: "Enter your password",
    },
  ];

  const signupFields = (): IFormField[] => [
    {
      label: translations?.auth.register.name.label,
      name: "name",
      type: "text",
      placeholder: translations?.auth.register.name.placeholder,
      autoFocus: true,
    },
    {
      label: translations?.auth.register.email.label,
      name: "email",
      type: "email",
      placeholder: translations?.auth.register.email.placeholder,
    },
    {
      label: translations?.auth.register.password.label,
      name: "password",
      type: "password",
      placeholder: translations?.auth.register.password.placeholder,
    },
    {
      label: translations?.auth.register.confirmPassword.label,
      name: "confirmPassword",
      type: "password",
      placeholder: translations?.auth.register.confirmPassword.placeholder,
    },
  ]

  const getFormFields = (): IFormField[] => {
    switch (slug) {
      case Pages.LOGIN:
        return loginFields();
        case Pages.Register:
          return signupFields();
      default:
        return [];
    }
  };
  return {
    getFormFields,
  };
};

export default useFormFields;
