Template.workshop_item.helpers({
  formatDate: function(date){
		return moment(date).calendar();
	}
});
