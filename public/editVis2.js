function vis_fishbone(...params)
{
	let causes = params[0].split(',');
	console.log(causes);
	let effect = params[1];
	let j = params[2];
	let subcauses = params[3].split(',');
	let parents = params[4].split(',');

	document.getElementById("graph"+j).innerHTML += "<center><div id='mynetwork"+j+"'> </div></center> <br>";

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
		console.log(nodesLabel);
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
		
		
		for(let i =0; i<subcauses.length; i++){
			console.log("Subcauses: " +subcauses);
		let nodesId = "sub" +i;
		let nodesLabel = subcauses[i];
		let parentId = parents[i]; 
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
		height: '300px',
		width: '500px',
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
	
	let container = document.getElementById("mynetwork"+j);
	
	let network = new vis.Network(container, data, options);
	
	document.getElementById("buttonyo"+j).innerHTML += "<br><center><button id='edit' onclick=\"editGraph('"+causes+"', '"+subcauses+"', '"+effect+"', "+j+", '"+parents+"')\" class='btn btn-warning btn-lg' >Edit Graph</button></center><br>";
	document.getElementById("buttonyo"+j).innerHTML += "<br><center><button id='remove' onclick=\"removeGraph("+j+")\" class='btn btn-warning btn-lg' >Close Graph</button></center><br>";
}

function removeGraph(j){
	document.getElementById("graph"+j).innerHTML =" ";
	document.getElementById("buttonyo"+j).innerHTML = "";
	
}

function editGraph(...params){
	let causes = params[0].split(',');
	let effect = params[2];
	let j = params[3];
	let subcauses = params[1].split(',');
	let parents = params[4].split(',');

	document.getElementById("graph"+j).innerHTML =" ";
	//document.getElementById("graphDetail"+j).innerHTML =" ";
	const edit = document.getElementById("edit");
	edit.remove();
	const sendTo = [String(params[0]), params[2], params[3], params[1], params[4]];
	document.getElementById("graph"+j).innerHTML += "<div class='container' id = 'edit"+j+"'><h1>Edit Your Graph Here</h1><div class='row'><div id= 'causesList"+j+"' class='col-sm-6'><center></div><div class='col-sm-6' ><div id='edit_graph_visual"+j+"'>";
	
	for(let i=0; i<causes.length; i++){
		document.getElementById("causesList"+j).innerHTML += "<br><h4>Cause "+(i+1)+": <a onclick = question("+causes[i]+")>"+causes[i]+"</a></h4><button onclick=document.getElementById('id01').style.display='block'>Open Modal</button>";
		for(let k=0; k<parents.length; k++){
			if (parents[k] == (i+1)){
				document.getElementById("causesList"+j).innerHTML += "<h4>	SubCause: <a onclick = question("+subcauses[k]+")>"+subcauses[k]+"</a></h4>";
			}
		}
	}
	document.getElementById("causesList"+j).innerHTML += "<br><h4><a onclick = addCause()>Add a new Cause</a></h4>";
	document.getElementById("causesList"+j).innerHTML += "<h4>Effect: <a onclick = question("+effect+")>"+effect+"</a></h4>";
	vis_fishbone_edit(sendTo);
	
}

function showGraphs()
{
    sayHello();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://us-central1-fyp-8639e.cloudfunctions.net/returnUserGraphsVis', true);
	//+ "?uid=" + getCookie('uid')
	console.log("get worked");
	console.log(xhr);
    //Track the state changes of the request
    xhr.onreadystatechange = function()
    {
        console.log("started");
        var DONE = 4; //readyState 4 means the request is done
        var OK = 200; // status 200 is a successful return
        if (xhr.readyState === DONE) {
            if (xhr.status === OK) {
				
				
				let graphlist = [];
				var sHTML = "<p>";
                let data = JSON.parse(xhr.responseText);
                for (let j = 0; j < data.length; j++) {
					if(data[j].uid === getCookie('uid')){
						let causes = data[j].causes;
						console.log(causes);
						let effect = data[j].effect;
						let subcauses = data[j].subcauses;
						console.log(subcauses);
						let parents = data[j].parents
						let btn = "button"+j;
						
						document.getElementById("graphs").innerHTML += "<p><center><h3><button id='"+btn+"' onclick=\"vis_fishbone('"+data[j].causes+"', '" +data[j].effect+"', "+j+", '"+data[j].subcauses+"', '"+data[j].parents+"');\" class='btn btn-warning btn-lg'>Graph " +data[j].effect+" </button>";
						console.log("MyCanvas"+j);
						document.getElementById("graphs").innerHTML += "<div id='graphDetail"+j+"'></h3><h4><center>Causes: " +data[j].causes+"<br>Effect: " +effect+"<br>SubCauses: " +subcauses+"<br></center></h4></center></p></div><div id=graph"+j+"></div> <div id=buttonyo"+j+"></div>";
					}
                    graphlist.push(data[j].code);
                }
                console.log("graphlist:" + graphlist[0]);
				sHTML += "</p>";
				console.log(sHTML);
                document.getElementById("graphs").innerHTML += sHTML;
				
			
            } else {
                console.log('Error: ' + xhr.status);
            }
        }
    }
    xhr.send(null);
}


function sayHello(){
	var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://us-central1-fyp-8639e.cloudfunctions.net/returnUserEmail', true);
	//+ "?uid=" + getCookie('uid')
	console.log("get worked");
	console.log(xhr);
    //Track the state changes of the request
    xhr.onreadystatechange = function()
    {
        console.log("started");
        var DONE = 4; //readyState 4 means the request is done
        var OK = 200; // status 200 is a successful return
        if (xhr.readyState === DONE) {
            if (xhr.status === OK) {
				
				let email = "";
                let data = JSON.parse(xhr.responseText);
                for (let j = 0; j < data.length; j++) {
					if(data[j].uid === getCookie('uid')){
						email = data[j].email;
						}
                }

				document.getElementById("graphHome").innerHTML += "<h3>Hello " +email+ "<br><br>Create a graph <a href='./createGraphs.html'>here</a> </h3>";
			
            } else {
                console.log('Error: ' + xhr.status);
            }
        }
    }
    xhr.send(null);
}


function checkAuthEdit(){
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
	showGraphs();
    var uid = user.uid;
    // ...
  } else {
    // User is signed out
    // ...
	window.location.href ="./";
	
  }
});
}



function vis_fishbone_edit(...params)
{
	console.log(params);
	console.log(params[0]);
	let causes = params[0][0].split(',');
	let effect = params[0][1];
	let j = params[0][2];
	console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH");
	let subcauses = params[0][3].split(',');
	let parents = params[0][4].split(',');
	document.getElementById("edit_graph_visual"+j).innerHTML = "";
	document.getElementById("edit_graph_visual"+j).innerHTML += "<center><br><br><div id='mynetwork"+j+"'> </div></center> <br>";

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
		console.log(nodesLabel);
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
		
		
		for(let i =0; i<subcauses.length; i++){
			console.log("Subcauses: " +subcauses);
		let nodesId = "sub" +i;
		let nodesLabel = subcauses[i];
		let parentId = parents[i]; 
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
		height: '300px',
		width: '500px',
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
	
	let container = document.getElementById("mynetwork"+j);
	
	let network = new vis.Network(container, data, options);
	
	
}

function question(){
	

}
	
	
	
	