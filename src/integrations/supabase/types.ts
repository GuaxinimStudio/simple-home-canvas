export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      contatos_cidadaos: {
        Row: {
          created_at: string
          gabinetes_ids: string[]
          id: string
          nome: string
          telefone: string
        }
        Insert: {
          created_at?: string
          gabinetes_ids?: string[]
          id?: string
          nome: string
          telefone: string
        }
        Update: {
          created_at?: string
          gabinetes_ids?: string[]
          id?: string
          nome?: string
          telefone?: string
        }
        Relationships: []
      }
      gabinetes: {
        Row: {
          created_at: string
          estado: string | null
          gabinete: string
          id: string
          municipio: string | null
          responsavel: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          estado?: string | null
          gabinete: string
          id?: string
          municipio?: string | null
          responsavel?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          estado?: string | null
          gabinete?: string
          id?: string
          municipio?: string | null
          responsavel?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      notificacao: {
        Row: {
          arquivo_tipo: string | null
          arquivo_url: string | null
          created_at: string
          gabinete_id: string | null
          id: string
          informacao: string
          telefones: string[]
          updated_at: string
        }
        Insert: {
          arquivo_tipo?: string | null
          arquivo_url?: string | null
          created_at?: string
          gabinete_id?: string | null
          id?: string
          informacao: string
          telefones?: string[]
          updated_at?: string
        }
        Update: {
          arquivo_tipo?: string | null
          arquivo_url?: string | null
          created_at?: string
          gabinete_id?: string | null
          id?: string
          informacao?: string
          telefones?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificacao_gabinete_id_fkey"
            columns: ["gabinete_id"]
            isOneToOne: false
            referencedRelation: "gabinetes"
            referencedColumns: ["id"]
          },
        ]
      }
      problemas: {
        Row: {
          created_at: string
          descricao: string
          descricao_resolvido: string | null
          dias_atraso_resolucao: number | null
          foto_url: string | null
          gabinete_id: string | null
          id: string
          imagem_resolvido: string | null
          municipio: string | null
          notificado_prazo_estourado: boolean | null
          prazo_alteracoes: number | null
          prazo_estimado: string | null
          resolvido_no_prazo: boolean | null
          resposta_enviada: boolean | null
          status: string
          telefone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao: string
          descricao_resolvido?: string | null
          dias_atraso_resolucao?: number | null
          foto_url?: string | null
          gabinete_id?: string | null
          id?: string
          imagem_resolvido?: string | null
          municipio?: string | null
          notificado_prazo_estourado?: boolean | null
          prazo_alteracoes?: number | null
          prazo_estimado?: string | null
          resolvido_no_prazo?: boolean | null
          resposta_enviada?: boolean | null
          status?: string
          telefone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string
          descricao_resolvido?: string | null
          dias_atraso_resolucao?: number | null
          foto_url?: string | null
          gabinete_id?: string | null
          id?: string
          imagem_resolvido?: string | null
          municipio?: string | null
          notificado_prazo_estourado?: boolean | null
          prazo_alteracoes?: number | null
          prazo_estimado?: string | null
          resolvido_no_prazo?: boolean | null
          resposta_enviada?: boolean | null
          status?: string
          telefone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "problemas_gabinete_id_fkey"
            columns: ["gabinete_id"]
            isOneToOne: false
            referencedRelation: "gabinetes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          cidade: string | null
          created_at: string
          email: string | null
          gabinete_id: string | null
          id: string
          nome: string | null
          role: Database["public"]["Enums"]["user_role"]
          senha: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cidade?: string | null
          created_at?: string
          email?: string | null
          gabinete_id?: string | null
          id: string
          nome?: string | null
          role: Database["public"]["Enums"]["user_role"]
          senha?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cidade?: string | null
          created_at?: string
          email?: string | null
          gabinete_id?: string | null
          id?: string
          nome?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          senha?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_gabinete_id_fkey"
            columns: ["gabinete_id"]
            isOneToOne: false
            referencedRelation: "gabinetes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "administrador" | "vereador"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["administrador", "vereador"],
    },
  },
} as const
