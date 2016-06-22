// OUR MAIN STATE VARIABLE:

// `articles` is the main data storage array for all the articles
// (often called "state" because its state is expected to 
// change throughout the running of the app).

// It will be available in closures everywhere in the code.
var articles = [];

// OUR INIT DATA:

// `sources` is our array of objects containing info about 
// the names and urls of specific sources, and how to render
// the results. None of the information in these objects will
// change.

// After this, and after the `handleRedditResponse`,
// `handleMashableResponse` and `handleDiggResponse`
// functions below, everything else in this file
// is generic and does not depend on specific APIs. 
// If you want to add another one, just add the basic
// info to the sources array, along with a function to
// handle the response, and everything will happen
// automatically.

var sources = [
  {
    displayName: 'Reddit',
    url: 'https://www.reddit.com/top.json',
    handleResponse: handleRedditResponse
  }, 
  {
    displayName: 'Mashable',
    url: 'https://accesscontrolalloworiginall.herokuapp.com/http://mashable.com/stories.json',
    handleResponse: handleMashableResponse
  }, 
  {
    displayName: 'Digg',
    url: 'https://accesscontrolalloworiginall.herokuapp.com/http://digg.com/api/news/popular.json',
    handleResponse: handleDiggResponse
  }
];

function handleRedditResponse(response) {
  // Grab the array from the rest of the data, then
  // grab only the "data" property from each object
  // in the array, then standardize the fields
  articles = response.data.children.map(function(item) {
    var article = item.data;
    return {
      // Reddit doesn't have content/description so we're substituting author
      description: article.author,
      score: article.score,
      link: "http://reddit.com" + article.permalink,
      tag: article.subreddit,
      title: article.title,
      thumbnail: article.thumbnail
    };
  });
  renderArticles();
}

function handleMashableResponse(response) {
  // Grab the array from the rest of the data, then
  // standardize the fields
  articles = response.new.map(function(article) {
    return {
      description: article.content.plain,
      // Just using total of all social media shares for "score"
      score: article.shares.total,
      link: article.link,
      tag: article.channel,
      title: article.title,
      // The third object in each of Mashable's "responsive_images" arrays
      // contains the link to the smallest image: 80x80px
      thumbnail: article.responsive_images[2].image
    };
  });
  renderArticles();
}

function handleDiggResponse(response) {
  articles = response.data.feed.map(function(article) {
    return {
      description: article.content.description,
      score: article.digg_score,
      link: article.content.url,
      // Digg has tags but there's an array of them for each article, 
      // and also they're boring, so we're using "kicker" instead
      tag: article.content.kicker,
      title: article.content.title,
      // Digg has tons of images randomly arranged in an array. We'll
      // take the first one and hope it's not too big.
      thumbnail: article.content.media.images[0].url
    }
  });
  renderArticles();
}

// After this point comes all the generic code that 
// isn't tied to a specific API.


// HELPER FUNCTIONS:

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

function fetchFromSource(source) {
  setView('loader');
  $('header .source-name').html(source.displayName);

  // The $.get function is a specialized version of the 
  // $.ajax function, which has more features but is slightly
  // less convenient than $.get for common cases. The $.get 
  // function does not do error callbacks, though, so we're 
  // using $.ajax now.
  $.ajax({
    method: 'GET',
    url: source.url,
    success: source.handleResponse.bind(source),
    error: function(error) {
      alert("Something terrible has happened: " + 
      error.status + " " + error.statusText);
    }
  });
}

// `articleToHTML` renders an html string from
// an article object (whose properties have already 
// been standardized by one of the three functions
// that handles responses from the different APIs).
function articleToHTML(article) {
  return '<article class="article">' +
         '  <section class="featuredImage">' +
         '    <img src="' + article.thumbnail + '" alt="" />' +
         '  </section>' +
         '  <section class="articleContent">' +
         '    <a href="#"><h3>' + article.title + '</h3></a>' +
         '    <h6>' + article.tag + '</h6>' +
         '  </section>' +
         '  <section class="impressions">' +
              article.score +
         '  </section>' +
         '  <div class="clearfix"></div>' +
         '</article>';
}


function renderArticles() {
  // Remove existing articles from DOM
  $('#main.container').empty();

  // Add new articles to DOM
  articles.forEach(function(article) {
    var renderedHTML = articleToHTML(article)
    $('#main.container').append(renderedHTML);
  });

  setView('feed');
}

// NOW FOR THE CODE THAT POPULATES THE DROPDOWN:

// (This function, and all the event listener functions
// below, are all run only once and don't
// entirely have to be functions, but I thought the descriptive
// names would help them be self-documenting code)

function populateDropdown() {
  sources.forEach(function(source) {
    var $a = $('<a href="#">').html(source.displayName);
    var $li = $('<li></li>').append($a);
    $('header ul.sources-dropdown').append($li);
  });
}


// NOW FOR THE EVENT LISTENERS

function setSourceDropdownListener() {
  $('header .sources-dropdown').on('click', 'li', function() {

    // Get the right source object, which we can do because the `li`s
    // in the dropdown in the DOM will be in the same order 
    // as the sources in the sources array.
    var index = $(this).index();
    var source = sources[index];

    fetchFromSource(source);
  });
}

function setArticleDetailListener() {
  $('#main.container').on('click', '.article', function(event) {

    // Get the right article object, which we can do because the 
    // article elements in the feed in the DOM will be in the 
    // same order as the ones in the articles array.
    var index = $(this).index();
    var article = articles[index];

    // Render the article in the detail view.
    $('#popUp h1').html(article.title);
    $('#popUp p').html(article.description);
    $('#popUp a.popUpAction').attr('href', article.link);

    setView('detail');
  });
}

function setSearchToggleListener() {
  // Toggle search input box open or closed
  // when clicking on the search icon
  // and when submitting a search
  var toggleSearch = function() {
    $('#search').toggleClass('active');
  }
  $('#search a').on('click', toggleSearch);
  $('#search input').on('keypress', function(event) {
    if (event.which === 13) { // 13 is the code for the `enter` key
      toggleSearch();
    }
  });
}

function setClosePopupListener() {
  // Go back to main feed when `X` is clicked in popup
  $('.closePopUp').on('click', function(event) {
    setView('feed');
  });
}

function setLogoDefaultFeedListener() {
  // Go back to default feed (the first item in the sources array)
  // when Feedr logo is clicked
  $('header .logo').on('click', function() {
    fetchFromSource(sources[0]);
  });
}

// AND NOW THE CODE THAT SETS IT ALL IN MOTION:

populateDropdown();

setSourceDropdownListener();
setArticleDetailListener();
setSearchToggleListener();
setClosePopupListener();
setLogoDefaultFeedListener();

// And... get the default feed:
fetchFromSource(sources[0]);





