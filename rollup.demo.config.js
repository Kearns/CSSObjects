// Rollup plugins
import babel from "rollup-plugin-babel";
import postcss from "rollup-plugin-postcss";

export default {
  input: "./example/styles/index.js",
  output: [
    {
      file: './example/styles/index.iife.js',
      name: 'stylish',
      format: 'iife'
    }
  ],
  sourceMap: "inline",
  plugins: [
    postcss({
      extensions: [".css"]
    }),
    babel({
      exclude: "node_modules/**"
    })
  ]
};
