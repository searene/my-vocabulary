import { app, BrowserWindow, protocol } from "electron";
import * as path from "path";
import * as url from "url";
import { container } from "./config/inversify.config";
import { EPubBookReader } from "./EPubBookReader";
import { EBookReadAgent } from "./EBookReadAgent";
import { types } from "./config/types";
import { PlainTextBookReader } from "./PlainTextBookReader";
import { FieldTypeFactory } from "./domain/card/factory/FieldTypeFactory";
import { ConfigRepository } from "./infrastructure/repository/ConfigRepository";
import { CardTypeFactory } from "./domain/card/factory/CardTypeFactory";
import { CompositionFactory } from "./domain/card/factory/CompositionFactory";
import * as os from "os";
import * as fs from "fs-extra";
import { DictService } from "./dict/DictService";

async function initialization(): Promise<void> {
  EBookReadAgent.register("epub", EPubBookReader);
  EBookReadAgent.register("txt", PlainTextBookReader);

  const configRepository = await container.getAsync<ConfigRepository>(
    types.ConfigRepository
  );
  if ((await configRepository.query({})).length === 0) {
    // defaultCardTypeId hasn't been inserted, we need to create and init it.

    // initialCardType is the defaultCardTypeId at start
    const initialCardTypeId = (
      await CardTypeFactory.get().createInitialCardType()
    ).id;
    const [
      frontFieldType,
      backFieldType,
    ] = await FieldTypeFactory.get().createInitialFieldTypes(initialCardTypeId);
    await (await CompositionFactory.get()).createInitialComposition(
      frontFieldType,
      backFieldType
    );
  }
}

let win: BrowserWindow | null;

const installExtensions = async () => {
  const ses = win?.webContents.session;
  // react dev tools
  ses?.loadExtension(
    path.join(
      os.homedir(),
      ".config/google-chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.10.0_0"
    )
  );
  // redux dev tools
  ses?.loadExtension(
    path.join(
      os.homedir(),
      ".config/google-chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0"
    )
  );
};

const createWindow = async () => {
  await initialization();

  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  win.maximize();

  if (process.env.NODE_ENV !== "production") {
    await installExtensions();
  }

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true,
    })
  );

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

const dictService = container.get<DictService>(types.DictService);

app.whenReady().then(() => {
  protocol.registerBufferProtocol(
    DictService.getResourceUrlProtocol(),
    (request, callback) => {
      const resourceMimeType = DictService.getResourceMimeType(request.url);
      dictService
        .getResource(request.url)
        .then((resourceContents) => {
          // fs.writeFileSync("/home/searene/Downloads/test.jpg", resourceContents);
          callback({
            mimeType: resourceMimeType,
            data: resourceContents,
          });
        })
        .catch((reason) => {
          throw new Error(
            "Error occurred in DictService::getResource, reason: " + reason
          );
        });
    }
  );
});

exports.bookService = container.get(types.BookService);
exports.wordService = container.get(types.WordService);
exports.cardFacade = container.get(types.CardFacade);
exports.dictService = dictService;
