export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_actions: {
        Row: {
          action_type: string
          admin_id: string | null
          created_at: string | null
          details: Json | null
          id: string
          target_user_email: string | null
          target_user_id: string | null
          target_user_name: string | null
        }
        Insert: {
          action_type: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          target_user_email?: string | null
          target_user_id?: string | null
          target_user_name?: string | null
        }
        Update: {
          action_type?: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          target_user_email?: string | null
          target_user_id?: string | null
          target_user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_actions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_actions_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      archived_data: {
        Row: {
          archived_at: string
          archived_by: string
          data: Json
          id: string
          reason: string | null
          record_id: string
          table_name: string
        }
        Insert: {
          archived_at?: string
          archived_by: string
          data: Json
          id?: string
          reason?: string | null
          record_id: string
          table_name: string
        }
        Update: {
          archived_at?: string
          archived_by?: string
          data?: Json
          id?: string
          reason?: string | null
          record_id?: string
          table_name?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
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
      catalog_upload_logs: {
        Row: {
          catalog_type: string
          completed_at: string | null
          created_at: string
          error_details: Json | null
          file_name: string
          file_type: string
          id: string
          manufacturer_id: string
          records_created: number
          records_failed: number
          records_skipped: number
          records_updated: number
          upload_mode: string
        }
        Insert: {
          catalog_type: string
          completed_at?: string | null
          created_at?: string
          error_details?: Json | null
          file_name: string
          file_type: string
          id?: string
          manufacturer_id: string
          records_created?: number
          records_failed?: number
          records_skipped?: number
          records_updated?: number
          upload_mode: string
        }
        Update: {
          catalog_type?: string
          completed_at?: string | null
          created_at?: string
          error_details?: Json | null
          file_name?: string
          file_type?: string
          id?: string
          manufacturer_id?: string
          records_created?: number
          records_failed?: number
          records_skipped?: number
          records_updated?: number
          upload_mode?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_upload_logs_manufacturer_id_fkey"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      customer_statements: {
        Row: {
          amount_paid: number
          balance_due: number
          client_name: string
          created_at: string
          date_range: string
          id: string
          invoiced_amount: number
          opening_balance: number
          updated_at: string
        }
        Insert: {
          amount_paid: number
          balance_due: number
          client_name: string
          created_at?: string
          date_range: string
          id?: string
          invoiced_amount: number
          opening_balance: number
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          balance_due?: number
          client_name?: string
          created_at?: string
          date_range?: string
          id?: string
          invoiced_amount?: number
          opening_balance?: number
          updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          phone_number: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone_number: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone_number?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      data_backups: {
        Row: {
          backup_type: string
          completed_at: string | null
          created_at: string
          created_by: string
          file_path: string | null
          file_size: string | null
          id: string
          name: string
          status: string | null
        }
        Insert: {
          backup_type: string
          completed_at?: string | null
          created_at?: string
          created_by: string
          file_path?: string | null
          file_size?: string | null
          id?: string
          name: string
          status?: string | null
        }
        Update: {
          backup_type?: string
          completed_at?: string | null
          created_at?: string
          created_by?: string
          file_path?: string | null
          file_size?: string | null
          id?: string
          name?: string
          status?: string | null
        }
        Relationships: []
      }
      deletion_requests: {
        Row: {
          account_type: string | null
          admin_notes: string | null
          completed_at: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          reason: string | null
          requested_at: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          account_type?: string | null
          admin_notes?: string | null
          completed_at?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          reason?: string | null
          requested_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          account_type?: string | null
          admin_notes?: string | null
          completed_at?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          reason?: string | null
          requested_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deletion_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deletion_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      demand_aggregations: {
        Row: {
          aggregation_date: string
          available_supply: number | null
          cluster_id: string | null
          created_at: string
          equipment_category: string
          id: string
          procurement_suggestion: Json | null
          recommended_action: string | null
          supply_gap: number | null
          total_demand: number | null
          updated_at: string
        }
        Insert: {
          aggregation_date?: string
          available_supply?: number | null
          cluster_id?: string | null
          created_at?: string
          equipment_category: string
          id?: string
          procurement_suggestion?: Json | null
          recommended_action?: string | null
          supply_gap?: number | null
          total_demand?: number | null
          updated_at?: string
        }
        Update: {
          aggregation_date?: string
          available_supply?: number | null
          cluster_id?: string | null
          created_at?: string
          equipment_category?: string
          id?: string
          procurement_suggestion?: Json | null
          recommended_action?: string | null
          supply_gap?: number | null
          total_demand?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "demand_aggregations_cluster_id_fkey"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "hospital_clusters"
            referencedColumns: ["id"]
          },
        ]
      }
      demand_forecasts: {
        Row: {
          ai_reasoning: string | null
          cluster_id: string | null
          confidence_score: number | null
          created_at: string
          demand_level: string | null
          equipment_category: string
          factors: Json | null
          forecast_date: string
          hospital_id: string | null
          id: string
          predicted_demand: number
          updated_at: string
        }
        Insert: {
          ai_reasoning?: string | null
          cluster_id?: string | null
          confidence_score?: number | null
          created_at?: string
          demand_level?: string | null
          equipment_category: string
          factors?: Json | null
          forecast_date: string
          hospital_id?: string | null
          id?: string
          predicted_demand?: number
          updated_at?: string
        }
        Update: {
          ai_reasoning?: string | null
          cluster_id?: string | null
          confidence_score?: number | null
          created_at?: string
          demand_level?: string | null
          equipment_category?: string
          factors?: Json | null
          forecast_date?: string
          hospital_id?: string | null
          id?: string
          predicted_demand?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "demand_forecasts_cluster_id_fkey"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "hospital_clusters"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          content: string
          created_at: string
          created_by: string
          id: string
          is_active: boolean | null
          name: string
          subject: string
          template_type: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean | null
          name: string
          subject: string
          template_type: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          template_type?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      email_verification_log: {
        Row: {
          attempt_count: number | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          ip_address: unknown
          sent_at: string | null
          token_hash: string
          user_agent: string | null
          user_id: string | null
          verified_at: string | null
        }
        Insert: {
          attempt_count?: number | null
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          ip_address?: unknown
          sent_at?: string | null
          token_hash: string
          user_agent?: string | null
          user_id?: string | null
          verified_at?: string | null
        }
        Update: {
          attempt_count?: number | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          ip_address?: unknown
          sent_at?: string | null
          token_hash?: string
          user_agent?: string | null
          user_id?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      equipment: {
        Row: {
          booking_count: number | null
          category: string | null
          condition: string | null
          created_at: string
          description: string | null
          downtime_hours: number | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          last_popularity_update: string | null
          lease_rate: number | null
          location: string | null
          manufacturer: string | null
          model: string | null
          name: string
          owner_id: string | null
          pay_per_use_enabled: boolean | null
          pay_per_use_price: number | null
          payment_status: string | null
          popularity_score: number | null
          price: number | null
          quantity: number | null
          remote_control_enabled: boolean | null
          revenue_generated: number | null
          sales_option: string | null
          serial_number: string | null
          shop_id: string | null
          sku: string | null
          specs: string | null
          status: string | null
          updated_at: string
          usage_hours: number | null
        }
        Insert: {
          booking_count?: number | null
          category?: string | null
          condition?: string | null
          created_at?: string
          description?: string | null
          downtime_hours?: number | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          last_popularity_update?: string | null
          lease_rate?: number | null
          location?: string | null
          manufacturer?: string | null
          model?: string | null
          name: string
          owner_id?: string | null
          pay_per_use_enabled?: boolean | null
          pay_per_use_price?: number | null
          payment_status?: string | null
          popularity_score?: number | null
          price?: number | null
          quantity?: number | null
          remote_control_enabled?: boolean | null
          revenue_generated?: number | null
          sales_option?: string | null
          serial_number?: string | null
          shop_id?: string | null
          sku?: string | null
          specs?: string | null
          status?: string | null
          updated_at?: string
          usage_hours?: number | null
        }
        Update: {
          booking_count?: number | null
          category?: string | null
          condition?: string | null
          created_at?: string
          description?: string | null
          downtime_hours?: number | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          last_popularity_update?: string | null
          lease_rate?: number | null
          location?: string | null
          manufacturer?: string | null
          model?: string | null
          name?: string
          owner_id?: string | null
          pay_per_use_enabled?: boolean | null
          pay_per_use_price?: number | null
          payment_status?: string | null
          popularity_score?: number | null
          price?: number | null
          quantity?: number | null
          remote_control_enabled?: boolean | null
          revenue_generated?: number | null
          sales_option?: string | null
          serial_number?: string | null
          shop_id?: string | null
          sku?: string | null
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
      equipment_requests: {
        Row: {
          created_at: string
          end_date: string
          equipment_id: string | null
          id: string
          notes: string | null
          owning_hospital_id: string
          purpose: string | null
          request_type: string
          requesting_hospital_id: string
          responded_at: string | null
          response_notes: string | null
          start_date: string
          status: string
          updated_at: string
          urgency: string | null
        }
        Insert: {
          created_at?: string
          end_date: string
          equipment_id?: string | null
          id?: string
          notes?: string | null
          owning_hospital_id: string
          purpose?: string | null
          request_type?: string
          requesting_hospital_id: string
          responded_at?: string | null
          response_notes?: string | null
          start_date: string
          status?: string
          updated_at?: string
          urgency?: string | null
        }
        Update: {
          created_at?: string
          end_date?: string
          equipment_id?: string | null
          id?: string
          notes?: string | null
          owning_hospital_id?: string
          purpose?: string | null
          request_type?: string
          requesting_hospital_id?: string
          responded_at?: string | null
          response_notes?: string | null
          start_date?: string
          status?: string
          updated_at?: string
          urgency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_requests_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_transfers: {
        Row: {
          agreement_id: string | null
          carrier: string | null
          condition_on_delivery: string | null
          condition_on_pickup: string | null
          condition_on_return: string | null
          created_at: string
          delivery_date: string | null
          equipment_id: string | null
          from_hospital_id: string
          id: string
          notes: string | null
          pickup_date: string | null
          request_id: string | null
          return_date: string | null
          return_scheduled_date: string | null
          scheduled_date: string
          status: string
          to_hospital_id: string
          tracking_number: string | null
          transfer_type: string
          updated_at: string
        }
        Insert: {
          agreement_id?: string | null
          carrier?: string | null
          condition_on_delivery?: string | null
          condition_on_pickup?: string | null
          condition_on_return?: string | null
          created_at?: string
          delivery_date?: string | null
          equipment_id?: string | null
          from_hospital_id: string
          id?: string
          notes?: string | null
          pickup_date?: string | null
          request_id?: string | null
          return_date?: string | null
          return_scheduled_date?: string | null
          scheduled_date: string
          status?: string
          to_hospital_id: string
          tracking_number?: string | null
          transfer_type?: string
          updated_at?: string
        }
        Update: {
          agreement_id?: string | null
          carrier?: string | null
          condition_on_delivery?: string | null
          condition_on_pickup?: string | null
          condition_on_return?: string | null
          created_at?: string
          delivery_date?: string | null
          equipment_id?: string | null
          from_hospital_id?: string
          id?: string
          notes?: string | null
          pickup_date?: string | null
          request_id?: string | null
          return_date?: string | null
          return_scheduled_date?: string | null
          scheduled_date?: string
          status?: string
          to_hospital_id?: string
          tracking_number?: string | null
          transfer_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_transfers_agreement_id_fkey"
            columns: ["agreement_id"]
            isOneToOne: false
            referencedRelation: "sharing_agreements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_transfers_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_transfers_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "equipment_requests"
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
          actual_duration: number | null
          completed_date: string | null
          cost: number | null
          created_at: string
          created_by: string | null
          description: string | null
          equipment_id: string | null
          estimated_duration: number | null
          id: string
          is_overdue: boolean | null
          maintenance_type: string | null
          priority: string | null
          scheduled_date: string | null
          status: string | null
          technician_name: string | null
          technician_notes: string | null
          updated_at: string
        }
        Insert: {
          actual_duration?: number | null
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          equipment_id?: string | null
          estimated_duration?: number | null
          id?: string
          is_overdue?: boolean | null
          maintenance_type?: string | null
          priority?: string | null
          scheduled_date?: string | null
          status?: string | null
          technician_name?: string | null
          technician_notes?: string | null
          updated_at?: string
        }
        Update: {
          actual_duration?: number | null
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          equipment_id?: string | null
          estimated_duration?: number | null
          id?: string
          is_overdue?: boolean | null
          maintenance_type?: string | null
          priority?: string | null
          scheduled_date?: string | null
          status?: string | null
          technician_name?: string | null
          technician_notes?: string | null
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
      maintenance_notifications: {
        Row: {
          created_at: string
          id: string
          is_sent: boolean | null
          maintenance_id: string | null
          message: string
          notification_type: string
          recipient_id: string | null
          scheduled_for: string
          sent_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_sent?: boolean | null
          maintenance_id?: string | null
          message: string
          notification_type: string
          recipient_id?: string | null
          scheduled_for: string
          sent_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_sent?: boolean | null
          maintenance_id?: string | null
          message?: string
          notification_type?: string
          recipient_id?: string | null
          scheduled_for?: string
          sent_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_notifications_maintenance_id_fkey"
            columns: ["maintenance_id"]
            isOneToOne: false
            referencedRelation: "maintenance"
            referencedColumns: ["id"]
          },
        ]
      }
      manufacturer_onboarding: {
        Row: {
          billing_basis: string | null
          business_model: string | null
          business_models: string[] | null
          catalog_file_url: string | null
          company_name: string | null
          contact_email: string | null
          contact_phone: string | null
          country: string | null
          created_at: string | null
          credit_limit: number | null
          current_step: number | null
          direct_payment_terms: string | null
          id: string
          maintenance_responsibility: string | null
          payment_cycle: number | null
          product_categories: string[] | null
          returns_policy: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          shop_description: string | null
          shop_logo_url: string | null
          shop_name: string | null
          status: string | null
          submitted_at: string | null
          updated_at: string | null
          usage_policy: string | null
          user_id: string
        }
        Insert: {
          billing_basis?: string | null
          business_model?: string | null
          business_models?: string[] | null
          catalog_file_url?: string | null
          company_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          credit_limit?: number | null
          current_step?: number | null
          direct_payment_terms?: string | null
          id?: string
          maintenance_responsibility?: string | null
          payment_cycle?: number | null
          product_categories?: string[] | null
          returns_policy?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          shop_description?: string | null
          shop_logo_url?: string | null
          shop_name?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          usage_policy?: string | null
          user_id: string
        }
        Update: {
          billing_basis?: string | null
          business_model?: string | null
          business_models?: string[] | null
          catalog_file_url?: string | null
          company_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          credit_limit?: number | null
          current_step?: number | null
          direct_payment_terms?: string | null
          id?: string
          maintenance_responsibility?: string | null
          payment_cycle?: number | null
          product_categories?: string[] | null
          returns_policy?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          shop_description?: string | null
          shop_logo_url?: string | null
          shop_name?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          usage_policy?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "manufacturer_onboarding_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manufacturer_onboarding_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
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
          customer_id: string | null
          equipment_id: string | null
          id: string
          notes: string | null
          payment_method: string
          shipping_address: string
          shipping_address_id: string | null
          shipping_email: string | null
          shipping_full_name: string | null
          shipping_phone_number: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          customer_id?: string | null
          equipment_id?: string | null
          id?: string
          notes?: string | null
          payment_method: string
          shipping_address: string
          shipping_address_id?: string | null
          shipping_email?: string | null
          shipping_full_name?: string | null
          shipping_phone_number?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: string | null
          equipment_id?: string | null
          id?: string
          notes?: string | null
          payment_method?: string
          shipping_address?: string
          shipping_address_id?: string | null
          shipping_email?: string | null
          shipping_full_name?: string | null
          shipping_phone_number?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "shipping_addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_showcases: {
        Row: {
          alt_text: string
          created_at: string
          description: string
          display_order: number
          id: string
          image_url: string
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          alt_text: string
          created_at?: string
          description: string
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          alt_text?: string
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          created_at: string
          dimension_name: string
          dimension_value: string
          id: string
          is_active: boolean
          price: number
          product_id: string
          stock_quantity: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          dimension_name: string
          dimension_value: string
          id?: string
          is_active?: boolean
          price: number
          product_id: string
          stock_quantity?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          dimension_name?: string
          dimension_value?: string
          id?: string
          is_active?: boolean
          price?: number
          product_id?: string
          stock_quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          base_price: number | null
          category: string | null
          created_at: string
          description: string | null
          dimensions: Json | null
          has_variants: boolean | null
          id: string
          image_url: string | null
          is_disposable: boolean | null
          is_featured: boolean | null
          manufacturer: string | null
          manufacturer_id: string | null
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
          base_price?: number | null
          category?: string | null
          created_at?: string
          description?: string | null
          dimensions?: Json | null
          has_variants?: boolean | null
          id?: string
          image_url?: string | null
          is_disposable?: boolean | null
          is_featured?: boolean | null
          manufacturer?: string | null
          manufacturer_id?: string | null
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
          base_price?: number | null
          category?: string | null
          created_at?: string
          description?: string | null
          dimensions?: Json | null
          has_variants?: boolean | null
          id?: string
          image_url?: string | null
          is_disposable?: boolean | null
          is_featured?: boolean | null
          manufacturer?: string | null
          manufacturer_id?: string | null
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
          bed_capacity: number | null
          bio: string | null
          can_restore_until: string | null
          certifications: string[] | null
          coordinates: Json | null
          created_at: string
          deleted_at: string | null
          deletion_initiated_by: string | null
          email: string
          email_verified_at: string | null
          equipment_needs: string[] | null
          financing_needs: string[] | null
          full_name: string | null
          gender: string | null
          hospital_type: string | null
          id: string
          investment_budget_range: string | null
          investment_experience: string | null
          investment_interests: string[] | null
          is_deleted: boolean | null
          is_new_user: boolean | null
          last_active: string | null
          location: string | null
          logo_url: string | null
          manufacturing_location: string | null
          onboarding_completed: boolean | null
          organization: string | null
          phone: string | null
          products_available: string[] | null
          profile_completed: boolean | null
          profile_completion_step: number | null
          profile_draft: Json | null
          role: string | null
          target_markets: string[] | null
          updated_at: string
          verification_attempts: number | null
          verification_token_sent_at: string | null
          wallet_address: string | null
          website: string | null
        }
        Insert: {
          bed_capacity?: number | null
          bio?: string | null
          can_restore_until?: string | null
          certifications?: string[] | null
          coordinates?: Json | null
          created_at?: string
          deleted_at?: string | null
          deletion_initiated_by?: string | null
          email: string
          email_verified_at?: string | null
          equipment_needs?: string[] | null
          financing_needs?: string[] | null
          full_name?: string | null
          gender?: string | null
          hospital_type?: string | null
          id: string
          investment_budget_range?: string | null
          investment_experience?: string | null
          investment_interests?: string[] | null
          is_deleted?: boolean | null
          is_new_user?: boolean | null
          last_active?: string | null
          location?: string | null
          logo_url?: string | null
          manufacturing_location?: string | null
          onboarding_completed?: boolean | null
          organization?: string | null
          phone?: string | null
          products_available?: string[] | null
          profile_completed?: boolean | null
          profile_completion_step?: number | null
          profile_draft?: Json | null
          role?: string | null
          target_markets?: string[] | null
          updated_at?: string
          verification_attempts?: number | null
          verification_token_sent_at?: string | null
          wallet_address?: string | null
          website?: string | null
        }
        Update: {
          bed_capacity?: number | null
          bio?: string | null
          can_restore_until?: string | null
          certifications?: string[] | null
          coordinates?: Json | null
          created_at?: string
          deleted_at?: string | null
          deletion_initiated_by?: string | null
          email?: string
          email_verified_at?: string | null
          equipment_needs?: string[] | null
          financing_needs?: string[] | null
          full_name?: string | null
          gender?: string | null
          hospital_type?: string | null
          id?: string
          investment_budget_range?: string | null
          investment_experience?: string | null
          investment_interests?: string[] | null
          is_deleted?: boolean | null
          is_new_user?: boolean | null
          last_active?: string | null
          location?: string | null
          logo_url?: string | null
          manufacturing_location?: string | null
          onboarding_completed?: boolean | null
          organization?: string | null
          phone?: string | null
          products_available?: string[] | null
          profile_completed?: boolean | null
          profile_completion_step?: number | null
          profile_draft?: Json | null
          role?: string | null
          target_markets?: string[] | null
          updated_at?: string
          verification_attempts?: number | null
          verification_token_sent_at?: string | null
          wallet_address?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_deletion_initiated_by_fkey"
            columns: ["deletion_initiated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          created_at: string | null
          event_details: Json | null
          event_type: string
          id: string
          ip_address: unknown
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_details?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_details?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      sharing_agreements: {
        Row: {
          borrower_hospital_id: string
          created_at: string
          daily_rate: number | null
          deposit_amount: number | null
          end_date: string
          equipment_id: string | null
          id: string
          insurance_required: boolean | null
          lender_hospital_id: string
          maintenance_responsibility: string | null
          request_id: string | null
          signed_by_borrower: boolean | null
          signed_by_lender: boolean | null
          start_date: string
          status: string
          terms: string | null
          updated_at: string
        }
        Insert: {
          borrower_hospital_id: string
          created_at?: string
          daily_rate?: number | null
          deposit_amount?: number | null
          end_date: string
          equipment_id?: string | null
          id?: string
          insurance_required?: boolean | null
          lender_hospital_id: string
          maintenance_responsibility?: string | null
          request_id?: string | null
          signed_by_borrower?: boolean | null
          signed_by_lender?: boolean | null
          start_date: string
          status?: string
          terms?: string | null
          updated_at?: string
        }
        Update: {
          borrower_hospital_id?: string
          created_at?: string
          daily_rate?: number | null
          deposit_amount?: number | null
          end_date?: string
          equipment_id?: string | null
          id?: string
          insurance_required?: boolean | null
          lender_hospital_id?: string
          maintenance_responsibility?: string | null
          request_id?: string | null
          signed_by_borrower?: boolean | null
          signed_by_lender?: boolean | null
          start_date?: string
          status?: string
          terms?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sharing_agreements_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sharing_agreements_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "equipment_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_addresses: {
        Row: {
          city: string
          country: string
          created_at: string
          customer_id: string | null
          full_address: string
          full_name: string
          id: string
          is_default: boolean | null
          phone_number: string
          street: string
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          city: string
          country: string
          created_at?: string
          customer_id?: string | null
          full_address: string
          full_name: string
          id?: string
          is_default?: boolean | null
          phone_number: string
          street: string
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          customer_id?: string | null
          full_address?: string
          full_name?: string
          id?: string
          is_default?: boolean | null
          phone_number?: string
          street?: string
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipping_addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      support_conversations: {
        Row: {
          created_at: string
          id: string
          message: string
          sender_id: string | null
          sender_type: string
          support_request_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          sender_id?: string | null
          sender_type: string
          support_request_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          sender_id?: string | null
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
        }
        Relationships: []
      }
      system_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          message_type: string | null
          priority: string | null
          read_at: string | null
          recipient_id: string | null
          recipient_role: string | null
          sender_id: string | null
          status: string | null
          subject: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          message_type?: string | null
          priority?: string | null
          read_at?: string | null
          recipient_id?: string | null
          recipient_role?: string | null
          sender_id?: string | null
          status?: string | null
          subject: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          message_type?: string | null
          priority?: string | null
          read_at?: string | null
          recipient_id?: string | null
          recipient_role?: string | null
          sender_id?: string | null
          status?: string | null
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          setting_key: string
          setting_type: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_type?: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_type?: string
          setting_value?: Json
          updated_at?: string
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
      usage_patterns: {
        Row: {
          booking_count: number | null
          created_at: string
          date_recorded: string
          day_of_week: number | null
          equipment_category: string | null
          equipment_id: string | null
          hospital_id: string | null
          id: string
          is_holiday: boolean | null
          metadata: Json | null
          patient_volume: number | null
          seasonal_factor: number | null
          usage_hours: number | null
        }
        Insert: {
          booking_count?: number | null
          created_at?: string
          date_recorded?: string
          day_of_week?: number | null
          equipment_category?: string | null
          equipment_id?: string | null
          hospital_id?: string | null
          id?: string
          is_holiday?: boolean | null
          metadata?: Json | null
          patient_volume?: number | null
          seasonal_factor?: number | null
          usage_hours?: number | null
        }
        Update: {
          booking_count?: number | null
          created_at?: string
          date_recorded?: string
          day_of_week?: number | null
          equipment_category?: string | null
          equipment_id?: string | null
          hospital_id?: string | null
          id?: string
          is_holiday?: boolean | null
          metadata?: Json | null
          patient_volume?: number | null
          seasonal_factor?: number | null
          usage_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "usage_patterns_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
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
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      archive_old_data: {
        Args: {
          cutoff_date: string
          reason_param?: string
          table_name_param: string
        }
        Returns: number
      }
      can_view_equipment_details: {
        Args: { equipment_id: string }
        Returns: boolean
      }
      check_auth_rate_limit: { Args: { user_email: string }; Returns: boolean }
      create_admin_user: {
        Args: {
          admin_email: string
          admin_password: string
          full_name?: string
        }
        Returns: string
      }
      create_data_backup: {
        Args: { backup_type_param: string; name_param: string }
        Returns: string
      }
      create_email_verification: {
        Args: {
          ip_address_param?: unknown
          token_hash_param: string
          user_agent_param?: string
          user_email: string
        }
        Returns: string
      }
      create_or_update_customer_with_shipping: {
        Args: {
          p_city: string
          p_country: string
          p_email: string
          p_full_name: string
          p_phone_number: string
          p_street: string
          p_user_id: string
          p_zip_code?: string
        }
        Returns: string
      }
      create_order: {
        Args: { order_data: Json }
        Returns: {
          amount: number
          created_at: string
          customer_id: string | null
          equipment_id: string | null
          id: string
          notes: string | null
          payment_method: string
          shipping_address: string
          shipping_address_id: string | null
          shipping_email: string | null
          shipping_full_name: string | null
          shipping_phone_number: string | null
          status: string
          updated_at: string
          user_id: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "orders"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      generate_verification_token: { Args: never; Returns: string }
      get_public_equipment: {
        Args: never
        Returns: {
          category: string
          condition: string
          created_at: string
          description: string
          id: string
          image_url: string
          location: string
          manufacturer: string
          model: string
          name: string
          sales_option: string
          specs: string
          status: string
          updated_at: string
        }[]
      }
      get_top_popular_equipment: {
        Args: { limit_count?: number }
        Returns: {
          booking_count: number
          category: string
          id: string
          image_url: string
          is_featured: boolean
          location: string
          manufacturer: string
          name: string
          popularity_score: number
          status: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_email_verified: { Args: { user_email: string }; Returns: boolean }
      log_admin_action: {
        Args: {
          action_type_param: string
          details_param?: Json
          target_user_id_param: string
        }
        Returns: string
      }
      log_audit_event: {
        Args: {
          action_param: string
          new_values_param?: Json
          old_values_param?: Json
          resource_id_param?: string
          resource_type_param: string
        }
        Returns: string
      }
      log_security_event: {
        Args: {
          event_details_param?: Json
          event_type_param: string
          ip_address_param?: unknown
          user_agent_param?: string
        }
        Returns: undefined
      }
      mark_overdue_maintenance: { Args: never; Returns: undefined }
      permanent_delete_account: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      restore_deleted_account: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      schedule_maintenance_notifications: {
        Args: { maintenance_id_param: string }
        Returns: undefined
      }
      send_system_message: {
        Args: {
          content_param: string
          message_type_param?: string
          priority_param?: string
          recipient_id_param: string
          recipient_role_param: string
          subject_param: string
        }
        Returns: string
      }
      soft_delete_account: {
        Args: { grace_period_days?: number; target_user_id: string }
        Returns: boolean
      }
      update_equipment_popularity_score: {
        Args: { equipment_id_param: string }
        Returns: undefined
      }
      update_user_last_active: {
        Args: { user_uuid: string }
        Returns: undefined
      }
      validate_email: { Args: { email_input: string }; Returns: boolean }
      verify_email_token: {
        Args: { token_hash_param: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manufacturer" | "hospital" | "investor"
      payment_status: "pending" | "success" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manufacturer", "hospital", "investor"],
      payment_status: ["pending", "success", "failed"],
    },
  },
} as const
