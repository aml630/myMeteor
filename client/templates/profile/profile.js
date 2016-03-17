
Template.profiles.helpers({

abstract: function () {
    HTTP.call('GET', 'http://api.nytimes.com/svc/mostpopular/v2/mostemailed/all-sections/1.json?api-key=c0e4794e7b545f96cb1a4fd559135ba3:2:62311748', {}, function( error, responses) {
    if ( error ) {
      console.log( error );
    } else {
      var ab = responses.data.results[0].abstract;
      console.log("my ab var: " + ab);
      Session.set("abstracts", responses.data.results[0].abstract)
     return ab;
    }
  });
},

singleAb: function () {
  return Session.get("abstracts");
}

});
