var request = Meteor.npmRequire( 'request-promise' );
var moment = Meteor.npmRequire( 'moment' );
var cheerio = Meteor.npmRequire( 'cheerio' );

Meteor.methods({
  [ 'GET /workshops' ]() {
    var response = Async.wait(
      request( 'https://api.meetup.com/2/events', {
        qs: {
          key: '7760747c7566275c23662628177933',
          group_id: '18613426',
          status: 'upcoming,past'
        }
      })
    );
    var workshops = JSON.parse( response ).results;
    return workshops.map( workshop => {
      var meta = metaFromHtml( workshop.description );
      return {
        id: workshop.id,
        title: workshop.name,
        description: meta.description,
        yes_rsvp_count: workshop.yes_rsvp_count,
        fee: workshop.fee && workshop.fee.amount,
        time: moment.unix( workshop.time / 1000 ).toISOString(),
        event_url: workshop.event_url,
        tags: meta.tags,
        level: meta.level
      };
    });
    return response.results;
  }
});

/**
 * @param {String} html
 */
function metaFromHtml( html ) {
  var meta = {};
  var $ = cheerio.load( html );
  meta.description = $( 'p' )
    .filter( ( i, el ) => !!$( el ).text().trim() )
    .slice( 0, 2 )
    .map( ( i, el ) => $( el ).text() )
    .toArray()
    .join( '\n' );
  return meta;
}
