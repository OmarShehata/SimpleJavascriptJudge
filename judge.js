var Judge = {};

Judge.activeTests = [];//Our test array


Judge.examine = function(codeString){
	//Our main test function. Takes in a string of Javascript,
	//parses it with acorn
	//checks our internal tests
	//and returns an array of which tests have succeeded and which failed
	var feedback = []
	
	try {
		var syntaxTree = acorn.parse(codeString);
	} catch(err){
		feedback['error'] = err;
		return feedback;
	}

	//The CheckStruct function takes in all the nodes and a test, and checks if the test is satisfied
	function CheckStruct(nodeArray,testName,testValue){

		var occuranceCount = {};
		console.log(nodeArray,nodeArray.length)
		for(var k=0;k<nodeArray.length;k++){
			var node = nodeArray[k]

			if(testName.indexOf("var_") >= 0 || testName.indexOf("vari_") >= 0 ){//vari is a variable that only needs to be initialized, can be any value
				//Check if this variable declaration exists		
				var variableName = testName.substring(4)
				var checkForValue = true;
				if(testName.indexOf("vari_") >= 0){
					variableName = testName.substring(5)
					checkForValue = false;
				}

				if(node.type == "VariableDeclaration"){
					//Check if it matches the name (and value if exists)
					var decArray = node.declarations;
					for(var i=0;i<decArray.length;i++){
						if(decArray[i].id.name == variableName){
							if(!checkForValue || (decArray[i].init && decArray[i].init.value == testValue)){
								//Found the correct variable
								return true;
							}
						}
					}
				}
				
			}

			var structureMaps = {}//Maps the names we give them to the names acorn gives them
			structureMaps['while'] = 'WhileStatement'
			structureMaps['if'] = 'IfStatement'
			structureMaps['for'] = 'ForStatement'

			function HandleNested(node,name,value){
				//Do we have any further nested structure to check?
				if(typeof(value) == "object"){
					//Recursively check that structure
					for(var innerTestName in value){
						var innerTestValue = value[innerTestName]

						if(!CheckStruct(node.body.body,innerTestName,innerTestValue)) return false;
					}
					return true;
				} else {
					//Otherwise, check that we have the correct number of occurances
					if(occuranceCount[name] == undefined) occuranceCount[name] = 0;
					occuranceCount[name] ++;
					if(occuranceCount[name] >= value){
						//We only need to find at least this many statements
						return true;
					}
				}
			}


			if(testName == "while" || testName == "if" || testName == "for"){
				//Check that this is a while/for/if 
				if(node.type == structureMaps[testName]){
					if(HandleNested(node,testName,testValue)) return true
				}
			}
	

			if(testName.indexOf("function_") >= 0){
				//Check if this function exists and recursively check if the structure is correct
				var functionName = testName.substring(9)
				if(node.type == "FunctionDeclaration"){
					//Check if it has the right name
					if(node.id.name == functionName){
						//Do we have further nested structure to check?
						if(HandleNested(node,testName,testValue)) return true
					}
				}
			}
		}

		return false;
	}
	console.log("------------")

	//Go through each of our tests and check if they are fulfilled
	for(var i=0;i<Judge.activeTests.length;i++){
		var testObj = Judge.activeTests[i];
		var nodeArray = syntaxTree.body;

		for(var testName in testObj.structure){
			//Loop over all the tests
			var testValue = testObj.structure[testName];
			//CheckStruct loops over all the nodes to check if the test is satisfied
			var check = CheckStruct(nodeArray,testName,testValue)
			if(testObj.exclude) check = !check;
			feedback.push([testObj,check]) ;
		}	

	}

	return feedback;
}


Judge.addTest = function(testObj){
	//Takes in an object defining the tests to check for
	Judge.activeTests.push(testObj)
}

Judge.clearTests = function(){
	//Clears all active tests
	Judge.activeTests = []
}