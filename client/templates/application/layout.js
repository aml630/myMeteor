Template.layout.onRendered(function() {
  this.find('#main')._uihooks = {
    insertElement: function(node, next) {
      $(node)
        .hide()
        .insertBefore(next)
        .fadeIn();
    },
    removeElement: function(node) {
      $(node).fadeOut(function() {
        $(this).remove();
      });
    }
  }
});

Template.layout.events({
  'click .dogButton': function (){
    $(".catStuff").hide();
    $(".dogStuff").show();

  },
  'click .catButton': function (){
    $(".dogStuff").hide();
    $(".catStuff").show();
  }

})
