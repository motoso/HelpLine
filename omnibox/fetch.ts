import type { PageList } from "./deps/scrapbox.ts";

export async function* getPages(project: string) {
  const pageList = await getPageList(project);
  yield pageList;
  const count = Math.floor(pageList.count / 1000) + 1;

  for (let i = 1; i < count; i++) {
    yield await getPageList(project, 1000, 1000 * i);
  }
}
async function getPageList(project: string, limit = 1000, skip = 0) {
  const res = await fetch(
    `https://scrapbox.io/api/pages/${project}?limit=${limit}&skip=${skip}`,
  );
  return (await res.json()) as PageList;
}

export async function getPage(project: string, title: string) {
  const res = await fetch(
    `https://scrapbox.io/api/pages/${project}/${encodeTitle(title)}/text`,
  );
  return await res.text();
}
const encodeTitle = (title: string) =>
  title.replaceAll(" ", "_").replace(
    /[/?#\{}^|<>]/g,
    (char) => encodeURIComponent(char),
  );
