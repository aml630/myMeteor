Posts = new Mongo.Collection('posts');

//Once insecure is removed you have to allow any access to the DB from teh client.
//You could do exactly the same thing with a meteor method
Posts.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); },


});


Posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    //if the input is without the url and the title keys, it should be empty
    //if its not empty, they are trying to put something you dont want
    //in your db
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
});

Posts.deny({
  update: function(userId, post, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
    return errors.title || errors.url;
  }
});

validatePost = function (post) {
  var errors = {};

  if (!post.title)
    errors.title = "Please fill in a headline";

  if (!post.url)
    errors.url =  "Please fill in a URL";

  return errors;
}

Meteor.setInterval(function(){
  Meteor.call('feedScrape');
}, 500000);


Meteor.methods({

  feedScrape: function() {
    console.log("RSS clicked")

    this.unblock();
///////////////////////////////////////////////////////
      redditData = Scrape.feed("https://www.reddit.com/r/aww.rss");
      // console.log(redditData)
      for(var i = 0; i < 15; i++){

        var user = Meteor.user();

        var post =  {
          title: redditData["items"][i].title,
          url: redditData["items"][i].link,
          userId: user._id,
          author: "RedditAww",
          submitted: new Date(),
          commentsCount: 0,
          upvoters: [],
          votes: 0,
          thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw42KK9RjNmHbJQEMjkkLkR54SWk1vw9yadD2NcKXwoGm9q9Is'
        };

        var postWithSameLink = Posts.findOne({url: redditData["items"][i].link});
        if (postWithSameLink) {
          console.log("nope, already have reddit")
        }else {
          var tweetPost = post.title;
          var tweetURL = post.url;
          check(tweetPost, String);
          check(tweetURL, String);
          Meteor.call('testTweet', tweetPost, tweetURL)
          Posts.insert(post);
        };
      }
///////////////////////////////////////////////////////
      //   feedData = Scrape.feed("http://feeds.feedburner.com/typepad/CuteOverload");
      //   // console.log(feedData);
      //   for(var i = 0; i < 1; i++){
      //
      //     var user = Meteor.user();
      //
      //     var post =  {
      //       title: feedData["items"][i].title,
      //       url: feedData["items"][i].link,
      //       userId: user._id,
      //       author: "CuteOverload",
      //       submitted: new Date(),
      //       commentsCount: 0,
      //       upvoters: [],
      //       votes: 0,
      //       thumb: feedData["items"][i].image
      //     };
      //
      //     var postWithSameLink = Posts.findOne({url: feedData["items"][i].link});
      //     if (postWithSameLink) {
      //       console.log("nope, already have cute")
      //     }else {
      //       Posts.insert(post);
      //     };
      //   }
      // return true;
  },

  // addNyt: function() {
  //   console.log("im clicked!")
  //
  //   this.unblock();
  //   try {
  //     var result = HTTP.call("GET", "http://api.nytimes.com/svc/mostpopular/v2/mostemailed/world/1.json?api-key=c0e4794e7b545f96cb1a4fd559135ba3:2:62311748").data;


  //pretty much only use meteor methods for inserting into a db
  postInsert: function(postAttributes) {
    //check is a add on package taht makes sure that a data bit is the right type
    //before putting it into the db
    check(this.userId, String);
    check(postAttributes, {
      title: String,
      url: String
    });

    var errors = validatePost(postAttributes);
    if (errors.title || errors.url)
      throw new Meteor.Error('invalid-post', "You must set a title and URL for your post");

    var postWithSameLink = Posts.findOne({url: postAttributes.url});
    if (postWithSameLink) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      }
    }

    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date(),
      commentsCount: 0,
      upvoters: [],
      votes: 0
    });

    var postId = Posts.insert(post);

    return {
      _id: postId
    };
  },

  upvote: function(postId) {
    check(this.userId, String);
    check(postId, String);

    var affected = Posts.update({
      _id: postId,
      upvoters: {$ne: this.userId}
      // $ne selects all documents except the one it points to.  ne = not equal
      // but also select that iD.  so it is specified to the post
      // in this case it wont let you upvote if you already have

    }, {
      $addToSet: {upvoters: this.userId},
      // $addToSet adds a value to an array unless its already present
      $inc: {votes: 1}
    });

    if (! affected)
      throw new Meteor.Error('invalid', "You weren't able to upvote that post");
  },

  testTweet: function (title, url) {
    check(title, String);
    check(url, String);
    var T = new Twit({
        consumer_key:'8Y7PHp5ENokWphZYiB2ZCRWda',
        consumer_secret:'yBu6gHkGdzgw9Qu43cRr8lTV6z645yk0xuBw0VEVAe6TXpMgv2',
        access_token:'4847689745-dozcUXEjCSRgQfDRWE748tcL03pgdkULVh7trvG',
        access_token_secret:'ALCGvoh7hSpu6Pnqa7QsmSwBi5akYvY18Y0lzKuyCU9xD'
    })

    T.post('statuses/update', { status: title + " " + url + " #cute"}, function(err, data, response) {
      console.log(data)
    })

  }
});
