
import * as z from 'zod';

// Definimos aqui o tipo específico para o role
export type UserRole = "vereador" | "administrador";

export const formSchema = z.object({
  nome: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }),
  telefone: z.string().optional().nullable(),
  role: z.enum(["vereador", "administrador"]), // Usando z.enum para garantir que apenas esses valores sejam aceitos
  gabinete_id: z.string().optional().nullable(),
});

export type UsuarioFormValues = z.infer<typeof formSchema>;
