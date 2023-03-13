function fishbone1(...params)
{
	console.log(params);
	document.getElementById("graph"+params[params.length - 1]).innerHTML += "<div id='graph-react'> <canvas id='myCanvas" +params[params.length - 1]+"'></canvas> </div> <br>";
	var canv = "myCanvas"+params[params.length-1];
	var c = document.getElementById(canv);
	var ctx = c.getContext("2d");
	console.log(ctx);
	c.width = 300;
	ctx.font = "bold 10px Arial";
		
	if (params.length <= 2){
		alert("No causes");
		console.log("no causes");
		return(1);
	}	
	let causes = params[0].split(",");
	console.log("CAUSES");
	console.log(causes);
	ctx.moveTo(10, 75);
	ctx.lineTo(270, 75);
	let effect = params[params.length-2];
	ctx.fillText(effect, (273), (80));
	let lines = causes.length;
	console.log(lines);
	let space = 250/(Math.round(lines/2));
	console.log("Space: " +space);
	let length_line = 250;

	ctx.moveTo(250, 75);
	ctx.lineTo(250-50, 120);
	ctx.fillText(causes[0], (190), (130));
	
	for(let i=1; i<lines; i++){
		console.log("for loop");
		let result = (i % 2  == 0) ? 1 : 0;
		//check if odd or even (even is 1, odd is 0)
		length_line = length_line - space*result;
		ctx.moveTo(length_line, 75);
		ctx.lineTo(length_line-50, 90*(result) + 30);
		
		ctx.fillText(causes[i], (length_line -60), 105*(result) + 25);
	}
	ctx.stroke();
	console.log("Should have filled canvas");
	i=1;
	document.getElementById("buttonyo"+params[params.length - 1]).innerHTML += "<br><center><button id='remove' onclick=\"removeGraph("+params[params.length - 1]+")\" class='btn btn-warning btn-lg' >Close Graph</button></center><br>";
	//+params[params.length - 1]+
	//onclick=\"removeGraph("+params[params.length - 1]+")
}



function showGraphs()
{
    sayHello();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://us-central1-fyp-8639e.cloudfunctions.net/returnUserGraphs', true);
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
					console.log(j);
                    console.log(data[j]);
					if(data[j].uid === getCookie('uid')){
						console.log(data[j].causes);
						console.log(data[j].causes.type);
						let causes = data[j].causes.split(",");
						let effect = data[j].effect;
						causes = causes.toString();
						//arrA.push(effect);
						//arrA.push(j);
						let btn = "button"+j;
						//let arrA2 = JSON.stringify(arrA);
						//console.log(arrA2);
						document.getElementById("graphs").innerHTML += "<p><center><h3><button id='"+btn+"' onclick=\"fishbone1('"+causes+"', '" +effect+"', "+j+");\" class='btn btn-warning btn-lg'>Graph " +data[j].effect+" </button>";
						console.log("MyCanvas"+j);
						document.getElementById("graphs").innerHTML += "</h3><h4><center>Causes: " +data[j].causes+"<br>Effect: " +effect+"<br></center></h4></center></p><div id=graph"+j+"></div> <div id=buttonyo"+j+"></div>";
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


function removeGraph(j){
	document.getElementById("graph"+j).innerHTML =" ";
	document.getElementById("buttonyo"+j).innerHTML = "";
	
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


function checkAuth(){
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