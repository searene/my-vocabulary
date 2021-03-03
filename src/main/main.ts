import { app, BrowserWindow, HeadersReceivedResponse, OnHeadersReceivedListenerDetails, protocol } from "electron";
import * as path from "path";
import * as url from "url";
import { container } from "./config/inversify.config";
import { EPubBookReader } from "./reader/EPubBookReader";
import { EBookReadAgent } from "./EBookReadAgent";
import { types } from "./config/types";
import { PlainTextBookReader } from "./reader/PlainTextBookReader";
import { ConfigRepository } from "./infrastructure/repository/ConfigRepository";
import * as os from "os";
import { DictService } from "./dict/DictService";
import { CardTypeRepository } from "./infrastructure/repository/CardTypeRepository";
import { FieldTypeRepository } from "./infrastructure/repository/FieldTypeRepository";
import { CompositionRepository } from "./infrastructure/repository/CompositionRepository";

async function createSimpleCard(): Promise<void> {
  const cardTypeRepo = await container.getAsync<CardTypeRepository>(types.CardTypeRepository);
  const cardTypeDO = await cardTypeRepo.insert({name: "simple"});

  const fieldTypeRepo = await container.getAsync<FieldTypeRepository>(types.FieldTypeRepository);
  const frontFieldTypeDO = await fieldTypeRepo.insert({
    name: "front",
    category: "text",
    cardTypeId: cardTypeDO.id,
  });
  const backFieldTypeDO = await fieldTypeRepo.insert({
    name: "back",
    category: "text",
    cardTypeId: cardTypeDO.id,
  });

  const compositionRepo = await container.getAsync<CompositionRepository>(types.CompositionRepository);
  await compositionRepo.insert({
    name: "simple",
    frontTypeIds: `${frontFieldTypeDO.id}`,
    backTypeIds: `${backFieldTypeDO.id}`,
    cardTypeId: frontFieldTypeDO.cardTypeId
  });
}

async function createStandardCard(): Promise<void> {
  const cardTypeRepo = await container.getAsync<CardTypeRepository>(types.CardTypeRepository);
  const cardTypeDO = await cardTypeRepo.insert({name: "standard"});

  const fieldTypeRepo = await container.getAsync<FieldTypeRepository>(types.FieldTypeRepository);
  const frontFieldTypeDO = await fieldTypeRepo.insert({
    name: "front",
    category: "text",
    cardTypeId: cardTypeDO.id,
  });
  const baseBackFieldTypeDO = await fieldTypeRepo.insert({
    name: "baseBack",
    category: "text",
    cardTypeId: cardTypeDO.id,
  });
  const imageBackFieldTypeDO = await fieldTypeRepo.insert({
    name: "imageBack",
    category: "google-image",
    cardTypeId: cardTypeDO.id,
  });

  const compositionRepo = await container.getAsync<CompositionRepository>(types.CompositionRepository);
  await compositionRepo.insert({
    name: "standard",
    frontTypeIds: `${frontFieldTypeDO.id}`,
    backTypeIds: `${baseBackFieldTypeDO.id},${imageBackFieldTypeDO.id}`,
    cardTypeId: frontFieldTypeDO.cardTypeId
  });

  const configRepo = await container.getAsync<ConfigRepository>(types.ConfigRepository);
  await configRepo.insert({
    defaultCardTypeId: cardTypeDO.id
  });
}

async function initialization(): Promise<void> {
  EBookReadAgent.register("epub", EPubBookReader);
  EBookReadAgent.register("txt", PlainTextBookReader);

  const configRepository = await container.getAsync<ConfigRepository>(
    types.ConfigRepository
  );
  if ((await configRepository.query({})).length === 0) {
    await createSimpleCard();
    await createStandardCard();
  }
}

let win: BrowserWindow | null;

const installExtensions = async () => {
  const ses = win?.webContents.session;
  // react dev tools
  ses?.loadExtension(
    path.join(
      os.homedir(),
      ".config/google-chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.10.1_0"
    )
  );
  // redux dev tools
  // ses?.loadExtension(
  //   path.join(
  //     os.homedir(),
  //     ".config/google-chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0"
  //   )
  // );
};

const createWindow = async () => {
  await initialization();

  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      webSecurity: false,
      webviewTag: true,
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

  win.webContents.session.setProxy({
    proxyRules: "http://127.0.0.1:3128"
  });

  const onHeadersReceived=(details: OnHeadersReceivedListenerDetails, callback: (headersReceivedResponse: HeadersReceivedResponse) => void)=>{
    const responseHeaders = details.responseHeaders;
    if(responseHeaders != undefined && responseHeaders['x-frame-options']){
      delete responseHeaders['x-frame-options'];
    }
    callback({cancel: false, responseHeaders: responseHeaders});
  }
  win.webContents.session.webRequest.onHeadersReceived({urls: []}, onHeadersReceived);
};

app.commandLine.appendSwitch("proxy-server", "127.0.0.1:3128");

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", async () => {
  if (win === null) {
    await createWindow();
  }
});

const dictService = container.get<DictService>(types.DictService);

protocol.registerSchemesAsPrivileged([
  {
    scheme: DictService.getResourceUrlProtocol(),
    privileges: {
      supportFetchAPI: true,
    },
  },
]);
app.whenReady().then(() => {
  protocol.registerBufferProtocol(
    DictService.getResourceUrlProtocol(),
    (request, callback) => {
      const resourceMimeType = DictService.getResourceMimeType(request.url);
      dictService
        .getResource(request.url)
        .then((resourceContents) => {
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
