let numCounter = 2;
	let subCounter = [];
	let parentArra = [];
	
	class Node {
  constructor(name, parent, id, type) {
    this.name = name;
    this.parent = parent;
	this.id = id;
  }
}


	function newSubCause(num){
		document.getElementById("cause").innerHTML += "<input id= 'subCause"+num+"' type='text' class='form-control' placeholder='Sub-Cause' required='required'><br>"
		//document.getElementById("cause").innerHTML += "<button onclick='newSubCause()' class='btn btn-block'>add new sub-cause</button><br>";
		subCounter.push(num);
		parentArra.push(num);
		
		const el = document.getElementById("newSub"+num);
		el.remove();
		
	}
	
	function newCause(){
		let id = 'causes' + numCounter.toString();
		document.getElementById("cause").innerHTML += "<input id= "+id+" type='text' class='form-control' placeholder='Cause' required='required'>"
	
		document.getElementById("cause").innerHTML += "<button id = 'newSub"+numCounter+"' onclick='newSubCause("+numCounter+")' class='btn btn-block'>add new sub-cause</button><br>";
		numCounter++;
	}
	
	function graph(){
	let causes = [];
	let subCauses = [];
	
	for(i=1; i<numCounter; i++){
		causes.push(document.getElementById('causes'+i).value.toString());
	}
	
	for(i=0; i<subCounter.length; i++){
		subCauses.push(document.getElementById('subCause'+subCounter[i]).value.toString());
	}
	
	let effect = document.getElementById('effects').value;
	var nodes = [];
	nodes.push(
		{id: 0, label: effect}
		);
	var edges = [];
	
		for(let i =3; i<causes.length + 1; i+=2){
	
		edges.push(
			{from: causes.length + i,
			to: causes.length + i -2,
			label: ""}
		);
	}
	
	edges.push(
			{from: causes.length + 1,
			to: 0,
			label: ""}
		);
		
		
		for(let i =1; i<causes.length + 1; i++){
		let nodesId = i;
		let nodesLabel = causes[i-1];
		if(i%2==1){
		console.log("odd: " + nodesLabel);
			nodes.push(
			{id: causes.length + nodesId, 
			label: ""},
			{id: nodesId, 
			label: nodesLabel}
			);
			edges.push(
			{from: causes.length + nodesId,
			to: nodesId,
			label: ""}
		);
		console.log(causes.length + nodesId);
		console.log(nodesId);
		}
		else{
			console.log("Even: " + nodesLabel);
		nodes.push(
			{id: nodesId, 
			label: nodesLabel}
			);
			edges.push(
			{from: causes.length + nodesId -1,
			to: nodesId,
			label: ""},
			);
		
		}
		}
		
		
		for(let i =0; i<subCauses.length; i++){
			console.log("Subcauses: " +subCauses);
		let nodesId = "sub" +i;
		let nodesLabel = subCauses[i];
		console.log(subCounter[i]);
		let parentId = parentArra[i]; 
		console.log("Parent: " +parentId);
		nodes.push(
			{id: nodesId, 
			label: nodesLabel}
			);
			edges.push(
			{from: parentId,
			to: nodesId,
			label: "sub"}
		);
		
		}
		

	var nodes1 = new vis.DataSet(nodes);
	var edges1 = new vis.DataSet(edges);
	
	let data = {
		nodes: nodes1,
		edges: edges1
		};
		
	//let options = {};
	let options = {
		height: '600px',
		width: '1000px',
  layout: {
    randomSeed: undefined,
    improvedLayout:true,
    clusterThreshold: 150,
    hierarchical: {
      enabled:true,
      levelSeparation: 150,
      nodeSpacing: 100,
      treeSpacing: 200,
      blockShifting: true,
      edgeMinimization: true,
      parentCentralization: true,
      direction: 'RL',        // UD, DU, LR, RL
      sortMethod: 'hubsize',  // hubsize, directed
      shakeTowards: 'roots'  // roots, leaves
    }
  }
}

	var rootNode = nodes1.get(0);
	    rootNode.color = {
      border: '#000000',
      background: '#0018A8',
      highlight: {
        border: '#2B7CE9',
        background: '#D2E5FF'
      }
    }
    nodes1.update(rootNode);
	
	let container = document.getElementById("mynetwork");
	
	let network = new vis.Network(container, data, options);
	
	
	}
	
	
	
function saveGraph(){
	let parentArray = [];
	let causes = [];
	let subCauses = [];
	
	for(i=1; i<numCounter; i++){
		causes.push(document.getElementById('causes'+i).value.toString());
	}
	
	for(i=0; i<subCounter.length; i++){
		subCauses.push(document.getElementById('subCause'+subCounter[i]).value.toString());
		parentArray.push(subCounter[i]);
	}
	
	let xhr = new XMLHttpRequest();
	//saveGraphPrivate();
	
    xhr.open('POST', 'https://us-central1-fyp-8639e.cloudfunctions.net/saveVisGraph', true);

    xhr.setRequestHeader("Content-type", "application/json");
    //Track the state changes of the request
    xhr.onreadystatechange = function()
    {
        let DONE = 4; //readyState 4 means the request is done
        let OK = 200; // status 200 is a successful return
        if (xhr.readyState === DONE) {
            if (xhr.status === OK) {
                let docId = JSON.parse(xhr.responseText);
                document.cookie = "docid =" + docId;
            } else {
                console.log('Error: ' + xhr.status);
            }
        }
    };
    // alert("details:  email: "+ email + "password: "+ password+ "uid: "+  uid);
    xhr.send(JSON.stringify({"causes":causes, "subcauses": subCauses, "parents": parentArray, "effect":document.getElementById("effects").value, "uid" : getCookie('uid')}));
	//"uid" : getCookie('uid')
}

function saveGraph(){
	let parentArray = [];
	let causes = [];
	let subCauses = [];
	
	for(i=1; i<numCounter; i++){
		causes.push(document.getElementById('causes'+i).value.toString());
	}
	
	for(i=0; i<subCounter.length; i++){
		subCauses.push(document.getElementById('subCause'+subCounter[i]).value.toString());
		parentArray.push(subCounter[i]);
	}
	
	let xhr = new XMLHttpRequest();
	
    xhr.open('POST', 'https://us-central1-fyp-8639e.cloudfunctions.net/saveVisGraphPrivate', true);

    xhr.setRequestHeader("Content-type", "application/json");
    //Track the state changes of the request
    xhr.onreadystatechange = function()
    {
        let DONE = 4; //readyState 4 means the request is done
        let OK = 200; // status 200 is a successful return
        if (xhr.readyState === DONE) {
            if (xhr.status === OK) {
                let docId = JSON.parse(xhr.responseText);
                document.cookie = "docid =" + docId;
            } else {
                console.log('Error: ' + xhr.status);
            }
        }
    };
    // alert("details:  email: "+ email + "password: "+ password+ "uid: "+  uid);
    xhr.send(JSON.stringify({"causes":causes, "subcauses": subCauses, "parents": parentArray, "effect":document.getElementById("effects").value, "uid" : getCookie('uid')}));
	//"uid" : getCookie('uid')
}