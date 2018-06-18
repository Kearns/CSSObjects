// Rollup plugins
import babel from "rollup-plugin-babel";
import postcss from "rollup-plugin-postcss";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

const globals = {
  flow: "lodash/flow"
};

export default {
  input: "src/index.js",
  output: [
    {
      file: "build/index.cjs.js",
      format: "cjs"
    },
    {
      file: "build/index.es.js",
      format: "es"
    },
    {
      file: "build/index.iife.js",
      name: "stylish",
      format: "iife"
    }
  ],
  sourceMap: "inline",
  plugins: [
    resolve(),
    commonjs({
      include: "node_modules/**"
    }),
    postcss({
      extensions: [".css"]
    }),
    babel({
      exclude: "node_modules/**"
    })
  ]
};
