import path from "path";
import fs from "fs-extra";
import { v4 as uuidv4 } from "uuid";
import MarkdownIt from "markdown-it";
const electron = require("electron");

const DATA_FOLDER = "CODER_NOTEBOOK";
const NOTEBOOK_SUFFIX = ".qvnotebook";
const NOTE_SUFFIX = ".qvnote";
const md = new MarkdownIt({
  html: true,
  xhtmlOut: false,
  breaks: true,
  linkify: true,
  typographer: true,
  quotes: "“”‘’",
});

export const uuid = uuidv4();

export const getNotebookDirName = (notebookUuid) => `${notebookUuid}${NOTEBOOK_SUFFIX}`;

export const getNoteDirName = (noteUuid) => `${noteUuid}${NOTE_SUFFIX}`;

export const getAppPathSync = () => {
  const documentPath = electron.remote.app.getPath("documents");
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

export const init = async () => {
  const appPath = getAppPathSync();
  fs.ensureDir(appPath);
  const defaultConfig = {
    name: "coder-notebook",
  };
  await fs.outputJson(path.join(appPath, "config.json"), defaultConfig);
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
  const nbPath = path.join(appPath, getNotebookDirName(notebookUuid));
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
  const notePath = path.join(appPath, getNotebookDirName(notebookUuid), getNoteDirName(noteUuid));
  const meta = await fs.readJson(path.join(notePath, "meta.json"));
  const content = await fs.readJson(path.join(notePath, "content.json"));
  return {
    ...meta,
    cells: content.cells,
  };
};

export const md2html = (mdStr) => md.render(mdStr);
