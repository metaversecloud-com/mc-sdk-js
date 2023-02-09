import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import license from "rollup-plugin-license";
import path from "path";
import resolve, { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

export default {
  input: ["src/index.ts"],
  output: [
    {
      dir: "dist",
      esModule: true,
      exports: "auto",
      format: "esm",
    },
  ],
  plugins: [
    commonjs({
      exclude: "node_modules",
    }),
    license({
      sourcemap: true,
      banner: {
        content: {
          file: path.resolve("LICENSE.md"),
        },
      },
    }),
    nodeResolve({ preferBuiltins: true, extensions: [".svg", ".js", ".ts"] }),
    json(),
    resolve(),
    typescript({ useTsconfigDeclarationDir: true, tsconfig: "tsconfig.json" }),
  ],
};
