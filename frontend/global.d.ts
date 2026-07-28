/// <reference types="@tarojs/taro" />

declare module '*.png'
declare module '*.gif'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
declare module '*.css'
declare module '*.less'
declare module '*.scss'

// Injected via config defineConstants (see config/dev.ts / config/prod.ts).
// Populated at build time from the platform's Supabase config.
declare const SUPABASE_URL: string
declare const SUPABASE_ANON_KEY: string

declare namespace NodeJS {
  interface ProcessEnv {
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'qq' | 'jd'
    TARO_APP_SUPABASE_URL: string
    TARO_APP_SUPABASE_ANON_KEY: string
  }
}
