Meteor.publish('booksSearch', function(query) {
  console.log("hi from server")

  var self = this;
  try {
    var response = HTTP.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: query
      }
    });

    console.log(response.data.items);

    _.each(response.data.items, function(item) {
      var doc = {
        thumb: item.volumeInfo.imageLinks.smallThumbnail,
        title: item.volumeInfo.title,
        link: item.volumeInfo.infoLink,
        snippet: item.searchInfo && item.searchInfo.textSnippet
      };

      self.added('books', Random.id(), doc);
    });

    self.ready();

  } catch(error) {
    console.log(error);
  }
  console.log(response);

});
