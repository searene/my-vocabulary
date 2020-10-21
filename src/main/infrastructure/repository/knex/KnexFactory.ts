import * as knexFunc from "knex";
import * as os from "os";
import * as path from "path";
const knexStringcase = require("knex-stringcase");

export const knex = knexFunc(
  knexStringcase({
    client: "sqlite3",
    connection: {
      filename: path.join(os.homedir(), ".my-vocabulary", "vocabulary.db"),
    },
  })
);
