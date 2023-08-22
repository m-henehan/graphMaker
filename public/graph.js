function fishbone()
{
	document.getElementById("graph-react").innerHTML += "<canvas id='myCanvas'></canvas><br>";
	let causes = document.getElementById('causes').value;
	let effect = document.getElementById('effects').value;
	const causes1 = causes.split(",");
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	c.width = 350;
	c.height = 190;
	ctx.font = "bold 10px Arial";
		
	if (causes === ""){
		alert("No causes");
		return(1);
	}	

	ctx.moveTo(10.5, 75.5);
	ctx.lineTo(270.5, 75.5);
	ctx.fillText(effect, (273.5), (80.5));
	let lines = causes1.length;
	let space = 250/(Math.round(lines/2)) + 0.5;
	let length_line = 250.5;

	ctx.moveTo(250.5, 75.5);
	ctx.lineTo(250-50, 120.5);
	ctx.fillText(causes1[0], (190.5), (130.5));
	
	for(let i=1; i<lines; i++){
		let result = (i % 2  == 0) ? 1 : 0;
		//check if odd or even (even is 1, odd is 0)
		length_line = length_line - space*result;
		ctx.moveTo(length_line + 0.5, 75.5);
		ctx.lineTo(length_line-50 + 0.5, 90*(result) + 30.5);
		ctx.fillText(causes1[i], (length_line -59.5), 105*(result) + 25.5);
	}
	ctx.stroke();

}

function saveGraph(){
    let xhr = new XMLHttpRequest();
	saveGraphPrivate();
    xhr.open('POST', 'https://us-central1-fyp-8639e.cloudfunctions.net/saveGraph', true);

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
    xhr.send(JSON.stringify({"causes":document.getElementById("causes").value, "effect":document.getElementById("effects").value, "uid" : getCookie('uid')}));
	//"uid" : getCookie('uid')
}


function checkAuth(){
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    var uid = user.uid;
    // ...
  } else {
    // User is signed out
    // ...
	window.location.href ="./";
	
  }
});
}


function saveGraphPrivate(){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://us-central1-fyp-8639e.cloudfunctions.net/saveGraphPrivate', true);

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
    xhr.send(JSON.stringify({"causes":document.getElementById("causes").value, "effect":document.getElementById("effects").value, "uid" : getCookie('uid')}));
	//"uid" : getCookie('uid')
}
