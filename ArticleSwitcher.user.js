// ==UserScript==
// @name         Article Switcher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Capi 2 Mio Artikel ändern auf aktuellen DU Artikel
// @author       You
// @match        http://www.rapupdate.de/erster-deutscher-rapper-hat-jetzt-2-millionen-fans/
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';
    window.setInterval(function(){
        var link = getArticleLink();
    },1000);
    // Your code here...
})();

function getArticleLink(){
    //console.log("getArticleLink");
    GM_xmlhttpRequest ( {
        method:     "GET",
        url:        "http://www.deinupdate.de/?feed=rss2",
        onload:     function (response) {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(response.responseText,"text/xml");
            var links = [];
            var docs = xmlDoc.getElementsByTagName("item");
            for (var i=0; i < docs.length; i++){
                links.push(docs[i].getElementsByTagName("link")[0].innerHTML);
            }
            var link = xmlDoc.getElementsByTagName("item")[0].getElementsByTagName("link")[0].innerHTML;
            //console.log(links);
            if (document.title != xmlDoc.getElementsByTagName("item")[0].getElementsByTagName("title")[0].innerHTML){
                getArticle(link);
            }else{
                //console.log("Titel: " + xmlDoc.getElementsByTagName("item")[0].getElementsByTagName("title")[0].innerHTML);
            }
        }
    } );
}

function getArticle(link){
    //console.log("getArticles");
        GM_xmlhttpRequest ( {
            method:     "GET",
            url:        link,
            onload:     function (response) {
                var parser = new DOMParser();
                var htmlDoc = parser.parseFromString(response.responseText,"text/html");
                //console.log(htmlDoc.getElementsByTagName("article"));
                //var link = xmlDoc.getElementsByTagName("item")[0].getElementsByTagName("link")[0].innerHTML;
                editContent(htmlDoc,link);

            }
        } );
    
}

function editContent(article,link){
    console.log("editContent");
    var header = article.getElementsByTagName("h2")[0].getElementsByTagName("a")[0].innerHTML;
    var headerTree = article.getElementsByTagName("header")[1];
    console.log(headerTree);
    var articleTree = article.getElementsByClassName("rhonda-full-entry")[0];
    var scripts = articleTree.getElementsByTagName("script");
    var imgLink = headerTree.getElementsByTagName("img")[0].src.replace("http:","https:");
    console.log(imgLink);
    console.log($(".wp-post-image"));
    $(".wp-post-image").attr("src",imgLink);
    $(".wp-post-image").attr("srcset",imgLink);
    var remScripts=[];
    for (var i = 0;i<scripts.length;i++){
        if(articleTree.getElementsByTagName("script")[i].src == "" || articleTree.getElementsByTagName("script")[i].src == undefined){
            remScripts.push(i);
        }
    }
    console.log(remScripts)
    for (var j=0;j<remScripts.length;j++){
        var index = remScripts-j;
        articleTree.getElementsByTagName("script")[index].remove();
    }
   console.log("Check image Src");
    for (var k = 0; k<articleTree.getElementsByTagName("img").length;k++){
        //console.log(textTree.getElementsByTagName("img")[k].src+": "+textTree.getElementsByTagName("img")[k].src.indexOf("deinupdate"));
        if (articleTree.getElementsByTagName("img")[k].src.indexOf("deinupdate")>-1){
            articleTree.getElementsByTagName("img")[k].src = articleTree.getElementsByTagName("img")[k].src.replace("http:","https:");
            articleTree.getElementsByTagName("img")[k].srcset = articleTree.getElementsByTagName("img")[k].srcset.replace("http:","https:");
        }
    }
    //textTree.getElementById("vc-feelback-main").remove();
    var text = articleTree.innerHTML;
    var test = $($("h1")[0]).find("a");
    test.html(header)
    test.attr("href",link);
    $("article").find("p").remove();
    $("article").find("h4").remove();
    $("article").find("span").remove();
    var container = document.createElement("div");
    container.id = "articleContainer";
    container.innerHTML = text;
    $("article").find("h1").after(container);
    document.title = header;
}


