Template.register.events({
	'submit #register-form': function(event,template){
		event.preventDefault();
		var nameVar = template.find('#register-name').value;
		var emailVar = template.find('#register-email').value;
		var passwordVar = template.find('#register-password').value;
		Accounts.createUser({
			email: emailVar,
			password: passwordVar,
			name: nameVar
		}, function(err){
			if (err) {
				alert("Error");
			} else {
				alert("Success!" + this.name);
			}
		});
		$('body').removeClass('modal-open');
		return false;
	}
});

Template.login.events({
	'submit #login-form': function(event, template){
		event.preventDefault();
		var emailVar = template.find('#login-email').value;
		var passwordVar = template.find('#login-password').value;
		Meteor.loginWithPassword(emailVar, passwordVar, function(err){
			if (err) {
				alert("Error");
			} else {
				Router.go('/');
			}
		});
		$('body').removeClass('modal-open');

	}
});

Template.logout.events({
	'click #logout': function(){
		Meteor.logout();
	}
});