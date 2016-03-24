Template.header.helpers({
  activeRouteClass: function(/* route names */) {
    var args = Array.prototype.slice.call(arguments, 0);
    args.pop();

    var active = _.any(args, function(name) {
      return Router.current() && Router.current().route.getName() === name
    });

    return active && 'active';
  }
});

Template.header.events({
  'click .nytimes': function(){
    Meteor.call('addNyt', function (error, result) {
      if (error)
        return throwError(error.reason);
    });
  }
})

Template.header.events({
  'click .rss': function(){
    Meteor.call('feedScrape', function (error, result) {
      if (error)
        return throwError(error.reason);
    });
  }
})
