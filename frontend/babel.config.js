// babel-preset-taro handles React + TypeScript + platform transforms for both
// weapp and h5 targets. Keep this minimal; add plugins only when a dependency
// (e.g. a component library) requires it.
module.exports = {
  presets: [
    ['taro', {
      framework: 'react',
      ts: true,
    }],
  ],
}
