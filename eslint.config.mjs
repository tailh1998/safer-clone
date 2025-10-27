import { FlatCompat } from "@eslint/eslintrc"
import checkFile from "eslint-plugin-check-file"
import nodePlugin from "eslint-plugin-n"
import prettier from "eslint-plugin-prettier"
import { dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname
})

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Add prettier plugin
  {
    plugins: {
      prettier: prettier
    },
    rules: {
      "prettier/prettier": [
        "error",
        {
          printWidth: 100,
          doubleQuote: true,
          trailingComma: "none",
          tabWidth: 2,
          endOfLine: "auto"
        }
      ]
    }
  },

  // Add check-file plugin
  {
    files: ["src/**/*.*"],
    plugins: {
      "check-file": checkFile
    },
    rules: {
      "check-file/filename-naming-convention": [
        "error",
        {
          "**/*.{ts,tsx}": "KEBAB_CASE"
        },
        {
          ignoreMiddleExtensions: true
        }
      ]
    }
  },

  // Add node plugin
  {
    plugins: {
      n: nodePlugin
    },
    rules: {
      "n/no-process-env": ["error"]
    }
  },

  // Add global rules
  {
    rules: {
      // Disabled rules
      "max-len": "off",
      "one-var": "off",
      "no-alert": "off",
      "no-shadow": "off",
      "no-plusplus": "off",
      "no-unused-vars": "off",
      "import/no-cycle": "off",
      "no-return-assign": "off",
      "react/prop-types": "off",
      "no-param-reassign": "off",
      "no-underscore-dangle": "off",
      "react/no-children-prop": "off",
      "react/jsx-boolean-value": "off",
      "react/no-array-index-key": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-wrap-multilines": "off",
      "react/require-default-props": "off",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-shadow": "off",
      "react/jsx-props-no-spreading": "off",
      "import/prefer-default-export": "off",
      "react/destructuring-assignment": "off",
      "import/no-extraneous-dependencies": "off",
      "react/jsx-one-expression-per-line": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/naming-convention": "off",
      "jsx-a11y/control-has-associated-label": "off",
      "@typescript-eslint/no-empty-object-type": "off",

      // Custom rules
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "react/jsx-key": "error",
      "no-debugger": "warn",
      "react/button-has-type": "warn",
      "object-curly-spacing": ["warn", "always"],
      "max-classes-per-file": ["error", 10],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "none",
          caughtErrorsIgnorePattern: "^error$"
        }
      ],
      "prefer-arrow-callback": ["error"],
      "prefer-template": ["error"],
      quotes: ["error", "double"]
    }
  },

  // Ignore CSS
  {
    ignores: ["**/*.css", "**/*.scss"]
  }
]

export default eslintConfig
