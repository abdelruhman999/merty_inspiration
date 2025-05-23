import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig } from "eslint/config";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next","next/core-web-vitals", "next/typescript" ),
  {
    rules: {
      // Suppress hook dependency warning
      'react-hooks/exhaustive-deps': 'off',

      // Suppress warning about <img>
      '@next/next/no-img-element': 'off',

      // Allow unused variables
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',

      // Allow empty interfaces
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',

      // Allow `any` type
      '@typescript-eslint/no-explicit-any': 'off',
    },
    ignorePatterns: ["src/calls/constant.js"],
  }
];

export default eslintConfig;
