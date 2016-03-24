Books = new Mongo.Collection('books');

Session.setDefault('searching', false);

Template.books.events({
  'submit form': function(event, template) {
    event.preventDefault();
    var query = template.$('input[type=text]').val();
    // console.log(query)
    if (query)
    // console.log("hey");

      Session.set('query', query);
      // console.log(Session);

  }
});

Tracker.autorun(function() {
  if (Session.get('query')) {
    var searchHandle = Meteor.subscribe('booksSearch', Session.get('query'));
    console.log(Books)
    Session.set('searching', ! searchHandle.ready());
  }
});



Template.books.helpers({
  books: function() {
    return Books.find();
  },
  searching: function() {
    return Session.get('searching');
  }
});
