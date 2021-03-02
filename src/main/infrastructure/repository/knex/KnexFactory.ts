import * as knexFunc from "knex";
import * as path from "path";
import { configs } from "../../../config/Configs";
const knexStringcase = require("knex-stringcase");

export const knex = knexFunc(
  knexStringcase({
    client: "sqlite3",
    connection: {
      filename: path.join(configs.configDir, "vocabulary.db"),
    },
  })
);
