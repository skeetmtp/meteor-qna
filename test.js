// Lists -- {name: String}
Lists = new Meteor.Collection("lists");
var listsHandle = null;

var now = function()
{
  return (new Date()).getTime();
}

var clearDb = function() {
    Lists.remove({});
}

var fillDb = function() {
  var hoursCount = 365 * 24;
  var metricsCount = 100;

  var oldTime = now();

  var vals = [];
  for (var j = 0; j<60; j++) {
    vals[j] = j;
  }


  for (var i = 0; i<hoursCount; i++) {
    var query = []
    for (var k = 0; k<metricsCount; k++) {
      var id = "" + (i*1000 + k);
      //console.log(id);
      var val = Lists.findOne({ _id:id });
      if( val === undefined)
        Lists.insert( { _id:id, ticks:i, metric:k, samples:[] } );

      query.push(id);

      //Lists.update( { _id:id} , {$push : {samples: {$each : vals} } } );
      for (var j = 0; j<60; j++) {
        Lists.update( { _id:id} , {$push : {samples:j} } );
      }

      /*
      val = Lists.findOne({ _id:id });
      for (var j = 0; j<60; j++) {
        val.samples[j] = j;
        var samples = val.samples;
        Lists.update( { _id:id} , {$set : {samples:samples} } );
      }
      */
    }

    //Lists.update( { _id:{$in:query} } , {$push : {samples: {$each : vals} } } );

    if((i%24) == 0)
    {
      var deltaTime = now() - oldTime;
      console.log("d = ", i / 24, " / ", hoursCount / 24, " in ", deltaTime, " ms");
      var val = Lists.findOne();
      //console.log(val);
      oldTime = now();
    }
  }

  var deltaTime = now() - oldTime;
  console.log(">> deltaTime = ", deltaTime);

}

if (Meteor.isClient) {

  var listsHandle = Meteor.subscribe('lists', function () {});



  Template.hello.greeting = function () {
    return "Welcome to test.";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    clearDb();
    fillDb();
    // code to run on server at startup
  });
/*
  // Publish complete set of lists to all clients.
  Meteor.publish('lists', function () {
    return Lists.find();
  });
*/
}
