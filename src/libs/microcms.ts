import { createClient } from 'microcms-js-sdk';

export const client = createClient({ serviceDomain: 'yuqlo', apiKey: process.env.MICROCMS_API_KEY });
