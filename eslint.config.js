import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default [
  // базовые рекомендации ESLint
  js.configs.recommended,
  // рекомендации для TypeScript
  ...tseslint.configs.recommended,
  // отключаем правила, конфликтующие с Prettier (всегда последним)
  prettier,
  {
    rules: {
      // запрещаем console.log, но разрешаем warn и error
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // неиспользуемые переменные с префиксом _ игнорируем
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    ignores: ['templates/**'],
  },
];
