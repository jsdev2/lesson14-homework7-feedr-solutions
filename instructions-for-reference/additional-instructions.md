## Extra notes on the Feedr project:

- Treat switching between news sources as a bonus. Do that as your first bonus, if you start into the bonuses. But in the meantime, just ignore the dropdown with the three news sources, in the upper right hand corner of the page.

- You will notice that the Reddit API does not provide anything like a "content" field for each article, which the instructions call for on the article detail page. You can do whatever you want to get around this. In my implementation, I just used the article's `title` field for both the title and the content on the page, so it's repeated.

- The current state of the Feedr head-start code is in this folder, at https://github.com/jsdev2/lesson-14-in-class-finished/tree/master/feedr-project

### Here are some things I have done in my code, and some tips:

1. I changed the HTML file so that the popup with the Pac-Man loading icon is NOT hidden to start out with, and then when we download the articles, we hide the loading popup then. (All other changes I made are in the JS file)

2. I made an "articleToHTML" function which basically creates a big HTML string to be passed to jQuery. (This is exactly what template systems like Handlebars do under the hood). I know I said in class this is ugly, but I take that back for large amounts DOM elements that you need to generate — definitely if you're not using templates, building a huge string of HTML is a totally reasonable option.

3. I made a "relevantPropertiesOnly" function, to cut the article data down to an easily viewable level when I console.log it (more fields — for the article detail page — will have to be added later, but this is enough for now).

### Tips for next steps:

- You will probably need to have access to your main array of article data from multiple places in your code, because you'll need it both to display the main feed and to display article details in the popup. How can we let all the functions get at it? By using closures! Declare an 'articles' variable (or whatever you want to call it) at the top level, and then all the rest of your functions will have access to it. Make sure to declare your variable using `var articles` at the top level, but don't use `var articles =` in your response handling function when your data is coming back from the Ajax call, because you want to mutate the main top-level variable, you don't want to declare a new local one. Inside the response-handling function, you just want to say `articles =`.

- In order to be able to fetch the right article details when the user clicks on one of the articles in the feed, you'll need to have some way to figure out the index number of the article the person clicked on. There are many ways to do this, but here is one, which makes use of a couple of jQuery functions we haven't talked about (`.filter()`, `.index()`) to set a delegated event listener on the container for the articles, listening for when article titles are clicked on and then searching up the DOM tree to the article element, then figuring out what is the index of the article element is among all the other article elements:

```js
$('#main.container').on('click', '.article a', function(event) {
  var index = $(this).parents().filter('.article').index();
  // Do what you need to do with the index
});
```
Alternatively, you could use a `forEach` loop to add an event listener to every item in the feed, and it could contain the appropriate index for each listener, contained in a closure:

```js
articles.forEach(function(article, index) {
  // the .eq() function gets a new jQuery object 
  // out of a collection of other ones, using an index 
  $('.article').eq(index).on('click', function(event) {
    // We have access to a different copy of the `index` 
    // variable in a closure for each time through the
    // `forEach` loop, so we can do what we want with it here.
  });
});
```
but a major drawback of the second way is that you have to add and remove event listeners whenever you add and remove items from the news feed. In my opinion, the first way is better.

- If you do what we are calling the first bonus and start adding multiple news sources (like Mashable, Digg), think about what that will mean for your code, and your data coming down. How will you deal with the fact that one of your current keys, for the topic tag, is called "subreddit"? How will you deal with the fact that your `handleResponse` function is very hard-coded right now to deal with the Reddit response? How will you standardize the data coming from the three sources? How will you abstract out all the code that is common to dealing with the three sources, so that you only have to write it once?