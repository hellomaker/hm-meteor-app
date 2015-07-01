RouteParser = class {
  constructor( path ) {
    if ( !/^\//.test( path || '' ) ) {
      throw new Error( 'Path must begin with forward slash (/).' );
    }
    this.path = path;
    this._keys = [];
    this._pattern = pathToRegexp( this.path, this._keys );
  }

  match( path, params ) {
    var uri = URI.parse( path );
    var match = this._pattern.exec( uri.path );
    if ( match !== null ) {
      if ( params ) {
        var i = 0, len = this._keys.length;
        for ( ; i < len; i++ ) {
          params[ this._keys[ i ].name ] = match[ i + 1 ];
        }
        params.query = URI.parseQuery( uri.query );
      }
      return true;
    }
    return false;
  }
};
