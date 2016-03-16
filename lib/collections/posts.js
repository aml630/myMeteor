Posts = new Mongo.Collection('posts');

//Once insecure is removed you have to allow any access to the DB from teh client.
//You could do exactly the same thing with a meteor method
Posts.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); },
});

//userId comes with the login package.

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

Meteor.methods({
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
  }
});
