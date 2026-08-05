import { runMigrations } from "./migrate.js";

const connectionString =
  process.env.DATABASE_URL ??
  "postgres://tadading:tadading@localhost:5433/tadading";

runMigrations(connectionString)
  .then((migrationsFolder) => {
    console.log(
      JSON.stringify({ message: "migrations_applied", migrationsFolder }),
    );
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
