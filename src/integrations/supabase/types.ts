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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      agents: {
        Row: {
          agent_version: number | null
          ai_config: Json | null
          allow_user_dtmf: boolean | null
          ambient_sound: string | null
          ambient_sound_volume: number | null
          backchannel_frequency: number | null
          backchannel_words: Json | null
          begin_message_delay_ms: number | null
          behavior_config: Json | null
          boosted_keywords: Json | null
          created_at: string | null
          data_storage_setting: string | null
          denoising_mode: string | null
          description: string | null
          enable_backchannel: boolean | null
          end_call_after_silence_ms: number | null
          external_agent_id: string | null
          fallback_voice_ids: Json | null
          function_calling_config: Json | null
          id: string
          interruption_sensitivity: number | null
          is_published: boolean | null
          knowledge_base_config: Json | null
          language: string | null
          last_modification_timestamp: string | null
          max_call_duration_ms: number | null
          name: string
          normalize_for_speech: boolean | null
          opt_in_signed_url: boolean | null
          organization_id: string | null
          pii_config: Json | null
          post_call_analysis_data: Json | null
          post_call_analysis_model: string | null
          prompt_config: Json | null
          pronunciation_dictionary: Json | null
          provider_id: string | null
          reminder_max_count: number | null
          reminder_trigger_ms: number | null
          responsiveness: number | null
          ring_duration_ms: number | null
          status: string | null
          stt_mode: string | null
          user_dtmf_options: Json | null
          version: number | null
          vocab_specialization: string | null
          voice_config: Json | null
          voice_id: string | null
          voice_model: string | null
          voice_speed: number | null
          voice_temperature: number | null
          voicemail_option: Json | null
          volume: number | null
          webhook_timeout_ms: number | null
          webhook_url: string | null
        }
        Insert: {
          agent_version?: number | null
          ai_config?: Json | null
          allow_user_dtmf?: boolean | null
          ambient_sound?: string | null
          ambient_sound_volume?: number | null
          backchannel_frequency?: number | null
          backchannel_words?: Json | null
          begin_message_delay_ms?: number | null
          behavior_config?: Json | null
          boosted_keywords?: Json | null
          created_at?: string | null
          data_storage_setting?: string | null
          denoising_mode?: string | null
          description?: string | null
          enable_backchannel?: boolean | null
          end_call_after_silence_ms?: number | null
          external_agent_id?: string | null
          fallback_voice_ids?: Json | null
          function_calling_config?: Json | null
          id?: string
          interruption_sensitivity?: number | null
          is_published?: boolean | null
          knowledge_base_config?: Json | null
          language?: string | null
          last_modification_timestamp?: string | null
          max_call_duration_ms?: number | null
          name: string
          normalize_for_speech?: boolean | null
          opt_in_signed_url?: boolean | null
          organization_id?: string | null
          pii_config?: Json | null
          post_call_analysis_data?: Json | null
          post_call_analysis_model?: string | null
          prompt_config?: Json | null
          pronunciation_dictionary?: Json | null
          provider_id?: string | null
          reminder_max_count?: number | null
          reminder_trigger_ms?: number | null
          responsiveness?: number | null
          ring_duration_ms?: number | null
          status?: string | null
          stt_mode?: string | null
          user_dtmf_options?: Json | null
          version?: number | null
          vocab_specialization?: string | null
          voice_config?: Json | null
          voice_id?: string | null
          voice_model?: string | null
          voice_speed?: number | null
          voice_temperature?: number | null
          voicemail_option?: Json | null
          volume?: number | null
          webhook_timeout_ms?: number | null
          webhook_url?: string | null
        }
        Update: {
          agent_version?: number | null
          ai_config?: Json | null
          allow_user_dtmf?: boolean | null
          ambient_sound?: string | null
          ambient_sound_volume?: number | null
          backchannel_frequency?: number | null
          backchannel_words?: Json | null
          begin_message_delay_ms?: number | null
          behavior_config?: Json | null
          boosted_keywords?: Json | null
          created_at?: string | null
          data_storage_setting?: string | null
          denoising_mode?: string | null
          description?: string | null
          enable_backchannel?: boolean | null
          end_call_after_silence_ms?: number | null
          external_agent_id?: string | null
          fallback_voice_ids?: Json | null
          function_calling_config?: Json | null
          id?: string
          interruption_sensitivity?: number | null
          is_published?: boolean | null
          knowledge_base_config?: Json | null
          language?: string | null
          last_modification_timestamp?: string | null
          max_call_duration_ms?: number | null
          name?: string
          normalize_for_speech?: boolean | null
          opt_in_signed_url?: boolean | null
          organization_id?: string | null
          pii_config?: Json | null
          post_call_analysis_data?: Json | null
          post_call_analysis_model?: string | null
          prompt_config?: Json | null
          pronunciation_dictionary?: Json | null
          provider_id?: string | null
          reminder_max_count?: number | null
          reminder_trigger_ms?: number | null
          responsiveness?: number | null
          ring_duration_ms?: number | null
          status?: string | null
          stt_mode?: string | null
          user_dtmf_options?: Json | null
          version?: number | null
          vocab_specialization?: string | null
          voice_config?: Json | null
          voice_id?: string | null
          voice_model?: string | null
          voice_speed?: number | null
          voice_temperature?: number | null
          voicemail_option?: Json | null
          volume?: number | null
          webhook_timeout_ms?: number | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agents_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "call_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      batch_call_tasks: {
        Row: {
          batch_call_id: string | null
          contact_id: string | null
          created_at: string | null
          customer_name: string | null
          duration_seconds: number | null
          dynamic_variables: Json | null
          error_message: string | null
          external_call_id: string | null
          id: string
          status: string | null
          success: boolean | null
          to_number: string
        }
        Insert: {
          batch_call_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          customer_name?: string | null
          duration_seconds?: number | null
          dynamic_variables?: Json | null
          error_message?: string | null
          external_call_id?: string | null
          id?: string
          status?: string | null
          success?: boolean | null
          to_number: string
        }
        Update: {
          batch_call_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          customer_name?: string | null
          duration_seconds?: number | null
          dynamic_variables?: Json | null
          error_message?: string | null
          external_call_id?: string | null
          id?: string
          status?: string | null
          success?: boolean | null
          to_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "batch_call_tasks_batch_call_id_fkey"
            columns: ["batch_call_id"]
            isOneToOne: false
            referencedRelation: "batch_calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batch_call_tasks_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      batch_calls: {
        Row: {
          agent_id: string | null
          campaign_id: string | null
          completed_tasks: number | null
          created_at: string | null
          failed_tasks: number | null
          from_number: string
          id: string
          name: string
          organization_id: string | null
          status: string | null
          successful_tasks: number | null
          total_tasks: number | null
        }
        Insert: {
          agent_id?: string | null
          campaign_id?: string | null
          completed_tasks?: number | null
          created_at?: string | null
          failed_tasks?: number | null
          from_number: string
          id?: string
          name: string
          organization_id?: string | null
          status?: string | null
          successful_tasks?: number | null
          total_tasks?: number | null
        }
        Update: {
          agent_id?: string | null
          campaign_id?: string | null
          completed_tasks?: number | null
          created_at?: string | null
          failed_tasks?: number | null
          from_number?: string
          id?: string
          name?: string
          organization_id?: string | null
          status?: string | null
          successful_tasks?: number | null
          total_tasks?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "batch_calls_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batch_calls_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batch_calls_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      call_analytics: {
        Row: {
          agent_performance_score: number | null
          analyzed_at: string | null
          call_id: string | null
          call_successful: boolean | null
          call_summary: string | null
          created_at: string | null
          custom_analysis_data: Json | null
          external_call_id: string | null
          id: string
          in_voicemail: boolean | null
          key_phrases: Json | null
          recording_url: string | null
          sentiment_analysis: Json | null
          talk_time_percentage: number | null
          transcript: Json | null
          user_sentiment: string | null
        }
        Insert: {
          agent_performance_score?: number | null
          analyzed_at?: string | null
          call_id?: string | null
          call_successful?: boolean | null
          call_summary?: string | null
          created_at?: string | null
          custom_analysis_data?: Json | null
          external_call_id?: string | null
          id?: string
          in_voicemail?: boolean | null
          key_phrases?: Json | null
          recording_url?: string | null
          sentiment_analysis?: Json | null
          talk_time_percentage?: number | null
          transcript?: Json | null
          user_sentiment?: string | null
        }
        Update: {
          agent_performance_score?: number | null
          analyzed_at?: string | null
          call_id?: string | null
          call_successful?: boolean | null
          call_summary?: string | null
          created_at?: string | null
          custom_analysis_data?: Json | null
          external_call_id?: string | null
          id?: string
          in_voicemail?: boolean | null
          key_phrases?: Json | null
          recording_url?: string | null
          sentiment_analysis?: Json | null
          talk_time_percentage?: number | null
          transcript?: Json | null
          user_sentiment?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "call_analytics_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
        ]
      }
      call_cost_breakdown: {
        Row: {
          call_id: string | null
          combined_cost: number | null
          created_at: string | null
          external_call_id: string | null
          id: string
          llm_token_average: number | null
          llm_token_num_requests: number | null
          llm_token_values: Json | null
          product_costs: Json | null
          total_duration_seconds: number | null
          total_duration_unit_price: number | null
        }
        Insert: {
          call_id?: string | null
          combined_cost?: number | null
          created_at?: string | null
          external_call_id?: string | null
          id?: string
          llm_token_average?: number | null
          llm_token_num_requests?: number | null
          llm_token_values?: Json | null
          product_costs?: Json | null
          total_duration_seconds?: number | null
          total_duration_unit_price?: number | null
        }
        Update: {
          call_id?: string | null
          combined_cost?: number | null
          created_at?: string | null
          external_call_id?: string | null
          id?: string
          llm_token_average?: number | null
          llm_token_num_requests?: number | null
          llm_token_values?: Json | null
          product_costs?: Json | null
          total_duration_seconds?: number | null
          total_duration_unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "call_cost_breakdown_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
        ]
      }
      call_function_calls: {
        Row: {
          call_id: string | null
          created_at: string | null
          execution_timestamp: string | null
          external_call_id: string | null
          function_name: string
          function_parameters: Json | null
          function_response: Json | null
          id: string
          success: boolean | null
        }
        Insert: {
          call_id?: string | null
          created_at?: string | null
          execution_timestamp?: string | null
          external_call_id?: string | null
          function_name: string
          function_parameters?: Json | null
          function_response?: Json | null
          id?: string
          success?: boolean | null
        }
        Update: {
          call_id?: string | null
          created_at?: string | null
          execution_timestamp?: string | null
          external_call_id?: string | null
          function_name?: string
          function_parameters?: Json | null
          function_response?: Json | null
          id?: string
          success?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "call_function_calls_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
        ]
      }
      call_latency_metrics: {
        Row: {
          call_id: string | null
          created_at: string | null
          e2e_metrics: Json | null
          external_call_id: string | null
          id: string
          llm_metrics: Json | null
          tts_metrics: Json | null
        }
        Insert: {
          call_id?: string | null
          created_at?: string | null
          e2e_metrics?: Json | null
          external_call_id?: string | null
          id?: string
          llm_metrics?: Json | null
          tts_metrics?: Json | null
        }
        Update: {
          call_id?: string | null
          created_at?: string | null
          e2e_metrics?: Json | null
          external_call_id?: string | null
          id?: string
          llm_metrics?: Json | null
          tts_metrics?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "call_latency_metrics_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
        ]
      }
      call_pricing: {
        Row: {
          billing_increment_seconds: number | null
          call_type: string
          created_at: string | null
          destination_prefix: string | null
          id: string
          is_active: boolean | null
          minimum_charge_seconds: number | null
          organization_id: string | null
          price_per_minute: number
          setup_fee: number | null
        }
        Insert: {
          billing_increment_seconds?: number | null
          call_type: string
          created_at?: string | null
          destination_prefix?: string | null
          id?: string
          is_active?: boolean | null
          minimum_charge_seconds?: number | null
          organization_id?: string | null
          price_per_minute?: number
          setup_fee?: number | null
        }
        Update: {
          billing_increment_seconds?: number | null
          call_type?: string
          created_at?: string | null
          destination_prefix?: string | null
          id?: string
          is_active?: boolean | null
          minimum_charge_seconds?: number | null
          organization_id?: string | null
          price_per_minute?: number
          setup_fee?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "call_pricing_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      call_providers: {
        Row: {
          api_base_url: string | null
          created_at: string | null
          display_name: string
          features: Json | null
          id: string
          is_active: boolean | null
          pricing_model: string | null
          provider_name: string
          provider_type: string
          supports_multi_tenancy: boolean | null
          updated_at: string | null
          webhook_support: boolean | null
        }
        Insert: {
          api_base_url?: string | null
          created_at?: string | null
          display_name: string
          features?: Json | null
          id?: string
          is_active?: boolean | null
          pricing_model?: string | null
          provider_name: string
          provider_type: string
          supports_multi_tenancy?: boolean | null
          updated_at?: string | null
          webhook_support?: boolean | null
        }
        Update: {
          api_base_url?: string | null
          created_at?: string | null
          display_name?: string
          features?: Json | null
          id?: string
          is_active?: boolean | null
          pricing_model?: string | null
          provider_name?: string
          provider_type?: string
          supports_multi_tenancy?: boolean | null
          updated_at?: string | null
          webhook_support?: boolean | null
        }
        Relationships: []
      }
      call_transcripts: {
        Row: {
          call_id: string | null
          created_at: string | null
          external_call_id: string | null
          id: string
          knowledge_base_retrieved_contents_url: string | null
          public_log_url: string | null
          recording_multi_channel_url: string | null
          recording_url: string | null
          scrubbed_recording_url: string | null
          scrubbed_transcript_with_tool_calls: Json | null
          transcript: string | null
          transcript_object: Json | null
          transcript_with_tool_calls: Json | null
        }
        Insert: {
          call_id?: string | null
          created_at?: string | null
          external_call_id?: string | null
          id?: string
          knowledge_base_retrieved_contents_url?: string | null
          public_log_url?: string | null
          recording_multi_channel_url?: string | null
          recording_url?: string | null
          scrubbed_recording_url?: string | null
          scrubbed_transcript_with_tool_calls?: Json | null
          transcript?: string | null
          transcript_object?: Json | null
          transcript_with_tool_calls?: Json | null
        }
        Update: {
          call_id?: string | null
          created_at?: string | null
          external_call_id?: string | null
          id?: string
          knowledge_base_retrieved_contents_url?: string | null
          public_log_url?: string | null
          recording_multi_channel_url?: string | null
          recording_url?: string | null
          scrubbed_recording_url?: string | null
          scrubbed_transcript_with_tool_calls?: Json | null
          transcript?: string | null
          transcript_object?: Json | null
          transcript_with_tool_calls?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "call_transcripts_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
        ]
      }
      calls: {
        Row: {
          access_token: string | null
          agent_id: string | null
          agent_name: string | null
          agent_version: number | null
          analysis_completed: boolean | null
          batch_call_id: string | null
          billing_status: string | null
          call_cost: number | null
          call_metadata: Json | null
          call_source: string | null
          call_status: string | null
          call_type: string | null
          collected_dynamic_variables: Json | null
          contact_id: string | null
          created_at: string | null
          credits_deducted: number | null
          custom_sip_headers: Json | null
          customer_name: string | null
          data_storage_setting: string | null
          direction: string | null
          disconnection_reason: string | null
          duration_ms: number | null
          duration_seconds: number | null
          end_reason: string | null
          end_timestamp: number | null
          ended_at: string | null
          external_call_id: string | null
          from_number: string
          id: string
          in_voicemail: boolean | null
          internal_call_reference: string | null
          knowledge_base_retrieved_contents_url: string | null
          latency: Json | null
          llm_token_usage: Json | null
          opt_in_signed_url: boolean | null
          organization_id: string | null
          provider_id: string | null
          provider_metadata: Json | null
          public_log_url: string | null
          recording_multi_channel_url: string | null
          retell_call_id: string | null
          retell_llm_dynamic_variables: Json | null
          scrubbed_recording_multi_channel_url: string | null
          scrubbed_recording_url: string | null
          scrubbed_transcript_with_tool_calls: Json | null
          start_timestamp: number | null
          started_at: string | null
          status: string | null
          telephony_identifier: Json | null
          to_number: string
          transcript_object: Json | null
          transcript_with_tool_calls: Json | null
          updated_at: string | null
        }
        Insert: {
          access_token?: string | null
          agent_id?: string | null
          agent_name?: string | null
          agent_version?: number | null
          analysis_completed?: boolean | null
          batch_call_id?: string | null
          billing_status?: string | null
          call_cost?: number | null
          call_metadata?: Json | null
          call_source?: string | null
          call_status?: string | null
          call_type?: string | null
          collected_dynamic_variables?: Json | null
          contact_id?: string | null
          created_at?: string | null
          credits_deducted?: number | null
          custom_sip_headers?: Json | null
          customer_name?: string | null
          data_storage_setting?: string | null
          direction?: string | null
          disconnection_reason?: string | null
          duration_ms?: number | null
          duration_seconds?: number | null
          end_reason?: string | null
          end_timestamp?: number | null
          ended_at?: string | null
          external_call_id?: string | null
          from_number: string
          id?: string
          in_voicemail?: boolean | null
          internal_call_reference?: string | null
          knowledge_base_retrieved_contents_url?: string | null
          latency?: Json | null
          llm_token_usage?: Json | null
          opt_in_signed_url?: boolean | null
          organization_id?: string | null
          provider_id?: string | null
          provider_metadata?: Json | null
          public_log_url?: string | null
          recording_multi_channel_url?: string | null
          retell_call_id?: string | null
          retell_llm_dynamic_variables?: Json | null
          scrubbed_recording_multi_channel_url?: string | null
          scrubbed_recording_url?: string | null
          scrubbed_transcript_with_tool_calls?: Json | null
          start_timestamp?: number | null
          started_at?: string | null
          status?: string | null
          telephony_identifier?: Json | null
          to_number: string
          transcript_object?: Json | null
          transcript_with_tool_calls?: Json | null
          updated_at?: string | null
        }
        Update: {
          access_token?: string | null
          agent_id?: string | null
          agent_name?: string | null
          agent_version?: number | null
          analysis_completed?: boolean | null
          batch_call_id?: string | null
          billing_status?: string | null
          call_cost?: number | null
          call_metadata?: Json | null
          call_source?: string | null
          call_status?: string | null
          call_type?: string | null
          collected_dynamic_variables?: Json | null
          contact_id?: string | null
          created_at?: string | null
          credits_deducted?: number | null
          custom_sip_headers?: Json | null
          customer_name?: string | null
          data_storage_setting?: string | null
          direction?: string | null
          disconnection_reason?: string | null
          duration_ms?: number | null
          duration_seconds?: number | null
          end_reason?: string | null
          end_timestamp?: number | null
          ended_at?: string | null
          external_call_id?: string | null
          from_number?: string
          id?: string
          in_voicemail?: boolean | null
          internal_call_reference?: string | null
          knowledge_base_retrieved_contents_url?: string | null
          latency?: Json | null
          llm_token_usage?: Json | null
          opt_in_signed_url?: boolean | null
          organization_id?: string | null
          provider_id?: string | null
          provider_metadata?: Json | null
          public_log_url?: string | null
          recording_multi_channel_url?: string | null
          retell_call_id?: string | null
          retell_llm_dynamic_variables?: Json | null
          scrubbed_recording_multi_channel_url?: string | null
          scrubbed_recording_url?: string | null
          scrubbed_transcript_with_tool_calls?: Json | null
          start_timestamp?: number | null
          started_at?: string | null
          status?: string | null
          telephony_identifier?: Json | null
          to_number?: string
          transcript_object?: Json | null
          transcript_with_tool_calls?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calls_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calls_batch_call_id_fkey"
            columns: ["batch_call_id"]
            isOneToOne: false
            referencedRelation: "batch_calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calls_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calls_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calls_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "call_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          agent_id: string | null
          created_at: string | null
          dynamic_variables: Json | null
          from_number_id: string | null
          id: string
          name: string
          organization_id: string | null
          status: string | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          dynamic_variables?: Json | null
          from_number_id?: string | null
          id?: string
          name: string
          organization_id?: string | null
          status?: string | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          dynamic_variables?: Json | null
          from_number_id?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_from_number_id_fkey"
            columns: ["from_number_id"]
            isOneToOne: false
            referencedRelation: "phone_numbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          company: string | null
          created_at: string | null
          custom_fields: Json | null
          dynamic_variables: Json | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          organization_id: string | null
          phone_number: string
          status: string | null
          tags: string[] | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          dynamic_variables?: Json | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          organization_id?: string | null
          phone_number: string
          status?: string | null
          tags?: string[] | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          dynamic_variables?: Json | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          organization_id?: string | null
          phone_number?: string
          status?: string | null
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_flows: {
        Row: {
          begin_tag_display_position: Json | null
          conversation_flow_id: string | null
          created_at: string | null
          default_dynamic_variables: Json | null
          global_prompt: string | null
          id: string
          kb_config: Json | null
          knowledge_base_ids: Json | null
          mcps: Json | null
          model_choice: Json | null
          model_temperature: number | null
          nodes: Json | null
          organization_id: string | null
          start_node_id: string | null
          start_speaker: string | null
          tool_call_strict_mode: boolean | null
          tools: Json | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          begin_tag_display_position?: Json | null
          conversation_flow_id?: string | null
          created_at?: string | null
          default_dynamic_variables?: Json | null
          global_prompt?: string | null
          id: string
          kb_config?: Json | null
          knowledge_base_ids?: Json | null
          mcps?: Json | null
          model_choice?: Json | null
          model_temperature?: number | null
          nodes?: Json | null
          organization_id?: string | null
          start_node_id?: string | null
          start_speaker?: string | null
          tool_call_strict_mode?: boolean | null
          tools?: Json | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          begin_tag_display_position?: Json | null
          conversation_flow_id?: string | null
          created_at?: string | null
          default_dynamic_variables?: Json | null
          global_prompt?: string | null
          id?: string
          kb_config?: Json | null
          knowledge_base_ids?: Json | null
          mcps?: Json | null
          model_choice?: Json | null
          model_temperature?: number | null
          nodes?: Json | null
          organization_id?: string | null
          start_node_id?: string | null
          start_speaker?: string | null
          tool_call_strict_mode?: boolean | null
          tools?: Json | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_flows_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_transactions: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string | null
          description: string | null
          id: string
          organization_id: string | null
          reference_id: string | null
          reference_type: string | null
          transaction_type: string
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          created_at?: string | null
          description?: string | null
          id?: string
          organization_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_type: string
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          created_at?: string | null
          description?: string | null
          id?: string
          organization_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base: {
        Row: {
          content: string
          content_type: string | null
          created_at: string | null
          enable_auto_refresh: boolean | null
          id: string
          is_active: boolean | null
          knowledge_base_id: string | null
          knowledge_base_name: string | null
          knowledge_base_sources: Json | null
          last_refreshed_timestamp: string | null
          max_chunks_retrieved: number | null
          organization_id: string | null
          similarity_threshold: number | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          content_type?: string | null
          created_at?: string | null
          enable_auto_refresh?: boolean | null
          id?: string
          is_active?: boolean | null
          knowledge_base_id?: string | null
          knowledge_base_name?: string | null
          knowledge_base_sources?: Json | null
          last_refreshed_timestamp?: string | null
          max_chunks_retrieved?: number | null
          organization_id?: string | null
          similarity_threshold?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          content_type?: string | null
          created_at?: string | null
          enable_auto_refresh?: boolean | null
          id?: string
          is_active?: boolean | null
          knowledge_base_id?: string | null
          knowledge_base_name?: string | null
          knowledge_base_sources?: Json | null
          last_refreshed_timestamp?: string | null
          max_chunks_retrieved?: number | null
          organization_id?: string | null
          similarity_threshold?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_base_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_provider_configs: {
        Row: {
          api_credentials: Json
          created_at: string | null
          id: string
          is_primary: boolean | null
          organization_id: string | null
          provider_id: string | null
          provider_organization_id: string | null
          webhook_config: Json | null
        }
        Insert: {
          api_credentials: Json
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          organization_id?: string | null
          provider_id?: string | null
          provider_organization_id?: string | null
          webhook_config?: Json | null
        }
        Update: {
          api_credentials?: Json
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          organization_id?: string | null
          provider_id?: string | null
          provider_organization_id?: string | null
          webhook_config?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_provider_configs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_provider_configs_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "call_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          auto_recharge_amount: number | null
          auto_recharge_enabled: boolean | null
          branding: Json | null
          created_at: string | null
          credit_balance: number | null
          current_month_calls: number | null
          data_storage_setting: string | null
          domain: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          low_credit_threshold: number | null
          monthly_call_limit: number | null
          name: string
          plan: string | null
          primary_color: string | null
          primary_provider_id: string | null
          retell_settings: Json | null
          stripe_customer_id: string | null
          support_email: string | null
          updated_at: string | null
        }
        Insert: {
          auto_recharge_amount?: number | null
          auto_recharge_enabled?: boolean | null
          branding?: Json | null
          created_at?: string | null
          credit_balance?: number | null
          current_month_calls?: number | null
          data_storage_setting?: string | null
          domain?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          low_credit_threshold?: number | null
          monthly_call_limit?: number | null
          name: string
          plan?: string | null
          primary_color?: string | null
          primary_provider_id?: string | null
          retell_settings?: Json | null
          stripe_customer_id?: string | null
          support_email?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_recharge_amount?: number | null
          auto_recharge_enabled?: boolean | null
          branding?: Json | null
          created_at?: string | null
          credit_balance?: number | null
          current_month_calls?: number | null
          data_storage_setting?: string | null
          domain?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          low_credit_threshold?: number | null
          monthly_call_limit?: number | null
          name?: string
          plan?: string | null
          primary_color?: string | null
          primary_provider_id?: string | null
          retell_settings?: Json | null
          stripe_customer_id?: string | null
          support_email?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_primary_provider_id_fkey"
            columns: ["primary_provider_id"]
            isOneToOne: false
            referencedRelation: "call_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      phone_numbers: {
        Row: {
          area_code: number | null
          created_at: string | null
          id: string
          inbound_agent_id: string | null
          inbound_agent_version: number | null
          inbound_webhook_url: string | null
          is_verified: boolean | null
          last_modification_timestamp: string | null
          nickname: string | null
          number: string
          organization_id: string | null
          outbound_agent_id: string | null
          outbound_agent_version: number | null
          phone_number: string | null
          phone_number_pretty: string | null
          phone_number_type: string | null
          provider_number_id: string | null
          status: string | null
          telephony_config: Json | null
          type: string | null
        }
        Insert: {
          area_code?: number | null
          created_at?: string | null
          id?: string
          inbound_agent_id?: string | null
          inbound_agent_version?: number | null
          inbound_webhook_url?: string | null
          is_verified?: boolean | null
          last_modification_timestamp?: string | null
          nickname?: string | null
          number: string
          organization_id?: string | null
          outbound_agent_id?: string | null
          outbound_agent_version?: number | null
          phone_number?: string | null
          phone_number_pretty?: string | null
          phone_number_type?: string | null
          provider_number_id?: string | null
          status?: string | null
          telephony_config?: Json | null
          type?: string | null
        }
        Update: {
          area_code?: number | null
          created_at?: string | null
          id?: string
          inbound_agent_id?: string | null
          inbound_agent_version?: number | null
          inbound_webhook_url?: string | null
          is_verified?: boolean | null
          last_modification_timestamp?: string | null
          nickname?: string | null
          number?: string
          organization_id?: string | null
          outbound_agent_id?: string | null
          outbound_agent_version?: number | null
          phone_number?: string | null
          phone_number_pretty?: string | null
          phone_number_type?: string | null
          provider_number_id?: string | null
          status?: string | null
          telephony_config?: Json | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "phone_numbers_inbound_agent_id_fkey"
            columns: ["inbound_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phone_numbers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phone_numbers_outbound_agent_id_fkey"
            columns: ["outbound_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      retell_llms: {
        Row: {
          begin_message: string | null
          created_at: string | null
          default_dynamic_variables: Json | null
          general_prompt: string | null
          general_tools: Json | null
          id: string
          is_published: boolean | null
          kb_config: Json | null
          knowledge_base_ids: Json | null
          last_modification_timestamp: string | null
          model: string | null
          model_high_priority: boolean | null
          model_temperature: number | null
          organization_id: string | null
          s2s_model: string | null
          starting_state: string | null
          states: Json | null
          tool_call_strict_mode: boolean | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          begin_message?: string | null
          created_at?: string | null
          default_dynamic_variables?: Json | null
          general_prompt?: string | null
          general_tools?: Json | null
          id: string
          is_published?: boolean | null
          kb_config?: Json | null
          knowledge_base_ids?: Json | null
          last_modification_timestamp?: string | null
          model?: string | null
          model_high_priority?: boolean | null
          model_temperature?: number | null
          organization_id?: string | null
          s2s_model?: string | null
          starting_state?: string | null
          states?: Json | null
          tool_call_strict_mode?: boolean | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          begin_message?: string | null
          created_at?: string | null
          default_dynamic_variables?: Json | null
          general_prompt?: string | null
          general_tools?: Json | null
          id?: string
          is_published?: boolean | null
          kb_config?: Json | null
          knowledge_base_ids?: Json | null
          last_modification_timestamp?: string | null
          model?: string | null
          model_high_priority?: boolean | null
          model_temperature?: number | null
          organization_id?: string | null
          s2s_model?: string | null
          starting_state?: string | null
          states?: Json | null
          tool_call_strict_mode?: boolean | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "retell_llms_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          organization_id: string | null
          password_hash: string
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          organization_id?: string | null
          password_hash: string
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          organization_id?: string | null
          password_hash?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_logs: {
        Row: {
          created_at: string | null
          details: Json | null
          event_id: string
          event_type: string
          id: string
          organization_id: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          event_id: string
          event_type: string
          id?: string
          organization_id?: string | null
          status: string
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          event_id?: string
          event_type?: string
          id?: string
          organization_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      webhooks: {
        Row: {
          created_at: string | null
          events: string[] | null
          id: string
          is_active: boolean | null
          name: string
          organization_id: string | null
          secret: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          events?: string[] | null
          id?: string
          is_active?: boolean | null
          name: string
          organization_id?: string | null
          secret?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          events?: string[] | null
          id?: string
          is_active?: boolean | null
          name?: string
          organization_id?: string | null
          secret?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      webhook_endpoints: {
        Row: {
          created_at: string | null
          events: string[] | null
          id: string | null
          is_active: boolean | null
          name: string | null
          organization_id: string | null
          secret: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          events?: string[] | null
          id?: string | null
          is_active?: boolean | null
          name?: string | null
          organization_id?: string | null
          secret?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          events?: string[] | null
          id?: string | null
          is_active?: boolean | null
          name?: string | null
          organization_id?: string | null
          secret?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      auth_org_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      compute_and_deduct_call_cost: {
        Args: { p_external_call_id: string }
        Returns: Json
      }
      deduct_credits: {
        Args: {
          amount: number
          description: string
          org_id: string
          reference_id: string
          reference_type: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
