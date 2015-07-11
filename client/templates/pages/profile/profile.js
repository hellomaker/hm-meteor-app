Template.profile.onCreated( function() {
  Meteor.subscribe( 'workshops' );
});

Template.profile.helpers({
	workshops: function(){
	    return Workshops.find({}, {sort: {submitted: 1}});
	  },
	user: function(){
		return Meteor.user();
	}
});
