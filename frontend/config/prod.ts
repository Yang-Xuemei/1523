export default {
  env: {
    NODE_ENV: '"production"',
  },
  defineConstants: {
    SUPABASE_URL: JSON.stringify(process.env.TARO_APP_SUPABASE_URL || ''),
    SUPABASE_ANON_KEY: JSON.stringify(process.env.TARO_APP_SUPABASE_ANON_KEY || ''),
  },
  // NOTE: do NOT add `h5` or `mini` keys here (see config/dev.ts) — the top-level
  // spread in config/index.ts would clobber the base h5/mini config.
}
