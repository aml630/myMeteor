Meteor.publish('posts', function(options) {
  //this publish takes in an object that tells you what to publish
  //publishing master post list for main  page
  check(options, {
    sort: Object,
    limit: Number
  });
  //make sure that the sort is an object and the limit is a number
  return Posts.find({}, options);
  //retrieve posts based on the options input
});


Meteor.publish('userPosts', function(id) {
  check(id, String);

  return Posts.find(id);
});

Meteor.publish('singlePost', function(id) {
  check(id, String);
  //this publish takes in an id, checks to see its a string, and finds based on that.
  return Posts.find(id);
});



Meteor.publish('comments', function(postId) {
  check(postId, String);
  return Comments.find({postId: postId});
  //meteor.publish usually find mongo commands
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
});
