import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve, { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

const generateAlias = (name) => {
  return { find: name, replacement: `src/${name}/index.ts` };
};

const aliases = [generateAlias("")];

export default {
  input: ["src/index.ts"],
  output: [
    {
      dir: "dist",
      esModule: true,
      entryFileNames: "[name].js",
      format: "esm",
      exports: "auto",
    },
  ],
  plugins: [
    alias({ entries: aliases }),
    commonjs({
      exclude: "node_modules",
    }),
    nodeResolve({ preferBuiltins: true, extensions: [".svg", ".js", ".ts"] }),
    json(),
    resolve(),
    typescript({ useTsconfigDeclarationDir: true, tsconfig: "tsconfig.json" }),
  ],
};
