Template.workshop_item.helpers({
  formatDate( date ){
		return moment( date ).calendar();
	},

  summary( description ) {
    if ( description.length > 90 ) {
      return description.substr( 0, 90 - 3 ) + '...';
    } else {
      return description;
    }
  }
});
