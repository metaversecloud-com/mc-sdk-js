import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";

export default {
  input: ["src/index.ts"],
  output: [
    {
      dir: "dist",
      entryFileNames: "[name].js",
      format: "cjs",
      exports: "named",
    },
  ],
  plugins: [
    commonjs({
      exclude: "node_modules",
    }),
    typescript(),
  ],
};
