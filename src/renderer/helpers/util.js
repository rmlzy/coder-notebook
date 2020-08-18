import path from "path";
import fs from "fs-extra";
import { v4 as uuidv4 } from "uuid";
import MarkdownIt from "markdown-it";
import pkg from "../../../package.json";
const electron = require("electron");

const DATA_FOLDER = "CODER_NOTEBOOK";
const md = new MarkdownIt({
  html: true,
  xhtmlOut: false,
  breaks: true,
  linkify: true,
  typographer: true,
  quotes: "“”‘’",
});

export const uuid = uuidv4;

export const md2html = (mdStr) => {
  return md.render(mdStr);
};

export const getDocumentPath = () => {
  return electron.remote.app.getPath("documents");
};

export const getAppPathSync = () => {
  const documentPath = getDocumentPath();
  const dataPath = `${documentPath}/${DATA_FOLDER}`;
  if (!isDir(dataPath)) {
    fs.ensureDir(dataPath);
  }
  return dataPath;
};

export const isDir = (p) => {
  try {
    const stat = fs.lstatSync(p);
    return stat.isDirectory();
  } catch (e) {
    return false;
  }
};

export const isFile = (p) => {
  try {
    const stat = fs.lstatSync(p);
    return stat.isFile();
  } catch (e) {
    return false;
  }
};

export const ls = (p) => {
  return new Promise((resolve, reject) => {
    fs.readdir(p, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(files);
    });
  });
};

export const init = async () => {
  const appPath = getAppPathSync();
  const configPath = path.join(appPath, "config.json");
  if (isFile(configPath)) {
    return;
  }
  await fs.ensureDir(appPath);
  await fs.outputJson(configPath, {
    name: pkg.name,
    version: pkg.version,
  });
  await createNotebook("Inbox", "Inbox");
  await createNotebook("Tutorial", "Tutorial");
  await createNotebook("Trash", "Trash");
};

export const getNotebooks = async () => {
  const appPath = getAppPathSync();
  const nbPaths = (await ls(appPath)).filter((p) => isDir(path.join(appPath, p)));
  const nbMetas = [];
  for (let idx in nbPaths) {
    const meta = await fs.readJson(path.join(appPath, nbPaths[idx], "meta.json"));
    nbMetas.push(meta);
  }
  return nbMetas;
};

export const getNotes = async (notebookUuid) => {
  const appPath = getAppPathSync();
  const nbPath = path.join(appPath, notebookUuid);
  const notePaths = (await ls(nbPath)).filter((p) => isFile(path.join(nbPath, p, "meta.json")));
  const noteMetas = [];
  for (let idx in notePaths) {
    const meta = await fs.readJson(path.join(nbPath, notePaths[idx], "meta.json"));
    noteMetas.push(meta);
  }
  return noteMetas;
};

export const getNote = async (notebookUuid, noteUuid) => {
  const appPath = getAppPathSync();
  const notePath = path.join(appPath, notebookUuid, noteUuid);
  const metaJson = await fs.readJson(path.join(notePath, "meta.json"));
  const contentJson = await fs.readJson(path.join(notePath, "content.json"));
  return {
    ...metaJson,
    cells: contentJson.cells,
  };
};

export const createNotebook = async (name, _uuid) => {
  const appPath = getAppPathSync();
  const nbUuid = _uuid || uuid();
  const nbPath = path.join(appPath, nbUuid);
  await fs.ensureDir(nbPath);
  await fs.outputJson(path.join(nbPath, "meta.json"), { name, uuid: nbUuid });
  return nbUuid;
};

export const updateNotebookName = async (notebookUuid, name) => {
  const appPath = getAppPathSync();
  const metaPath = path.join(appPath, notebookUuid, "meta.json");
  const meta = await fs.readJson(metaPath);
  meta.name = name;
  await fs.outputJson(metaPath, meta);
};

export const createNote = async (notebookUuid) => {
  const appPath = getAppPathSync();
  const noteUuid = uuid();
  const metaPath = path.join(appPath, notebookUuid, noteUuid, "meta.json");
  const contentPath = path.join(appPath, notebookUuid, noteUuid, "content.json");
  const defaultTitle = "Untitled";
  const ts = +new Date();
  await fs.outputJson(metaPath, {
    title: defaultTitle,
    uuid: noteUuid,
    tags: [],
    created_at: ts,
    updated_at: ts,
  });
  await fs.outputJson(contentPath, {
    title: defaultTitle,
    cells: [
      {
        uuid: uuid(),
        type: "markdown",
        data: "",
      },
    ],
  });
  return noteUuid;
};

export const updateNoteTitle = async (notebookUuid, noteUuid, noteTitle) => {
  const appPath = getAppPathSync();

  const metaPath = path.join(appPath, notebookUuid, noteUuid, "meta.json");
  const meta = await fs.readJson(metaPath);
  meta.title = noteTitle;
  meta.updated_at = +new Date();
  await fs.outputJson(metaPath, meta);

  const contentPath = path.join(appPath, notebookUuid, noteUuid, "content.json");
  const content = await fs.readJson(contentPath);
  content.title = noteTitle;
  await fs.outputJson(contentPath, content);
};

export const updateNoteCells = async (notebookUuid, noteUuid, noteCells) => {
  const appPath = getAppPathSync();

  const metaPath = path.join(appPath, notebookUuid, noteUuid, "meta.json");
  const meta = await fs.readJson(metaPath);
  meta.updated_at = +new Date();
  await fs.outputJson(metaPath, meta);

  const contentPath = path.join(appPath, notebookUuid, noteUuid, "content.json");
  const content = await fs.readJson(contentPath);
  content.cells = noteCells;
  await fs.outputJson(contentPath, content);
};

export const moveNotebookToTrash = async (notebookUuid) => {
  const appPath = getAppPathSync();
  const nbPath = path.join(appPath, notebookUuid);
  const notePaths = (await ls(nbPath)).filter((p) => isFile(path.join(nbPath, p, "meta.json")));
  for (let i = 0; i < notePaths.length; i++) {
    const sourceNotePath = path.join(appPath, notebookUuid, notePaths[i]);
    const targetNotePath = path.join(appPath, "Trash", notePaths[i]);
    await fs.move(sourceNotePath, targetNotePath);
  }
  await fs.remove(path.join(appPath, notebookUuid));
};

export const moveNoteToTrash = async (notebookUuid, noteUuid) => {
  const appPath = getAppPathSync();
  const sourceNotePath = path.join(appPath, notebookUuid, noteUuid);
  const targetNotePath = path.join(appPath, "Trash", noteUuid);
  if (notebookUuid === "Trash") {
    await fs.remove(sourceNotePath);
  } else {
    await fs.move(sourceNotePath, targetNotePath);
  }
};
