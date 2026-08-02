import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;

export const registerUserFormSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "O primeiro nome é obrigatório"),

    lastName: z
      .string()
      .trim()
      .min(1, "O último nome é obrigatório"),

    email: z
      .string()
      .trim()
      .min(1, "O e-mail é obrigatório")
      .refine(
        (value) => z.email().safeParse(value).success,
        { message: "E-mail inválido" }
      ),

    password: z
      .string()
      .min(1, "A senha é obrigatória")
      .min(8, "A senha deve ter no mínimo 8 caracteres"),

    confirmPassword: z
      .string()
      .min(1, "Confirme sua senha"),

    cpf: z
      .string()
      .trim()
      .min(1, "O CPF é obrigatório")
      .regex(cpfRegex, "CPF inválido"),

    birthDate: z
      .string()
      .trim()
      .min(1, "A data de nascimento é obrigatória")
      .refine((date) => {
        const parsedDate = new Date(date);

        return (
          !isNaN(parsedDate.getTime()) &&
          parsedDate <= new Date()
        );
      }, {
        message: "Data de nascimento inválida",
      }),

    cellphone: z
      .string()
      .trim()
      .min(1, "Telefone é obrigatório"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem",
  });

type RegisterFormData = z.infer<typeof registerUserFormSchema>;

export const useRegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerUserFormSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: ""
    },
    criteriaMode: "all"
  })

  return {
    handleSubmit,
    register,
    errors,
    isSubmitting,
    setError,
    reset,
  }
}