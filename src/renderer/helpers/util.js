import path from "path";
import _ from "lodash";
import fs from "fs-extra";
import { shell, remote } from "electron";
import { v4 as uuidv4 } from "uuid";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import pkg from "../../../package.json";

const md = new MarkdownIt({
  html: true,
  xhtmlOut: false,
  breaks: true,
  linkify: true,
  typographer: true,
  quotes: "“”‘’",
  highlight: function (str, lang) {
    let canRun = false;
    if (lang === "bash") {
      canRun = true;
    }
    if (lang && hljs.getLanguage(lang)) {
      try {
        const canRunClass = canRun ? "is-run-code" : "";
        const hljsEl = hljs.highlight(lang, str, true).value;
        const btnEl = canRun
          ? `<div class='is-run-code__btn'>RUN</div><div class='is-run-code__real' style='display: none;'>${str}</div>`
          : "";
        return `<pre class="hljs ${canRunClass}" data-language='${lang}'><code>${hljsEl}</code>${btnEl}</pre>`;
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>";
  },
});
md.validateLink = () => true;

export const uuid = uuidv4;

export const runCurl = async (code) => {
  return new Promise((resolve, reject) => {
    resolve({ success: true, data: "功能开发中..." });
  });
};

export const showInFinder = (p) => {
  shell.showItemInFolder(p);
};

export const md2html = (notebookUuid, noteUuid, mdText) => {
  const appPath = getAppPathSync();
  const resourcePath = `file://${appPath}/${notebookUuid}/${noteUuid}/resources`;
  mdText = mdText.replace(new RegExp("./resources", "g"), resourcePath);
  return md.render(mdText);
};

export const getConfigPathSync = () => {
  const docPath = remote.app.getPath("documents");
  return path.join(docPath, ".coder-notebook-config.json");
};

export const getAppPathSync = () => {
  const configPath = getConfigPathSync();
  const config = fs.readJsonSync(configPath);
  const dataPath = config.dataPath;
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
  const docPath = remote.app.getPath("documents");
  const configPath = getConfigPathSync();
  if (isFile(configPath)) {
    return;
  }
  await fs.outputJson(configPath, {
    name: pkg.name,
    version: pkg.version,
    dataPath: `${docPath}/CODER_NOTEBOOK`,
    bg: "light-bg1",
    theme: "light",
    language: "zh-CN",
    leftWidth: "200px",
    middleWidth: "200px",
    kis: {
      host: "",
      username: "",
      password: "",
      token: "",
    },
  });
  const appPath = getAppPathSync();
  await fs.ensureDir(appPath);
  await createNotebook("Inbox", "Inbox");
  await createNotebook("Tutorial", "Tutorial");
  await createNotebook("Trash", "Trash");
};

export const getConfig = async () => {
  const configPath = getConfigPathSync();
  const config = await fs.readJson(configPath);
  return config;
};

export const setConfig = async (key, val) => {
  const configPath = getConfigPathSync();
  const config = await getConfig();
  config[key] = val;
  await fs.outputJson(configPath, config);
};

export const setFullConfig = async (config) => {
  const configPath = getConfigPathSync();
  await fs.outputJson(configPath, config);
};

export const moveDataFolder = async (targetPath) => {
  const appPath = getAppPathSync();
  await fs.move(appPath, targetPath);
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
    meta.type = meta.type || "MARKDOWN";
    noteMetas.push(meta);
  }
  return noteMetas.sort((a, b) => b.created_at - a.created_at);
};

export const getNote = async (notebookUuid, noteUuid) => {
  const appPath = getAppPathSync();
  const notePath = path.join(appPath, notebookUuid, noteUuid);
  const metaJson = await fs.readJson(path.join(notePath, "meta.json"));
  const contentJson = await fs.readJson(path.join(notePath, "content.json"));
  return {
    ...metaJson,
    content: contentJson.content,
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

export const createNote = async (notebookUuid, type) => {
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
    type,
  });
  await fs.outputJson(contentPath, {
    title: defaultTitle,
    content: "",
  });
  return noteUuid;
};

export const createKisNote = async (notebookUuid, meta, content) => {
  const appPath = getAppPathSync();
  const noteUuid = uuid();
  const metaPath = path.join(appPath, notebookUuid, noteUuid, "meta.json");
  const contentPath = path.join(appPath, notebookUuid, noteUuid, "content.json");
  meta.uuid = noteUuid;
  await fs.outputJson(metaPath, meta);
  await fs.outputJson(contentPath, content);
  return noteUuid;
};

export const updateKisNote = async (notebookUuid, noteUuid, meta, content) => {
  const appPath = getAppPathSync();
  const metaPath = path.join(appPath, notebookUuid, noteUuid, "meta.json");
  const contentPath = path.join(appPath, notebookUuid, noteUuid, "content.json");
  meta.uuid = noteUuid;
  meta.updated_at = +new Date();
  await fs.outputJson(metaPath, meta);
  await fs.outputJson(contentPath, content);
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

export const updateNoteContent = async (notebookUuid, noteUuid, noteContent) => {
  const appPath = getAppPathSync();

  const metaPath = path.join(appPath, notebookUuid, noteUuid, "meta.json");
  const meta = await fs.readJson(metaPath);
  meta.updated_at = +new Date();
  await fs.outputJson(metaPath, meta);

  const contentPath = path.join(appPath, notebookUuid, noteUuid, "content.json");
  const content = await fs.readJson(contentPath);
  content.content = noteContent;
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

export const forceRemoveNotebook = async (notebookUuid) => {
  const appPath = getAppPathSync();
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

export const clearTrash = async () => {
  const appPath = getAppPathSync();
  await fs.remove(path.join(appPath, "Trash"));
  await createNotebook("Trash", "Trash");
};

export const saveImage = async (notebookUuid, noteUuid, imgBlob) => {
  const appPath = getAppPathSync();
  const imgUuid = uuid();
  const resourcePath = path.join(appPath, notebookUuid, noteUuid, "resources");
  const imgPath = path.join(resourcePath, `${imgUuid}.jpg`);
  await fs.ensureDir(resourcePath);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(imgBlob);
    reader.onload = (event) => {
      const base64 = event.target.result;
      const file = base64.replace(/^data:image\/\w+;base64,/, "");
      try {
        fs.writeFileSync(imgPath, file, { encoding: "base64" });
        resolve(`./resources/${imgUuid}.jpg`);
      } catch (e) {
        reject(e);
      }
    };
  });
};

export const isNoteExisted = (notebookUuid, noteUuid) => {
  const appPath = getAppPathSync();
  const metaPath = path.join(appPath, notebookUuid, noteUuid, "meta.json");
  return isFile(metaPath);
};
