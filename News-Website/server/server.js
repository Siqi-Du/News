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




//for detailed article and search results
function get_valid_articles_n(articles) {
    console.log("get_valid_articles_n");
    let arts = [];
    for (let i = 0; i < articles.length; i++) {
        let newArticle = {};
        let article = articles[i];
        newArticle['id'] = i;
        newArticle['source'] = "NYTIMES";
        try {
            //https://www.nytimes.com/
            newArticle['article_id'] = article['web_url'].substr(24);
            // console.log(newArticle['article_id']);
            newArticle['title'] = article['headline']['main'];
            newArticle['section'] = article['section_name'].toUpperCase();
            newArticle['date'] = getDate(article['pub_date']);
            newArticle['description'] = article['abstract'];
        } catch (e) {
            continue;
        }

        try {
            let imgs = article['multimedia'];
            for (let j = 0; j < imgs.length; j++) {
                if (imgs[j]['width'] >= 2000) {
                    newArticle['img'] = 'https://www.nytimes.com/' + imgs[j]['url'];
                    break;
                }
                else continue;
            }
            if (newArticle['img'] == null) {
                throw new Error('now Img width >= 2000');
            }
        } catch (e) {

            newArticle['img'] = 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg';
        }
        arts.push(newArticle);
    }
    return arts;
}

function get_valid_articles(articles, source) {
    console.log("In Function get_valid_articles with source:" + source);
    // console.log(articles.length);
    let arts = [];

    if (source === "g") {
        // articles = articles['response']['results'];
        for (let i = 0; i < articles.length; i++) {
            let newArticle = {};
            let article = articles[i];
            newArticle['id'] = i;
            newArticle['source'] = "GUARDIAN";
            try {
                newArticle['article_id'] = article['id'];
                newArticle['section'] = article['sectionId'].toUpperCase();
                newArticle['date'] = getDate(article['webPublicationDate']);
                newArticle['title'] = article['webTitle'];
                newArticle['url'] = article['webUrl'];
                newArticle['description'] = article['blocks']['body']['0']['bodyTextSummary'];
            } catch (e) {
                continue;
            }

            try {
                let ims = article['blocks']['main']['elements']['0']['assets'];
                newArticle['img'] = ims[ims.length - 1]['file'];
            } catch (e) {
                newArticle['img'] = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
            }
            arts.push(newArticle);
        }
    }
    if (source === "n") {

        for (let i = 0; i < 10; i++) {
            let newArticle = {};
            let article = articles[i];
            newArticle['id'] = i;
            newArticle['source'] = "NYTIMES";
            try {
                newArticle['article_id'] = article['url'].substr(24);
                newArticle['title'] = article['title'];
                newArticle['section'] = article['section'].toUpperCase();
                newArticle['date'] = getDate(article['published_date']);
                newArticle['description'] = article['abstract'];
                newArticle['url'] = article['url'];
            } catch (e) {
                continue;
            }

            try {
                let imgs = article['multimedia'];
                for (let j = 0; j < imgs.length; j++) {
                    if (imgs[j]['width'] >= 2000) {
                        newArticle['img'] = imgs[j]['url'];
                        break;
                    }
                    else continue;
                }
                if (newArticle['img'] == null) {
                    throw new Error('now Img width >= 2000');
                }
            } catch (e) {
                newArticle['img'] = 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg';
            }
            arts.push(newArticle);
        }
    }

    return arts;
}

function getDate(date) {
    var date = new Date(date);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    return year + '-' + month + '-' + strDate;
}


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
//
// function get_section_articles(news){
//    console.log(news.length);
//    let arts = [];
//
//    for(let i = 0; i < news.length; i++){
//        let newArticle = {};
//        let article = news[i];
//        newArticle['id'] = i;
//        try {
//            newArticle['url'] = "https://www.theguardian.com/" + article['id'];
//            newArticle['article_id'] = article['id'];
//            newArticle['section'] = article['sectionName'];
//            newArticle['time'] = convertTime(article['webPublicationDate']);
//            newArticle['title'] = article['webTitle'];
//        } catch(e){
//            continue;
//        }
//        try{
//            let ims = article['blocks']['main']['elements'][0]['assets'];
//            newArticle['img'] = ims[ims.length - 1]['file'];
//            if (newArticle['img'] == null) {
//                newArticle['img'] = "default-guardian";
//            }
//        } catch(e){
//            newArticle['img'] = "default-guardian";
//        }
//
//        arts.push(newArticle);
//    }
//    return arts;
// }
// function get_detailed_article(news){
//    console.log("In Function get_detailed_article");
//
//    var descString = "";
//        let newArticle = {};
//
//        newArticle['url'] = news['webUrl'];
//        newArticle['section'] = news['sectionName'];
//        newArticle['time'] = convertTimeForDetail(news['webPublicationDate']);
//        newArticle['title'] = news['webTitle'];
//        var contents = news['blocks']['body'];
//        for (ht in contents){
//            descString += contents[ht]["bodyHtml"];
//        }
//        newArticle['description'] = descString;
//
//        try{
//            let ims = news['blocks']['main']['elements']['0']['assets'];
//            newArticle['img'] = ims[ims.length - 1]['file'];
//
//            if (newArticle['img'] == null) {
//                newArticle['img'] = "default-guardian";
//            }
//        } catch(e){
//            newArticle['img'] = "default-guardian";
//        }
//
//    return newArticle;
// }
//
// function convertTimeForDetail(date){
//    var date = new Date(date);
//    // var year = date.getFullYear();
//    // var month = date.getMonth() + 1;
//    // var strDate = date.getDate();
//    var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//    date = date.getDate()+" "+month[date.getMonth()+1]+" "+date.getFullYear();
//
//    console.log(date)
//    return date;
// }

// function convertTime(date){
//     console.log(date);
//     var datePub = new Date(date);
//
//     var timeNow = new Date();
//     var minute = 1000 * 60;
//     var hour = minute * 60;
//     var day = hour * 24;
//     var month = day * 30;
//     var diffValue = timeNow - datePub;
//
//     var diffMonth = diffValue / month;
//     var diffWeek = diffValue / (7 * day);
//     var diffDay = diffValue / day;
//     var diffHour = diffValue / hour;
//     var diffMinute = diffValue / minute;
//
//     if (diffMonth > 1) {
//         result = parseInt(diffMonth) + "month ago";
//     }
//     else if (diffWeek > 1) {
//         result = parseInt(diffWeek) + "week ago";
//     }
//     else if (diffDay > 1) {
//         result = parseInt(diffDay) + "d ago";
//     }
//     else if (diffHour > 1) {
//         result = parseInt(diffHour) + "h ago";
//     }
//     else if (diffMinute > 1) {
//         result = parseInt(diffMinute) + "m ago";
//     }
//     else {
//         result = "just now";
//     }
//     return result;
//
// }

//------------------ private functions
app.get("*", function (req, res) {
    res.send("Gua!Gua!Gua!");
});

app.listen(port);

