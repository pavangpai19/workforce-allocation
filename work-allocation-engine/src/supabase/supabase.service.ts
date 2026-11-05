import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private client: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!url || !key) {
      this.logger.warn(
        'SUPABASE_URL and SUPABASE_SERVICE_KEY/SUPABASE_ANON_KEY are not fully configured in environment.',
      );
      // Fallback instance to allow offline compilation and unit testing
      this.client = createClient(
        url || 'https://placeholder.supabase.co',
        key || 'placeholder-key',
      );
    } else {
      this.client = createClient(url, key);
    }
  }

  onModuleInit() {
    this.logger.log('Supabase client initialized.');
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
