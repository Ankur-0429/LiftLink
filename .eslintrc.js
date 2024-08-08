require('dotenv').config()

module.exports = {
  extends: "next/core-web-vitals",
  plugins: ["@ts-safeql/eslint-plugin"],
  parserOptions: {
    project: "./tsconfig.json"
  },
  rules: {
    "@ts-safeql/check-sql": [
      "error",
      {
        connections: [
          {
            connectionUrl: process.env.DATABASE_URL,
            migrationsDir: "./prisma/migrations",
            targets: [
              {
                tag: "prisma.+($queryRaw|$executeRaw)",
                transform: "{type}[]"
              }
            ]
          }
        ]
      }
    ]
  }
};
