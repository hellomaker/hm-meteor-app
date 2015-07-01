function getUrl() {
  return ( window.location.hash || '#/' ).substr( 1 )
}

var initial = getUrl();
var bind = BindDecorator;
var event = EventDecorator;

/**
 * @typedef {Object} RouteConfig
 * @property {String} path
 * @property {Object} [meta]
 * @property {Function} [handler]
 */

Router = class {
  constructor() {
    this._route = null;
    this._previousUrl = null;
    this._urlInProgress = null;
    // $rootScope.$on( '$locationChangeSuccess', this._location_didChange );
    this.routes = [];
    this.add( '/' );
  }

  @event did404
  @event didNavigate

  get url() {
    return getUrl();
  }

  get path() {
    var path = this.url;
    var hash = path.indexOf( '#' );
    if ( hash > -1 ) {
      path = path.substr( 0, hash );
    }
    return path;
  }

  get route() {
    return this._route;
  }

  /**
   * @param {String|RouteConfig} config
   */
  add( config ) {
    if ( typeof config === 'string' ) {
      config = {
        path: config
      };
    }
    this.routes.push({
      path: config.path,
      parser: new RouteParser( config.path ),
      handler: config.handler || angular.noop,
      meta: config.meta || {}
    });
  }

  /**
   * @param {String} fromPath
   * @param {String} toPath
   */
  redirect( fromPath, toPath ) {
    this.add({
      path: fromPath,
      handler: ( context, next ) => {
        return this.go( toPath );
      }
    });
  }

  clear() {
    this.routes = [];
  }

  go( url ) {
    // Add support for relative urls.
    if ( !/^\//.test( url ) ) {
      var base = this.path;
      if ( !/\/$/.test( base ) ) {
        base += '/';
      }
      url = base + url;
    }

    if ( url === this._urlInProgress ) {
      throw new Error( 'Redirect loop detected!' );
    }

    this._previousUrl = url;
    this._urlInProgress = url;

    return this._next( url )
      .then( context => {
        this._urlInProgress = null;
        this._route = context.route;

        $rootScope.$apply( () => $location.url( context.url ) );
        this._didNavigate.raise( context );

        // Don't send a page view on initial page load.
        if ( context.url === initial ) {
          initial = null;
        } else {
          if ( typeof ga !== 'undefined' ) {
            ga( 'send', 'pageview', { page: context.url } );
          }
        }

        // Navigation handlers can return false to cancel the current
        // navigation. Returning false here allows us to return another
        // $router.go() inside a navigation handler to perform a redirect.
        return false;
      })
      .catch( err => {
        switch ( err.message ) {
          case '404':
            this._did404.raise();
            throw err;
            break;

          case 'cancelled':
            break;

          default:
            throw err;
        }
      });
  }

  normalizeUrl( url ) {
    if ( !/^\//.test( url ) ) {
      url = '/' + url;
    }
    return '#' + url;
  }

  /**
   * @param {String} url
   * @param {Number} [index=0]
   */
  _next( url, index = 0 ) {
    var context = {};
    context.url = url;
    context.params = {};
    context.hash = context.url.indexOf( '#' );
    context.path = context.url;
    if ( context.hash > -1 ) {
      context.path = context.url.substr( 0, context.hash );
    }

    var len = this.routes.length;
    for ( ; index < len; index++ ) {
      let route = this.routes[ index ];

      if ( route.parser.match( context.path, context.params ) ) {
        context.route = route;
        context = Object.freeze( context );
        return Promise.resolve().then( () => {
          // Make the `next` function idempotent.
          var going;
          return route.handler.call( undefined, context, () => {
            if ( !going ) {
              going = this._next( url, index + 1 );
            }
            return going;
          });
        }).then( result => {
          if ( result === undefined ) {
            return context;
          } else if ( result === false ) {
            throw new Error( 'cancelled' );
          } else {
            return result;
          }
        });
      }
    }

    return Promise.reject( new Error( '404' ) );
  }

  @bind _location_didChange() {
    if ( this._previousUrl !== this.url ) {
      let url = this.url;
      this.go( this.url ).catch( err => {
        console.log( `Navigation to ${ url } returned "${ err.message }".` );
      });
    }
  }
};
