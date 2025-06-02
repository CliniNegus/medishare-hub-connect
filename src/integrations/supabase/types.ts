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
      bookings: {
        Row: {
          created_at: string
          end_time: string
          equipment_id: string
          id: string
          notes: string | null
          price_paid: number
          start_time: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_time: string
          equipment_id: string
          id?: string
          notes?: string | null
          price_paid?: number
          start_time: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_time?: string
          equipment_id?: string
          id?: string
          notes?: string | null
          price_paid?: number
          start_time?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          external_id: string | null
          id: string
          metadata: Json | null
          name: string
          organization_id: string | null
          phone: string | null
          source: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          external_id?: string | null
          id?: string
          metadata?: Json | null
          name: string
          organization_id?: string | null
          phone?: string | null
          source?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          external_id?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          organization_id?: string | null
          phone?: string | null
          source?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment: {
        Row: {
          category: string | null
          condition: string | null
          created_at: string
          description: string | null
          downtime_hours: number | null
          id: string
          image_url: string | null
          lease_rate: number | null
          location: string | null
          manufacturer: string | null
          model: string | null
          name: string
          owner_id: string | null
          payment_status: string | null
          price: number | null
          quantity: number | null
          remote_control_enabled: boolean | null
          revenue_generated: number | null
          sales_option: string | null
          serial_number: string | null
          shop_id: string | null
          specs: string | null
          status: string | null
          updated_at: string
          usage_hours: number | null
        }
        Insert: {
          category?: string | null
          condition?: string | null
          created_at?: string
          description?: string | null
          downtime_hours?: number | null
          id?: string
          image_url?: string | null
          lease_rate?: number | null
          location?: string | null
          manufacturer?: string | null
          model?: string | null
          name: string
          owner_id?: string | null
          payment_status?: string | null
          price?: number | null
          quantity?: number | null
          remote_control_enabled?: boolean | null
          revenue_generated?: number | null
          sales_option?: string | null
          serial_number?: string | null
          shop_id?: string | null
          specs?: string | null
          status?: string | null
          updated_at?: string
          usage_hours?: number | null
        }
        Update: {
          category?: string | null
          condition?: string | null
          created_at?: string
          description?: string | null
          downtime_hours?: number | null
          id?: string
          image_url?: string | null
          lease_rate?: number | null
          location?: string | null
          manufacturer?: string | null
          model?: string | null
          name?: string
          owner_id?: string | null
          payment_status?: string | null
          price?: number | null
          quantity?: number | null
          remote_control_enabled?: boolean | null
          revenue_generated?: number | null
          sales_option?: string | null
          serial_number?: string | null
          shop_id?: string | null
          specs?: string | null
          status?: string | null
          updated_at?: string
          usage_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "manufacturer_shops"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_analytics: {
        Row: {
          created_at: string | null
          date_recorded: string | null
          downtime_hours: number | null
          equipment_id: string
          id: string
          last_location: string | null
          revenue_generated: number | null
          updated_at: string | null
          usage_hours: number | null
        }
        Insert: {
          created_at?: string | null
          date_recorded?: string | null
          downtime_hours?: number | null
          equipment_id: string
          id?: string
          last_location?: string | null
          revenue_generated?: number | null
          updated_at?: string | null
          usage_hours?: number | null
        }
        Update: {
          created_at?: string | null
          date_recorded?: string | null
          downtime_hours?: number | null
          equipment_id?: string
          id?: string
          last_location?: string | null
          revenue_generated?: number | null
          updated_at?: string | null
          usage_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_analytics_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      hospital_clusters: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          region: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          region: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          region?: string
          updated_at?: string
        }
        Relationships: []
      }
      hospitals: {
        Row: {
          address: string
          cluster_id: string | null
          created_at: string | null
          id: string
          latitude: number
          longitude: number
          name: string
          phone: string | null
          updated_at: string | null
          website: string | null
          working_hours: string | null
        }
        Insert: {
          address: string
          cluster_id?: string | null
          created_at?: string | null
          id?: string
          latitude: number
          longitude: number
          name: string
          phone?: string | null
          updated_at?: string | null
          website?: string | null
          working_hours?: string | null
        }
        Update: {
          address?: string
          cluster_id?: string | null
          created_at?: string | null
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          phone?: string | null
          updated_at?: string | null
          website?: string | null
          working_hours?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hospitals_cluster_id_fkey"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "hospital_clusters"
            referencedColumns: ["id"]
          },
        ]
      }
      investments: {
        Row: {
          amount: number
          created_at: string
          date: string
          equipment_id: string | null
          hospital_id: string | null
          id: string
          investor_id: string
          notes: string | null
          roi: number
          status: string
          term: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          date?: string
          equipment_id?: string | null
          hospital_id?: string | null
          id?: string
          investor_id: string
          notes?: string | null
          roi: number
          status?: string
          term: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          equipment_id?: string | null
          hospital_id?: string | null
          id?: string
          investor_id?: string
          notes?: string | null
          roi?: number
          status?: string
          term?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "investments_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      leases: {
        Row: {
          created_at: string
          end_date: string | null
          equipment_id: string | null
          hospital_id: string | null
          id: string
          investor_id: string | null
          monthly_payment: number | null
          start_date: string | null
          status: string | null
          total_value: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          equipment_id?: string | null
          hospital_id?: string | null
          id?: string
          investor_id?: string | null
          monthly_payment?: number | null
          start_date?: string | null
          status?: string | null
          total_value?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          equipment_id?: string | null
          hospital_id?: string | null
          id?: string
          investor_id?: string | null
          monthly_payment?: number | null
          start_date?: string | null
          status?: string | null
          total_value?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leases_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leases_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leases_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance: {
        Row: {
          completed_date: string | null
          created_at: string
          created_by: string | null
          description: string | null
          equipment_id: string | null
          id: string
          scheduled_date: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          completed_date?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          equipment_id?: string | null
          id?: string
          scheduled_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          completed_date?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          equipment_id?: string | null
          id?: string
          scheduled_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_alerts: {
        Row: {
          created_at: string
          equipment_id: string | null
          equipment_name: string
          id: string
          issue_description: string
          issue_type: string
          last_service_date: string | null
          location: string
          resolved_at: string | null
          scheduled_maintenance_date: string | null
          status: string
          updated_at: string
          urgency: string
        }
        Insert: {
          created_at?: string
          equipment_id?: string | null
          equipment_name: string
          id?: string
          issue_description: string
          issue_type: string
          last_service_date?: string | null
          location: string
          resolved_at?: string | null
          scheduled_maintenance_date?: string | null
          status?: string
          updated_at?: string
          urgency?: string
        }
        Update: {
          created_at?: string
          equipment_id?: string | null
          equipment_name?: string
          id?: string
          issue_description?: string
          issue_type?: string
          last_service_date?: string | null
          location?: string
          resolved_at?: string | null
          scheduled_maintenance_date?: string | null
          status?: string
          updated_at?: string
          urgency?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_alerts_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      manufacturer_payouts: {
        Row: {
          amount: number
          blockchain_tx_hash: string | null
          created_at: string | null
          currency: string | null
          id: string
          manufacturer_id: string
          payout_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          blockchain_tx_hash?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          manufacturer_id: string
          payout_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          blockchain_tx_hash?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          manufacturer_id?: string
          payout_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "manufacturer_payouts_manufacturer_id_fkey"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      manufacturer_shops: {
        Row: {
          country: string
          created_at: string | null
          description: string | null
          id: string
          logo_url: string | null
          manufacturer_id: string
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          country: string
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          manufacturer_id: string
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          country?: string
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          manufacturer_id?: string
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "manufacturer_shops_manufacturer_id_fkey"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          equipment_id: string | null
          id: string
          notes: string | null
          payment_method: string
          shipping_address: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          equipment_id?: string | null
          id?: string
          notes?: string | null
          payment_method: string
          shipping_address: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          equipment_id?: string | null
          id?: string
          notes?: string | null
          payment_method?: string
          shipping_address?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          dimensions: Json | null
          id: string
          image_url: string | null
          is_disposable: boolean | null
          is_featured: boolean | null
          manufacturer: string | null
          name: string
          price: number
          rating: number | null
          sku: string | null
          stock_quantity: number
          tags: string[] | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          dimensions?: Json | null
          id?: string
          image_url?: string | null
          is_disposable?: boolean | null
          is_featured?: boolean | null
          manufacturer?: string | null
          name: string
          price: number
          rating?: number | null
          sku?: string | null
          stock_quantity?: number
          tags?: string[] | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          dimensions?: Json | null
          id?: string
          image_url?: string | null
          is_disposable?: boolean | null
          is_featured?: boolean | null
          manufacturer?: string | null
          name?: string
          price?: number
          rating?: number | null
          sku?: string | null
          stock_quantity?: number
          tags?: string[] | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_new_user: boolean | null
          last_active: string | null
          location: string | null
          logo_url: string | null
          organization: string | null
          phone: string | null
          role: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_new_user?: boolean | null
          last_active?: string | null
          location?: string | null
          logo_url?: string | null
          organization?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_new_user?: boolean | null
          last_active?: string | null
          location?: string | null
          logo_url?: string | null
          organization?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      support_conversations: {
        Row: {
          created_at: string
          id: string
          message: string
          sender_id: string
          sender_type: string
          support_request_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          sender_id: string
          sender_type: string
          support_request_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          sender_id?: string
          sender_type?: string
          support_request_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_conversations_support_request_id_fkey"
            columns: ["support_request_id"]
            isOneToOne: false
            referencedRelation: "support_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      support_requests: {
        Row: {
          admin_id: string | null
          admin_response: string | null
          assigned_admin_id: string | null
          created_at: string
          file_url: string | null
          id: string
          message: string
          priority: string | null
          resolved_at: string | null
          status: string | null
          subject: string
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_id?: string | null
          admin_response?: string | null
          assigned_admin_id?: string | null
          created_at?: string
          file_url?: string | null
          id?: string
          message: string
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
          subject: string
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_id?: string | null
          admin_response?: string | null
          assigned_admin_id?: string | null
          created_at?: string
          file_url?: string | null
          id?: string
          message?: string
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
          subject?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          paystack_reference: string | null
          reference: string
          status: Database["public"]["Enums"]["payment_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          paystack_reference?: string | null
          reference: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          paystack_reference?: string | null
          reference?: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_mfa: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          updated_at: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          updated_at?: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          updated_at?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_admin_user: {
        Args: {
          admin_email: string
          admin_password: string
          full_name?: string
        }
        Returns: string
      }
      create_order: {
        Args: { order_data: Json }
        Returns: {
          amount: number
          created_at: string
          equipment_id: string | null
          id: string
          notes: string | null
          payment_method: string
          shipping_address: string
          status: string
          updated_at: string
          user_id: string | null
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      update_user_last_active: {
        Args: { user_uuid: string }
        Returns: undefined
      }
    }
    Enums: {
      payment_status: "pending" | "success" | "failed"
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
      payment_status: ["pending", "success", "failed"],
    },
  },
} as const
