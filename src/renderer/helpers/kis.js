import $ from "jquery";
import { createNotebook, forceRemoveNotebook, createKisNote, updateKisNote } from "@/helpers/util";

export const blogToMeta = (blog) => {
  return {
    id: blog.id,
    pathname: blog.pathname,
    status: blog.status,
    title: blog.title,
    summary: blog.summary,
    tagIds: blog.Tags ? blog.Tags.map((item) => item.id) : [],
    categoryId: blog.Category ? blog.Category.id : "",
    type: blog.type,
    created_at: +new Date(blog.updatedAt),
    updated_at: +new Date(blog.updatedAt),
  };
};

export const syncAllBlogs = async ({ host, token, notebookName }) => {
  const listRes = await $.ajax(`${host}/api/v1/blogs`, {
    type: "GET",
    headers: { token },
  });
  if (!listRes.success) {
    throw new Error(listRes.message);
  }
  const kisNotebookUuid = "KIS_NOTEBOOK";
  await forceRemoveNotebook(kisNotebookUuid);
  await createNotebook(notebookName, kisNotebookUuid);
  const blogs = listRes.data;
  for (let i = 0; i < blogs.length; i++) {
    const blog = blogs[i];
    await createKisNote(kisNotebookUuid, blogToMeta(blog), { title: blog.title, content: blog.content });
  }
};

export const syncBlog = async (options) => {
  const { host, token, id, uuid } = options;
  const res = await $.ajax(`${host}/api/v1/blog/${id}`, {
    type: "GET",
    headers: { token },
  });
  if (!res.success) {
    throw new Error(res.message);
  }
  const blog = res.data;
  await updateKisNote("KIS_NOTEBOOK", uuid, blogToMeta(blog), { title: blog.title, content: blog.content });
};

export const updateBlog = async (options) => {
  const { host, token, id, pathname, title, summary, content, categoryId, tagIds, status } = options;
  if (id) {
    return $.ajax(`${host}/api/v1/blog/${id}`, {
      type: "PUT",
      headers: { token },
      data: {
        title,
        content,
        pathname,
        summary,
        categoryId,
        tagIds,
        status,
      },
    });
  } else {
    return $.ajax(`${host}/api/v1/blog`, {
      type: "POST",
      headers: { token },
      data: {
        title,
        content,
        pathname,
        summary,
        categoryId,
        tagIds,
        status,
      },
    });
  }
};

export const getCategories = async (options) => {
  const { host, token } = options;
  const res = await $.ajax(`${host}/api/v1/categories`, {
    type: "GET",
    headers: { token },
  });
  let list = [];
  if (res.success) {
    list = res.data;
  }
  return list;
};

export const getTags = async (options) => {
  const { host, token } = options;
  const res = await $.ajax(`${host}/api/v1/tags`, {
    type: "GET",
    headers: { token },
  });
  let list = [];
  if (res.success) {
    list = res.data;
  }
  return list;
};
