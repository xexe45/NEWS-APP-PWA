$(document).ready(function() {

    var url = window.location.href;

    var swLocation = '/news_app/sw.js';

    if (navigator.serviceWorker) {

        if (url.includes('localhost')) {
            swLocation = '/sw.js';
        }
        navigator.serviceWorker.register(swLocation);
    }

    // REFERENCIAS
    const sidenav = $('.sidenav');
    const search = $('#search');
    const side = $('#mobile-demo');

    // CONSTANTES
    const API_KEY = 'f213c44f6c2340e3ad7f93d9850cf4c9';
    const API_COUNTRY = 'us';
    const API_PAGE = 1;
    const API_URL = `https://newsapi.org/v2/top-headlines?country=${API_COUNTRY}&apiKey=${API_KEY}`;
    const API_CATEGORIES = ['home', 'business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
    // MATERIALIZE OPTIONS
    sidenav.sidenav();


    // init
    getNews(API_URL);

    $.each(API_CATEGORIES, function(index, value) {
        const href = `<li><a class="mobile-item" href="${value}">${value}</a></li>`;
        side.append(href);
    });


    $('.mobile-item').on('click', function(e) {
        e.preventDefault();
        const category = $(this).attr('href');
        if (category == 'home') {
            getNews(API_URL);
            return;
        }
        const API_CATEGORIES_RESULTS = `${API_URL}&category=${category}`;
        getNews(API_CATEGORIES_RESULTS);
    });

    search.on('keyup', function() {

        let q = $(this).val();

        if (q.length == 0) {
            getNews(API_URL);
            return;
        }

        const API_QUERY_URL = `https://newsapi.org/v2/everything?apiKey=${API_KEY}&q=${q}`;

        getNews(API_QUERY_URL);

    });

});

function getNews(apiurl) {
    fetch(apiurl)
        .then(response => response.json())
        .then(news => {
            if (news.status == 'ok') {
                const data = news.articles;
                let html = '';
                data.forEach(element => {
                    html += `
                    <div class="col s12">
                    <div class="card">
                        <div class="card-image">
                            <img src="${element.urlToImage}">
                        </div>
                        <div class="card-content ">
    
                            <span class="card-title ">
                                ${element.title}
                            </span>
                            <div class="row flex-padre">
                                <div class="col s6">
                                    <i class="small material-icons">account_circle</i>
                                    <p>${element.author}</p>
                                </div>
                                <div class="col s6">
                                    <i class="small material-icons">access_time</i>
                                    <p>${element.publishedAt}</p>
                                </div>
                            </div>
                            
                            <p>
                                ${element.description}
                            </p>
                        </div>
                        <div class="card-action ">
                            <a href="# ">Go to notice!</a>
                        </div>
                    </div>
    
                </div>
                    `;
                });

                document.getElementById('news').innerHTML = html;
            }
        })
}