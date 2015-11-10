//Check if web workers are supported
var WORKER_SUPPORT = false;
if(window.Worker){
	WORKER_SUPPORT = true;
}
//WORKER_SUPPORT = false;//Uncomment this line to simulate no worker support

//Init the ACE code editor
var editor = ace.edit("editor");
editor.setTheme("ace/theme/twilight");
editor.getSession().setMode("ace/mode/javascript");


///Create some tests!
var varTest = {}
varTest['structure'] = {'var_foo':'bar'}
varTest['description'] = "Create a variable called 'foo' and initialize it with 'bar'"

var var2Test = {}
var2Test['structure'] = {'vari_x':0}//The vari means it doesn't have to be initialized
var2Test['description'] = "Create a variable called 'x'"

var whileTest = {}
whileTest['structure'] = {'while':1}
whileTest['description'] = "Do NOT use a while loop"
whileTest['exclude'] = true;

var forTest = {}
forTest['structure'] = {'for':{'if':2}}//We can nest things too!
forTest['description'] = "Use a for loop with two if statements inside of it"


Judge.addTest(varTest)
Judge.addTest(var2Test)
Judge.addTest(whileTest)
Judge.addTest(forTest)

var codeString = ''

var worker;
var workerFeedback;
if(WORKER_SUPPORT){
	//Set up worker thread
	worker = new Worker('judge_thread.js');
	worker.addEventListener('message', function(e) {
		//We recieved the results!
		workerFeedback = JSON.parse(e.data);
		DisplayResults(workerFeedback)
	}, false);

	worker.postMessage(JSON.stringify(Judge.activeTests)); // Initialize the worker judge with our tests
}


var typing = 0;
var checked = false;

setInterval(DelayCheck,100)

function DelayCheck(){
	typing --;
	if(!checked && typing <0){
		checked = true;
		//If web workers are supported, send the work over
		if(WORKER_SUPPORT){
			worker.postMessage(codeString)
		} else {
			//Otherwise just run it here (Alternatively, we could hand it off to a server)
			////Run our code through the Judge API
			var feedback = Judge.examine(codeString);
			DisplayResults(feedback)
		}
		
	}
}



//This function runs on every keystroke
editor.on("change",function(e){
	codeString = editor.getValue();
	typing = 5;
	checked = false;
});

function DisplayResults(feedback){
	if(feedback['error']){
		//Syntax error!
		$('#results').html(feedback['error'])
	} else {
		//Write output to the page
		var allTests = Judge.activeTests;
		var numFailed = 0;

		var messages = [];

		for(var i=0;i<feedback.length;i++){
			var sign = "&#10004;"//Checkmark
			if(!feedback[i][1]){
				numFailed ++;
				sign = "&#10006;"//Cross
			}
			messages.push(sign + " " + feedback[i][0]['description'])
		}

		var finalResultString = "<h4>"+String(allTests.length - numFailed) + " /" + String(allTests.length) + " tests passed!</h4>"
		
		for(var i=0;i<messages.length;i++){
			finalResultString += "<p>" + messages[i] + "</p>"
		}
		$('#results').html(finalResultString)
	}
}