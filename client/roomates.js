//////Roomates////////////
Roomates = new Meteor.Collection("roomates");
Meteor.subscribe('roomates');
Template.apartment.roomates = function () {
  return Roomates.find({}, {sort: {name: 1}});
};

////////Payments//////////
Payments = new Meteor.Collection("payments");

Template.payments.payments = function(){
  return Payments.find({roomate_id : this._id});
};





if (Meteor.is_client) {


  Template.newRoomate.events = {

    'click #createRoomateBtn' : function(event){
      var roomateName = document.getElementById('newRoomateName').value;
      var id=Roomates.insert({name: roomateName});
    }
  };

  Template.newPayment.events = {

    'click button' : function(e){
      console.log(e);
      var payment =  {
        text: "food",
        money: 10,
        roomate_id: this._id,
        timestamp: (new Date()).getTime()
      }
      var id = Payments.insert(payment);
      

    }

  };

}


if (Meteor.is_server) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
