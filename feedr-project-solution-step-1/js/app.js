// THE DATA

// This is the main data storage array for all the articles
var articles = [];

// HELPER FUNCTIONS

// `articleToHTML` renders an html string from
// an article object.
function articleToHTML(article) {
  return '<article class="article">' +
         '  <section class="featuredImage">' +
         '    <img src="' + article.thumbnail + '" alt="" />' +
         '  </section>' +
         '  <section class="articleContent">' +
         '    <a href="#"><h3>' + article.title + '</h3></a>' +
         '    <h6>' + article.subreddit + '</h6>' +
         '  </section>' +
         '  <section class="impressions">' +
              article.score +
         '  </section>' +
         '  <div class="clearfix"></div>' +
         '</article>';
}

// This `setView` function isolates 
// the confusion about what the `hidden`
// and `loader` classes mean for the popup,
// so you only have to puzzle through it in
// your head once.
function setView(viewType) {
  var $popup = $('#popUp');

  if (viewType === 'loader') {
    $popup.removeClass('hidden');
    $popup.addClass('loader');
  } 
  else if (viewType === 'detail') {
    $popup.removeClass('hidden');
    $popup.removeClass('loader');
  } 
  else if (viewType === 'feed') {
    $popup.addClass('hidden');
  } 
  else {
    // This `else` clause is optional but useful
    // if you (the programmer) forget the system 
    // of viewTypes that you worked out, and 
    // use a wrong one.
    throw new Error("Only acceptable arguments to setView " +
                    "are 'loader', 'detail' and 'feed'");
  }
}

function handleResponse(response) {

  // Grab the array from the JSON response
  var childrenFromResponse = response.data.children;

  // Grab only the "data" property from each object
  // in the array.
  articles = childrenFromResponse.map(function(child) {
    return child.data;
  });

  console.log(articles);

  // Remove existing articles from DOM
  $('#main.container').empty();

  // Add new articles to DOM
  articles.forEach(function(article) {
    var renderedHTML = articleToHTML(article)
    $('#main.container').append(renderedHTML);
  });

  setView('feed');

}

// SET EVENT LISTENERS:

// Go to article detail
$('#main.container').on('click', '.article', function(event) {

  // Get the right article object, which we can do because the 
  // article elements in the feed in the DOM will be in the 
  // same order as the ones in the articles array.
  var index = $(this).index();
  var article = articles[index];

  // Render the article in the detail view.
  $('#popUp h1').html(article.title);
  $('#popUp p').html(article.author);
  $('#popUp a.popUpAction').attr('href', 'http://reddit.com' + article.permalink);

  setView('detail');
});

// Close popup
$('.closePopUp').on('click', function(event) {
  setView('feed');
});

// THE CODE THAT SETS EVERYTHING IN MOTION:

// Show the 'Pac-man' overlay
setView('loader');

// Fetch data from Reddit and away we go.
$.get('https://www.reddit.com/top.json', handleResponse);

