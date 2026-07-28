export default {
  env: {
    NODE_ENV: '"development"',
  },
  defineConstants: {
    // Supabase config is bridged from the platform via TARO_APP_* env vars by
    // frontend_start.sh. Read these in code through the SUPABASE_URL /
    // SUPABASE_ANON_KEY constants declared in src/global.d.ts.
    SUPABASE_URL: JSON.stringify(process.env.TARO_APP_SUPABASE_URL || ''),
    SUPABASE_ANON_KEY: JSON.stringify(process.env.TARO_APP_SUPABASE_ANON_KEY || ''),
  },
  // NOTE: do NOT add `h5` or `mini` keys here — config/index.ts spreads this
  // object at the top level (shallow merge), so an `h5: {}` here would wipe the
  // base h5.devServer (port 5173) config and the preview would bind the wrong port.
}
