// ==UserScript==
// @name         Article Switcher
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Capi 2 Mio Artikel ändern auf aktuellen DU Artikel
// @author       You
// @match        http://www.rapupdate.de/erster-deutscher-rapper-hat-jetzt-2-millionen-fans/
// @match        http://www.rapupdate.de/150388-2/
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
        url:        "http://www.deinupdate.de/?feed=atom",
        onload:     function (response) {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(response.responseText,"text/xml");
            var links = [];
            var docs = xmlDoc.getElementsByTagName("entry");
            for (var i=0; i < docs.length; i++){
                links.push(docs[i].getElementsByTagName("id")[0].innerHTML);
            }
            var link = xmlDoc.getElementsByTagName("entry")[0].getElementsByTagName("id")[0].innerHTML;
            console.log(xmlDoc.getElementsByTagName("entry")[0].getElementsByTagName("title")[0].innerHTML);
            if ("<![CDATA["+document.title+"]]>" != xmlDoc.getElementsByTagName("entry")[0].getElementsByTagName("title")[0].innerHTML){
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
                var header = htmlDoc.getElementsByTagName("h2")[0].getElementsByTagName("a")[0].innerHTML;
                var test = $($("h1")[0]).find("a");
                if (test.html()!=header)editContent(htmlDoc,link);

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
    if (window.location.href.indexOf("150388-2")>-1){
        $("article").find("p:first").html('<img src="https://www.deinupdate.de/wp-content/uploads/2018/12/Screen-Shot-2018-12-09-at-02.33.05-750x480.png" class="wp-image-150375 attachment-medium_large size-medium_large wp-post-image" alt="" srcset="https://www.deinupdate.de/wp-content/uploads/2018/12/Screen-Shot-2018-12-09-at-02.33.05-750x480.png" sizes="(max-width: 730px) 100vw, 730px">')
    }
        $("article").find("p:not(:first)").remove();

    console.log($(".wp-post-image"));
    $(".wp-post-image").attr("src",imgLink);
    $(".wp-post-image").attr("srcset",imgLink);
    console.log($(".wp-post-image"));
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

    
    $("article").find("h4").remove();
    $("article").find("h2").remove();
    $("article").find("h3").remove();
    $("article").find("span").remove();
    if($("#articleContainer").length){
        $("#articleContainer").remove();
    }
    var container = document.createElement("div");
    container.id = "articleContainer";
    container.innerHTML = text;

    $("article").find("p:first").after(container);
    document.title = header.replace("&amp;","&");
}
