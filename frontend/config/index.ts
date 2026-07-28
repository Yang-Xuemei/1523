import { defineConfig } from '@tarojs/cli'
import devConfig from './dev'
import prodConfig from './prod'

// Taro 4 + React config. The mini-program (weapp) build and the H5 build share
// this one config. The AutoAgent platform previews the **H5** dev server on
// http://localhost:5173/ during a session; the weapp bundle is produced at
// publish time. Do not change the h5.devServer host/port — the platform's
// frontend preview contract depends on 0.0.0.0:5173.
//
// Compiler is **Vite** (@tarojs/vite-runner): the H5 dev server serves source
// as native ESM (esbuild transform, no full bundle), so dev-server memory and
// cold-start are far lower than webpack5 — which OOM-killed (exit 137) the H5
// build in the 2Gi sandbox and left the preview stuck in a crash-restart loop.
export default defineConfig<'vite'>(async (merge) => {
  const baseConfig: any = {
    projectName: 'wx-miniapp',
    date: '2026-07-16',
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      828: 1.81 / 2,
    },
    sourceRoot: 'src',
    // weapp 与 h5 用独立 outputRoot，避免共用一个目录互相清空/覆盖。H5 dev server
    // (`taro build --type h5 --watch`) 常驻独占 `dist/`；weapp (`build:weapp`，预览码/发布用)
    // 出到 `dist-weapp/`。二者永不碰同一目录 —— 否则 build:weapp 会污染 dist/ 让 H5 的
    // emptyOutputDir 崩、或 H5 首建清 dist/ 抹掉 weapp 的 app.json 致上传失败。
    // TARO_ENV 由 Taro CLI 按 --type 设（'h5' / 'weapp'）。project.config.json 的
    // miniprogramRoot 必须与 weapp 输出目录一致（= 'dist-weapp/'）。
    outputRoot: process.env.TARO_ENV === 'h5' ? 'dist' : 'dist-weapp',
    plugins: [],
    defineConstants: {},
    copy: {
      patterns: [],
      options: {},
    },
    framework: 'react',
    compiler: {
      type: 'vite',
    },
    jsMinimizer: 'esbuild',
    mini: {
      postcss: {
        pxtransform: { enable: true, config: {} },
        cssModules: {
          enable: false,
        },
      },
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      // Preview contract: the platform probes and renders http://localhost:5173/.
      // Taro-Vite maps h5.devServer onto Vite's `server` options. Vite's dev
      // server does not Host-check by default; `allowedHosts: true` keeps the
      // platform's dynamic preview domain accepted on Vite 5+ too.
      devServer: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        allowedHosts: true,
        hmr: {
          overlay: false,
        },
      },
      postcss: {
        autoprefixer: { enable: true },
        pxtransform: { enable: true, config: { platform: 'h5' } },
        cssModules: {
          enable: false,
        },
      },
    },
  }

  return merge(
    {},
    baseConfig,
    process.env.NODE_ENV === 'development' ? devConfig : prodConfig,
  )
})
