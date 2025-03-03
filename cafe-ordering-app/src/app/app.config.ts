import { ApplicationConfig } from '@angular/core';

export const config: ApplicationConfig = {
  providers: [],
  apiEndpoint: 'https://example.com/api',
  production: false
} as any;  // Add 'as any' to bypass type-checking if needed.
