var cache = {};

Template.route.helpers({
  matches: function( path ) {
    var url = ( window.location.hash || '#/' ).substr( 1 );
    if ( !cache[ path ] ) {
      cache[ path ] = new RouteParser( path );
    }
    return cache[ path ].match( url );
  }
});
