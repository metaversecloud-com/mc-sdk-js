import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import license from "rollup-plugin-license";
import path from "path";
import resolve, { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";

export default {
  input: ["src/index.ts"],
  output: [
    {
      esModule: true,
      exports: "auto",
      format: "esm",
      file: "dist/index.js",
    },
    {
      file: "dist/index.cjs",
      format: "cjs",
    },
    {
      file: "dist/index.d.ts", format: "es"
    }
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
    typescript({
      clean: true,
      declaration: true,
      useTsconfigDeclarationDir: true,
      tsconfig: "tsconfig.json",
      verbosity: 1,
    }),
    dts(),
  ],
};
