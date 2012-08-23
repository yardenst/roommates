// Roomates -- {name: String}
Roomates = new Meteor.Collection("roomates");

// Publish complete set of roomates to all clients.
Meteor.publish('roomates', function () {
	return Roomates.find();
});

// Payments -- {text: String,
//           	money: Number,
//           	roomate_id: String,
//           	timestamp: Number}

Payments = new Meteor.Collection("payments");

// Publish complete set of roomates to all clients.
Meteor.publish('payments', function () {
	return Payments.find();
});

// Returnings -- { payer_id: String, 
//				   getter: String,
//				   payment: Number}
//				

Returnings = new Meteor.Collection("returnings");

Meteor.publish('returnings', function(){return Returnings.find();});
