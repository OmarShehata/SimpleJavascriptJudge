//import acorn and our judge api
importScripts('judge.js','lib/acorn.js')

var initialized = false;

self.addEventListener('message', function(e) {
  //The first message sent will be the tests to give our judge
  if(!initialized){
  	var tests = JSON.parse(e.data);
  	for(var i=0;i<tests.length;i++){
  		Judge.addTest(tests[i])
  	}
  	initialized = true;
  } else {
  	//Otherwise, assume what we get is a chunk of javascript to examine
  	var feedback = Judge.examine(e.data);
  	if(feedback['error']){
  		var err = feedback['error']
  		feedback = {}
  		feedback['error'] = String(err)
 	}
 	self.postMessage(JSON.stringify(feedback))
  }

}, false);