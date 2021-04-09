import * as knexFunc from "knex";
import * as path from "path";
import { Configs } from "../../../config/Configs";
const knexStringcase = require("knex-stringcase");

export const knex = knexFunc(
  knexStringcase({
    client: "sqlite3",
    connection: {
      filename: path.join(Configs.get().getConfDir(), "vocabulary.db"),
    },
    useNullAsDefault: true,
  })
);
