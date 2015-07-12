var workshops = new ReactiveVar( [] );
var loading = false;

Workshops = {
  find() {
    if ( !loading ) {
      loading = true;
      Meteor.call( 'GET /workshops', function( err, result ) {
        console.log( result );
        workshops.set( result );
      });
    }
    return workshops.get();
  }
};
