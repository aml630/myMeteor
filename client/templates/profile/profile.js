
Template.profiles.helpers({

// abstract: function () {
//     HTTP.call('GET', 'http://api.nytimes.com/svc/mostpopular/v2/mostshared/all-sections/1.json?api-key=c0e4794e7b545f96cb1a4fd559135ba3:2:62311748', {}, function( error, responses) {
//     if ( error ) {
//       console.log( error );
//     } else {
//       console.log(responses);
//       var x = responses.data.results[0].title;
//       console.log(x);
//       console.log(responses.data.results[0].title);
//       console.log(responses.data.results[0].url);
//       // return response;
//
//     }
//
//   });
// },

abstract: function () {

 $.get('http://api.nytimes.com/svc/mostpopular/v2/mostemailed/all-sections/1.json?api-key=c0e4794e7b545f96cb1a4fd559135ba3:2:62311748').then(function(foundArticles){

    for(var i = 0; i <=10; i++){
    $('.articles').append("<li><a href = " + foundArticles.results[i].url +">"+ foundArticles.results[i].abstract+"</a></li>");

  }
  var title1 = foundArticles.results[0].abstract;
  console.log(title1)

  return title1
});




},



test: function () {
console.log('hey')
}

});
