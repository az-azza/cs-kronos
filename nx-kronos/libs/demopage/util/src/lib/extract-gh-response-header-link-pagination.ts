export function extractGHResponseHeaderLinkPagination(
  link: string
): Record<string, number> | undefined {
  if (!link) {
    return undefined;
  }
  let links = {};
  const arr = link.split(',').map((part) => {
    const [url, name] = part.split(';');
    const usp =  new URLSearchParams(new URL(url.replace(/<(.*)>/, '$1')).search);
    return {
      url: url.replace(/<(.*)>/, '$1').trim(),
      name: name.replace(/rel="(.*)"/, '$1').trim(),
      page: usp.get('page'),
    };
  });
  links = arr.reduce((a, v) => {
    const par: Record<string, number> = {};
    par[v.name] = Number(v.page);
    return { ...a, ...par };
  }, {});
  return links;
}
