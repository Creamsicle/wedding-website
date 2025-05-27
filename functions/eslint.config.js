// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import globals from "globals";

// Note: eslint-config-google might not be directly compatible with flat config out of the box.
// It typically exports a legacy config. We might need to adjust this if it causes issues.
// For now, we'll assume tseslint.configs.recommended and eslint.configs.recommended cover the essentials.
// If specific Google style rules are needed, they might have to be added manually or via a compatible plugin.

export default tseslint.config(
  {
    ignores: ["lib/**", "generated/**"], // Global ignores
  },
  eslint.configs.recommended, // Base ESLint recommended rules
  ...tseslint.configs.recommendedTypeChecked, // Recommended TS rules with type checking
  // If you don't want type-aware linting, use tseslint.configs.recommended instead of ...tseslint.configs.recommendedTypeChecked
  {
    // Configuration for import plugin
    plugins: {
      import: importPlugin,
    },
    languageOptions: { // Moved globals here as per flat config structure
      globals: {
        ...globals.node,
        ...globals.es2021, // Modern ES version
      },
    },
    rules: {
      // --- Your Custom Rules ---
      "quotes": ["error", "double"],
      "indent": ["error", 2],
      
      // --- Approximations/Replacements for 'google' style (manual) ---
      "max-len": ["error", { "code": 120, "ignoreComments": true, "ignoreUrls": true, "ignoreStrings": true, "ignoreTemplateLiterals": true }],
      "object-curly-spacing": ["error", "always"],
      "space-before-function-paren": ["error", {
        "anonymous": "never",
        "named": "never",
        "asyncArrow": "always"
      }],
      "no-prototype-builtins": "warn",
      "require-jsdoc": "off",
      "valid-jsdoc": "off",
      "new-cap": ["error", { "newIsCap": true, "capIsNew": false }],
      "no-multi-str": "error",
      "no-return-await": "error",
      "no-throw-literal": "error",
      "no-useless-escape": "warn",
      "prefer-const": "warn",
      "prefer-promise-reject-errors": "error",
      
      // --- Rules from eslint-plugin-import ---
      // Using plugin object directly. If it has its own config objects (e.g., importPlugin.configs.recommended),
      // those would be spread into the main config array instead.
      // For now, assuming rules need to be specified if not using a prebuilt config from the plugin for flat style.
      "import/no-unresolved": "off", // As per your original config (0 means off)
      // Add other import/* rules here if needed, from "plugin:import/errors" & "plugin:import/warnings"
      "import/named": "error",
      "import/default": "error",
      "import/namespace": "error",
      "import/export": "error",
      // Consider adding settings for import/resolver if you have path aliases or custom module resolution
    },
    settings: { // Example for import resolver if you use TypeScript paths
      'import/resolver': {
        typescript: { 
          project: './tsconfig.json',
        },
      },
    },
  },
  {
    // Specific overrides for TS files if necessary, though tseslint.configs.recommendedTypeChecked covers a lot
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: true, // Uses tsconfig.json from the CWD (functions directory)
        tsconfigRootDir: import.meta.dirname, // Ensures correct tsconfig path resolution
      },
    },
    rules: {
      // You can override or add TS-specific rules here
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/explicit-module-boundary-types": "off",
    }
  }
); 