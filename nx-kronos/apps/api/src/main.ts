import * as cheerio from 'cheerio';
import cors from 'cors';
import util from 'util';
import child_process from 'child_process';
import express from 'express';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const server = express();
server.use(cors());
server.options('*', cors());

const exec = util.promisify(child_process.exec);
async function curlit(url) {
    try {
        const {
            stdout,
            stderr
        } = await exec(`curl -sL ${url}`);
        return stdout;
    } catch (e) {
        // throw error
        console.error(e);
    }
}
server.get("/", (req, res, next) => {
    res.json({
        status: "success",
        message: "Nothing here!"
    });
});
server.get("/proxy_curl", (req, res, next) => {
    (async () => {
        const {
            url
        } = req.query;
        const data = await curlit(url);
        res.json({
            status: "success",
            message: "",
            data: data
        });
    })()
});
server.get("/getGitHubTrendingDaily", (req, res, next) => {
    (async () => {
        const {
            url
        } = req.query;
        const data = await curlit('https://github.com/trending/typescript?since=daily');
        const $ = cheerio.load(data);
        const article = $('article');

        // type TRepoItem = {
        //     id: number,
        //     name: string,
        //     description:string,
        //     created_at:string,
        //     watchers_count:number,
        //     stargazers_count:number,
        //     owner:{avatar_url:string} 
        //   }


        const arr = [];

        article.each((i, elem) => {
            arr.push(
                {
                    id:i,
                    name: $(elem).find('h2 > a').text().trim().replace(/^\s+|\s+$|\n/g, ''),
                    description: $(elem).find('h2 + p').text().trim().replace(/^\s+|\s+$|\n/g, ''),
                    stargazers_count: $(elem).find('h2 + p + div > *:nth-child(2)').text().trim().replace(/^\s+|\s+$|\n/g, ''),
                }
            );
        });


        res.json({
            status: "success",
            message: "",
            items: arr
        });
    })()
});

server.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});