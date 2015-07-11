var cache = {};

Template.route.helpers({
  matches: function( path ) {
    var url = Router.url;
    if ( !cache[ path ] ) {
      cache[ path ] = new RouteParser( path );
    }
    return cache[ path ].match( url );
  }
});
