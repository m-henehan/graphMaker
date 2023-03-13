function getSecureAPI(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://us-central1-functions-83b7e.cloudfunctions.net/authorizedendpoint');

// Track the state changes of the request.
    xhr.onreadystatechange = function () {
        var DONE = 4; // readyState 4 means the request is done.
        var OK = 200; // status 200 is a successful return.
        if (xhr.readyState === DONE) {
            if (xhr.status === OK) {
                response.innerHTML = xhr.responseText;
            }
        } else {
            response.innerHTML = "Unauthorized to view this content";
            console.log('Error: ' + xhr.status); // An error occurred during the request.
        }
    };
    // Set the Authorization header
    xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie('accessToken'))
    xhr.send(null);
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
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
	window.href="https://functions-83b7e.web.app/"
	
  }
});
}
