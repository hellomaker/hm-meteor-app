Router.route( '/', function() {
  if ( Meteor.user() ) {
    this.render( 'profile' );
  } else {
    this.render( 'home' );
  }
});
