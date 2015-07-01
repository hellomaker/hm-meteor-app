var cacheKey = Symbol();

BindDecorator = function( prototype, name, descriptor ) {
  var func = descriptor.value;
  return {
    configurable: true,
    enumerable: false,
    get: function() {
      if ( !this[ cacheKey ] ) {
        this[ cacheKey ] = {};
      }
      var cache = this[ cacheKey ];
      if ( !cache[ name ] ) {
        cache[ name ] = func.bind( this );
      }
      return cache[ name ];
    }
  };
};
