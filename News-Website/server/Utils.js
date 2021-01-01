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


 function get_section_articles(news){
    console.log(news.length);
    let arts = [];

    for(let i = 0; i < news.length; i++){
        let newArticle = {};
        let article = news[i];
        newArticle['id'] = i;
        try {
            newArticle['url'] = "https://www.theguardian.com/" + article['id'];
            newArticle['article_id'] = article['id'];
            newArticle['section'] = article['sectionName'];
            newArticle['time'] = convertTime(article['webPublicationDate']);
            newArticle['title'] = article['webTitle'];
        } catch(e){
            continue;
        }
        try{
            let ims = article['blocks']['main']['elements'][0]['assets'];
            newArticle['img'] = ims[ims.length - 1]['file'];
            if (newArticle['img'] == null) {
                newArticle['img'] = "default-guardian";
            }
        } catch(e){
            newArticle['img'] = "default-guardian";
        }

        arts.push(newArticle);
    }
    return arts;
 }


 function get_detailed_article(news){
    console.log("In Function get_detailed_article");

    var descString = "";
        let newArticle = {};

        newArticle['url'] = news['webUrl'];
        newArticle['section'] = news['sectionName'];
        newArticle['time'] = convertTimeForDetail(news['webPublicationDate']);
        newArticle['title'] = news['webTitle'];
        var contents = news['blocks']['body'];
        for (ht in contents){
            descString += contents[ht]["bodyHtml"];
        }
        newArticle['description'] = descString;

        try{
            let ims = news['blocks']['main']['elements']['0']['assets'];
            newArticle['img'] = ims[ims.length - 1]['file'];

            if (newArticle['img'] == null) {
                newArticle['img'] = "default-guardian";
            }
        } catch(e){
            newArticle['img'] = "default-guardian";
        }

    return newArticle;
 }


 function convertTimeForDetail(date){
    var date = new Date(date);
    // var year = date.getFullYear();
    // var month = date.getMonth() + 1;
    // var strDate = date.getDate();
    var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    date = date.getDate()+" "+month[date.getMonth()+1]+" "+date.getFullYear();

    console.log(date)
    return date;
 }

 function convertTime(date){
     console.log(date);
     var datePub = new Date(date);

     var timeNow = new Date();
     var minute = 1000 * 60;
     var hour = minute * 60;
     var day = hour * 24;
     var month = day * 30;
     var diffValue = timeNow - datePub;

     var diffMonth = diffValue / month;
     var diffWeek = diffValue / (7 * day);
     var diffDay = diffValue / day;
     var diffHour = diffValue / hour;
     var diffMinute = diffValue / minute;

     if (diffMonth > 1) {
         result = parseInt(diffMonth) + "month ago";
     }
     else if (diffWeek > 1) {
         result = parseInt(diffWeek) + "week ago";
     }
     else if (diffDay > 1) {
         result = parseInt(diffDay) + "d ago";
     }
     else if (diffHour > 1) {
         result = parseInt(diffHour) + "h ago";
     }
     else if (diffMinute > 1) {
         result = parseInt(diffMinute) + "m ago";
     }
     else {
         result = "just now";
     }
     return result;

 }