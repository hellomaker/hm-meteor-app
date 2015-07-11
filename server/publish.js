Meteor.publish( 'workshops', function() {
  return Workshops.find();
});
