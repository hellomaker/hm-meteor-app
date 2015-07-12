var Future = Npm.require( 'fibers/future' );

Async = {
  wait( promise ) {
    var future = new Future();
    var result;
    promise.then( _result => {
      result = _result;
      future.return();
    });
    future.wait();
    return result;
  },

  runSync( asyncFunc ) {
    return Async.wait( asyncFunc() );
  }
};
