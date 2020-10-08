import * as knexFunc from "knex";
import * as os from "os";
import * as path from "path";

export const knex = knexFunc({
  client: "sqlite3",
  connection: {
    filename: path.join(os.homedir(), ".my-vocabulary", "vocabulary.db"),
  },
});
