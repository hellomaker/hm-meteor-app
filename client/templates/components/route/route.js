var cache = {};

Template.route.helpers({
  matches: function( path, user ) {
    var loggedIn = !!Meteor.user();
    if ( user === 'logged-in' && !loggedIn ) {
      return false;
    }
    if ( user === 'logged-out' && loggedIn ) {
      return false;
    }
    var url = Router.url;
    if ( !cache[ path ] ) {
      cache[ path ] = new RouteParser( path );
    }
    return cache[ path ].match( url );
  }
});
