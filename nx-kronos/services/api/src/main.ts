import * as cheerio from 'cheerio';
import cors from 'cors';
import util from 'util';
import child_process from 'child_process';
import express from 'express';
import { TRepoItem } from '@kronos/types';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const server = express();
server.use(cors());
server.options('*', cors());

const exec = util.promisify(child_process.exec);
async function curlit(url) {
  try {
    const { stdout, stderr } = await exec(`curl -sL ${url}`);
    return stdout;
  } catch (e) {
    // throw error
    console.error(e);
  }
}
server.get('/', (req, res, next) => {
  res.json({
    status: 'success',
    message: 'Nothing here!',
  });
});

server.get('/mockrepos', (req, res, next) => {
  (async () => {
    const max_items = 100;
    const { per_page, page } = req.query;

    //console.log(per_page, page);

    const all_items = [];
    Array(max_items)
      .fill(0)
      .map((v, i) => {
        all_items.push(<TRepoItem>{
          id: i,
          name: 'name',
          description: 'desc',
          created_at: '',
          stargazers_count: 2345,
          watchers_count: 6789,
          owner: { avatar_url: '' },
        });
      });
    let paged_items = [...all_items];

    let url = req.protocol + '://' + decodeURIComponent(req.headers.host);
    const reqparams = new URLSearchParams(req.originalUrl);

    if (Number(page) && Number(per_page) && Number(per_page) > 0) {
      const pages_count = Math.floor(max_items / Number(per_page));

      let next_page = Number(page) + 1;
      if (next_page >= pages_count) {
        next_page = pages_count;
      }
      reqparams.set('page', String(next_page));

      paged_items = paged_items.slice(
        (Number(page) - 1) * Number(per_page),
        (Number(page) - 1) * Number(per_page) + Number(per_page)
      );
    }
    url += reqparams;
    res.set('link', `<${url}>; rel="next"`);
    res.json({
      status: 'success',
      message: 'Items here!',
      items: paged_items,
    });
  })();
});
server.get('/getGitHubTrendingDaily', (req, res, next) => {
  (async () => {
    const { url } = req.query;
    const data = await curlit(
      'https://github.com/trending/typescript?since=daily'
    );
    const $ = cheerio.load(data);
    const article = $('article');
    const arr = [];
    article.each((i, elem) => {
      arr.push(<TRepoItem>{
        id: i,
        name: $(elem)
          .find('h2 > a')
          .text()
          .trim()
          .replace(/^\s+|\s+$|\n/g, ''),
        description: $(elem)
          .find('h2 + p')
          .text()
          .trim()
          .replace(/^\s+|\s+$|\n/g, ''),
        created_at: '',
        stargazers_count: Number(
          $(elem)
            .find('h2 + p + div > *:nth-child(2)')
            .text()
            .trim()
            .replace(/^\s+|\s+$|\n/g, '')
        ),
        watchers_count: 0,
        owner: { avatar_url: '' },
      });
    });

    res.json({
      status: 'success',
      message: 'Items here!',
      items: arr,
    });
  })();
});

server.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
