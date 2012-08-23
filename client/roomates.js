//////Roomates////////////
Roomates = new Meteor.Collection("roomates");
Meteor.subscribe('roomates');
Template.apartment.roomates = function () {
  return Roomates.find({}, {sort: {name: 1}});
};

////////Payments//////////
Payments = new Meteor.Collection("payments");

Template.payments.payments = function(){
  var filter = {roomate_id : this._id};
  var sort = {sort : {timestamp: -1}};
  var itemsCount = 50;
  return Payments.find(filter,sort).fetch().slice(0,50);
};

Template.payments.total = function(){
  var paymentsSum=0;
  roomatePayments=Payments.find({roomate_id : this._id});
  roomatePayments.forEach(function (payment){
    paymentsSum+=payment['money']*1;
  });


  return paymentsSum;
};


///////Returnings///////////
Returnings = new Meteor.Collection("returnings");

Template.returnings.returnings = function(){
  var payload =  Returnings.find({payer_id : this._id});
  if(payload.count()==0)
  {
    return null;
  }
  return payload;

};


if (Meteor.is_client) {


  Template.returningsAction.events = {

    'click button' : function(event){

     calculateReturnings();

   }
 };


 Template.newRoomate.events = {

  'click #createRoomateBtn' : function(event){
    var roomateName = document.getElementById('newRoomateName').value;
    var id=Roomates.insert({name: roomateName});

  }
};

Template.payments.events = {

  'click .removePayment' : function(event){
    Payments.remove ({_id : this._id })
    calculateReturnings();
  }
};

Template.newPayment.events = {

  'click button' : function(e){


    var payment =  {
      text: $('#what','#roomate_' + this._id).val(),
      money: $('#money','#roomate_' + this._id).val(),
      roomate_id: this._id,
      timestamp: (new Date()).getTime()
    }
    var id = Payments.insert(payment);
    calculateReturnings();

  }

};



function calculateReturnings(){
 Returnings.remove({});
 var all_roomates = Roomates.find({});
 var roomate_to_total=[];
 totalAll=0;
 all_roomates.forEach(function (roomate){

   var paymentsSum=0;

   roomatePayments=Payments.find({roomate_id : roomate["_id"]});

   roomatePayments.forEach(function (payment){
    paymentsSum+=payment['money']*1;
  });

   totalAll+=paymentsSum;
   roomate_to_total.push({r : roomate , t : paymentsSum});


 });

 var avg =  totalAll/roomate_to_total.length;

 var happened;
 do{  
  happened = makeTransfer();
}
while(happened);




function makeTransfer(){
  var flag=false;
  for(var i in roomate_to_total)
  {
    var item = roomate_to_total[i];
    if (item["t"]*1 > avg)
    {


      for(var j in roomate_to_total)
      {
        var item2 = roomate_to_total[j];


        if(item2["t"]*1<avg)
        {

          var wishToTransfer = (avg-  item2["t"]*1 );

          
          Returnings.insert({payer_id:item2['r']['_id'], payment:Math.round(wishToTransfer) ,getter: item['r']['name']});

          item2["t"] = item2["t"]*1 + wishToTransfer;

          item["t"] = item["t"]*1 - wishToTransfer;


          return true;


        }

      }

    }
  }
  return flag;
}
}



}


if (Meteor.is_server) {
  Meteor.startup(function () {


  });

}
