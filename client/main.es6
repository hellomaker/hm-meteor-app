// It's important that this file is named 'main.js' so that it is loaded last.
// http://docs.meteor.com/#/full/structuringyourapp

Router = new MeteorRouter();
Router.did404.addListener( () => {
  Router.go( '/' );
});

// Define routes for the app.
Router.add( '/test' );

// Kick off the router.
Router.go( Router.url );
