https://siqi-du.github.io/News/
<img src="imgs/logo.jpg" />
<!--https://github.com/DUSiqi/News/blob/main/-->

News Project
=================
**This project includes a News Website and a corresponding iOS version application.**
<br/>
<br/>
The server retrieve latest news from The Guardian and NYTimes APIs and display to users. Users can choose to view news in different categories like Technology, Business or Sports. Users can also search news, share, bookmark, or comment on news they like. It is **responsive** on different device.

This website is now hosted on **AWS**. I uses **React** as the front-end framework and **Node.js** on the back-end with **Express** as the web server framework and I use the Model-View-Controller design pattern.

The iOS version is built with **Swift**. It reuses the website’s endpoints to fetch news. Besides all the functions of the website, it has a new trending module that can analyse search keyword trends through Google trends API.
<br/>
<br/>
<br/>
<br/>

Website
=================
Home Page
![HomePage](imgs/home.png)
<br/>

Search Result Page
![searchPage](imgs/search.png)
<br/>

View Article Page
![articlePage](imgs/detailed.png)
![comments](imgs/comments.png)
<br/>

Bookmark Page
![favoritePage](imgs/favorites.png)
<br/>

Live Demo
-----------------
[News Website](http://ec2-54-146-190-253.compute-1.amazonaws.com:3000/)

REST APIs
-----------------
**News Service**

<table>
    <tr>
        <th>Function</th>
        <th>HTTP Method</th>
        <th>Endpoint</th>
    </tr>
    <tr>
        <td>Get Latest News</td>
        <td>GET</td>
        <td>/rest/home?source=[source]</td>
    </tr>
    <tr>
        <td>Get News By Different Category</td>
        <td>GET</td>
        <td>/rest/[section]?source=[source]</td>
    </tr>
    <tr>
        <td>View News Article</td>
        <td>GET</td>
        <td>/rest/article?id=[article_id]&source=[source]</td>
    </tr>
    <tr>
        <td>Search for News</td>
        <td>GET</td>
        <td>/rest/search?q=[query]</td>
    </tr>
    <tr>
        <td>Get Search keyword trends</td>
        <td>GET</td>
        <td>/rest/trends?q=[keyword]</td>
    </tr>
</table>

Response are News list or news article returned in json
<br/>
<br/>

News App
=================
![AppArc](imgs/arc.png)
<br/>
Demo: [NewsApp](https://www.youtube.com/watch?v=LMdkY8jsmJY&feature=youtu.be)




