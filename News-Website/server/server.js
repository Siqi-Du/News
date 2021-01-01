import './Utils.js';


//API_Keys
const API_KEY_G = "7d25d991-56d2-460e-87f3-14d5c3efd93e";
const API_KEY_NYT = "AiDzGxT3fhCSmpqZZIOpAwASLFzax5E4"; // appId:06c5fa11-983f-4408-8fe7-9e75f10d121b AiDzGxT3fhCSmpqZZIOpAwASLFzax5E4

const express = require("express");
const https = require('https');
const cors = require('cors');
const googleTrends = require('google-trends-api');
const port = 5000;

const app = express();
app.use(cors());

//-> hi
app.get("/", function (req, res) {
    var source = req.query['source'];
    var url = '';
    console.log("someone made a req to /" + ' with source:' + source);
    if (source == "g") {
        url = 'https://content.guardianapis.com/search?api-key=' + API_KEY_G + '&section=(sport|business|technology|politics)&show-blocks=all';
    }
    if (source == "n") {
        url = 'https://api.nytimes.com/svc/topstories/v2/home.json?api-key=' + API_KEY_NYT;
    }

    // console.log(url);
    https.get(url, (resp) => {
        let data = '';
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            if (source === "g") {
                data = JSON.parse(data)['response']['results'];
            }
            if (source === "n") {
                data = JSON.parse(data)['results'];
            }
            let articles_homt_g = get_valid_articles(data, source);
            // console.log(articles_homt_g);
            res.send(articles_homt_g); // as a response from the server
        });
    });
});

app.get("/article/", function (req, res) {
    let source = req.query['source'];
    let article_id = req.query['id'];
    let url = '';
    console.log(article_id);
    console.log("some one made an request to /article with id:" + article_id + "with source " + source);
    if (source === "n") {
        url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:("' + "https://www.nytimes.com/" + article_id + '")&api-key=' + API_KEY_NYT;

    } else {
        url = 'https://content.guardianapis.com/' + article_id + '?api-key=' + API_KEY_G + '&show-blocks=all';
    }

    console.log(url);

    https.get(url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            if (source === "g") {
                data = JSON.parse(data)['response']['content'];
                let art = [];
                art.push(data);
                let article_g = get_valid_articles(art, source);
                console.log(article_g);
                res.send(article_g[0]); // as a response from the server
            }
            if (source === "n") {
                data = JSON.parse(data)['response']['docs']['0'];
                let art = [];
                art.push(data);
                let article_n = get_valid_articles_n(art);
                console.log(article_n);
                res.send(article_n[0]); // as a response from the server
            }

        });
    });
});

app.get("/search", function (req, res) {
    // let source = req.query['source'];
    let query = req.query['q'];
    console.log("some one made an request to /search " + " with query:" + query);
    var url_g = 'https://content.guardianapis.com/search?q=' + query + '&api-key=' + API_KEY_G + '&show-blocks=all';
    var url_n = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + query + '&api-key=' + API_KEY_NYT;
    // console.log(url_g);
    console.log("aaaaaa", url_n);

    let art = [];
    let article_g = [];
    let article_n = [];

    https.get(url_g, (resp) => {
        let datag = '';
        resp.on('data', (chunk) => {
            datag += chunk;
        });

        resp.on('end', () => {
            datag = JSON.parse(datag)['response']['results'];

            article_g = get_valid_articles(datag, "g");

            https.get(url_n, (resp) => {
                let datan = '';
                resp.on('data', (chunk) => {
                    datan += chunk;
                });

                resp.on('end', () => {
                    datan = JSON.parse(datan)['response']['docs'];

                    article_n = get_valid_articles_n(datan);

                    art = article_g.concat(article_n);
                    let art4 = [];
                    let result = [];
                    for (let i = 0; i < art.length; i++) {
                        art[i].id = i;
                        art4.push(art[i]);
                        if ((i + 1) % 4 === 0) {
                            result.push(art4);
                            art4 = [];
                        }
                    }
                    if (art4.length !== 0) {
                        result.push(art4);
                        art4 = [];
                    }
                    // console.log(result);
                    res.send(result);
                    // console.log(article_n);
                    // console.log(article_g);
                });
            });

        });
    });

});

app.get("/:section", function (req, res) {
    var section_name = req.params.section;
    var source = req.query['source'];
    var url = '';
    console.log("someone made a req to /" + section_name + ' with source:' + source);
    if (source === "g") {
        url = 'https://content.guardianapis.com/' + section_name + '?api-key=' + API_KEY_G + '&show-blocks=all';
    }
    if (source === "n") {
        if (section_name === "sport") { section_name = "sports" }
        url = 'https://api.nytimes.com/svc/topstories/v2/' + section_name + '.json?api-key=' + API_KEY_NYT;
    }

    console.log(url);

    https.get(url, (resp) => {
        let data = '';
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            if (source === "g") {
                data = JSON.parse(data)['response']['results'];
            }
            if (source === "n") {
                data = JSON.parse(data)['results'];
            }

            let articles_section_g = get_valid_articles(data, source);
            // console.log(articles_section_g);
            res.send(articles_section_g); // as a response from the server
        });
    });
});



//trends
app.get("/trends", function (req, res) {
    let q = req.query['q'];
    console.log("some one made an request to /trends with query:" + q);
    googleTrends.interestOverTime({ keyword: q, startTime: new Date('2019-06-01') })
        .then(function (results) {
            // console.log("results",results);
            var data = JSON.parse(results)["default"]["timelineData"];
            // console.log(data);
            var values = []
            for (d in data) {
                values.push(data[d].value[0]);
            }
            console.log(values);
            res.send(values)
        })
        .catch(function (err) {
            console.error(err);
        });

});


//------------------ private functions
app.get("*", function (req, res) {
    res.send("Gua!Gua!Gua!");
});

app.listen(port);

