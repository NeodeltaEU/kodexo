import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    sourcemap: true
  },
  external: ['@tinyhttp/app'],
  plugins: [
    typescript({
      useTsconfigDeclarationDir: true
    })
  ]
}
