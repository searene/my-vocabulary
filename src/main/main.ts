import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as url from "url";
import { WordStatus } from "./enum/WordStatus";
import { container } from "./config/inversify.config";
import { WordService } from "./WordService";
import * as fs from "fs-extra";
import { EPubBookReader } from "./EPubBookReader";
import { EBookReadAgent } from "./EBookReadAgent";
import { DatabaseService } from "./database/DatabaseService";
import { TYPES } from "./config/types";

let win: BrowserWindow | null;

const installExtensions = async () => {
  const installer = require("electron-devtools-installer");
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ["REACT_DEVELOPER_TOOLS", "REDUX_DEVTOOLS"];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log); // eslint-disable-line no-console
};

const createWindow = async () => {
  if (process.env.NODE_ENV !== "production") {
    await installExtensions();
  }

  win = new BrowserWindow({ width: 800, height: 600 });

  if (process.env.NODE_ENV !== "production") {
    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "1"; // eslint-disable-line require-atomic-updates
    win.loadURL(`http://localhost:2003`);
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true
      })
    );
  }

  if (process.env.NODE_ENV !== "production") {
    // Open DevTools, see https://github.com/electron/electron/issues/12438 for why we wait for dom-ready
    win.webContents.once("dom-ready", () => {
      win!.webContents.openDevTools();
    });
  }

  win.on("closed", () => {
    win = null;
  });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});

async function test() {
  if (fs.existsSync("/home/searene/.my-vocabulary")) {
    fs.removeSync("/home/searene/.my-vocabulary");
  }
  EBookReadAgent.register("epub", EPubBookReader);
  const filePath = "/home/searene/Documents/books/Ten Drugs How Plants, Powders, and Pills Have Shaped the History of Medicine/Ten Drugs  How Plants, Powders, and Pills Have Shaped the History of Medicine.epub";
  const contents = await EBookReadAgent.readAllContents(filePath);
  if (!contents.isPresent()) {
    throw new Error("contents not available");
  }
  console.log("a");
  const words = await EBookReadAgent.readAllWords(filePath);

  console.log("b");
  const databaseService = container.get<DatabaseService>(TYPES.DatabaseService);
  console.log("c");
  const bookId = await databaseService.writeBookContents("Ten Drugs", contents.get());
  console.log("d");
  await databaseService.writeWords(bookId, words);
  console.log("e");

  console.log("f");
  const wordService = container.get<WordService>(WordService);
  console.log("g");
  const queriedWords = await wordService.getWords(bookId, WordStatus.Unknown, 1, 10, 10);
  console.log("queriedWords: " + queriedWords);
}

test();

