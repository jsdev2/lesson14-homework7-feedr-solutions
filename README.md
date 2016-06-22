### Feedr Project Solution folders

Several versions of the Feedr project are included in this folder. Each one builds on the last:

1. What we got done with when we went over it in class Monday, June 20, not including the bit we did at the end where we started to break it into feeds from multiple sources. (It also has a couple of minor embellishments like an error thrown by the `setView` function if you pass in something besides "loader", "feed" or "detail")

2. With the exception of using multiple API sources, this version contains the remainder of the non-bonus requirements (it enables the search input to open and close when you click on it, it provides for error handling in the Ajax call, and clicking on the Feedr logo brings us back to the feed).

3. This version adds the ability to choose from the three news feeds in a dropdown. All of the API-specific info and code is at the top of the file (basically, the URL and the functions that process the responses), and the rest is all generic.
