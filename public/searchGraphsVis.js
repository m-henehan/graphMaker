function searchGraphs() {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://us-central1-fyp-8639e.cloudfunctions.net/returnGraphsVis', true);
    document.getElementById("graphs").innerHTML = "";

    //Track the state changes of the request
    xhr.onreadystatechange = function () {
        console.log("searchGraphs started");
        let DONE = 4; //readyState 4 means the request is done
        let OK = 200; // status 200 is a successful return
        let search = document.getElementById("search").value.toLowerCase();
        if (xhr.readyState === DONE){
            if (xhr.status === OK) {
                let graphList = [];
                let data = JSON.parse(xhr.responseText);
                for (let i = 0; i < data.length; i++) {
                    console.log(data[i]);
                    graphList.push(data[i]);
                }
                console.log("graphList:" + graphList);
				
                var found = false;
                for (let m = 0; m < graphList.length; m++) {
					let causes = graphList[m].causes;
					const lowerCauses = causes.map(element => {
					return element.toLowerCase();
						});
					let subcauses = graphList[m].subcauses;
					const lowerSubCauses = subcauses.map(element => {
					return element.toLowerCase();
						});
					console.log(causes.toString());
					//.split(',').toString();
                    //alert("m: " + graphList[m].effect + " search: " + search);
                    if (graphList[m].effect.toLowerCase().includes(search) || lowerCauses.toString().includes(search) || lowerSubCauses.toString().includes(search)) {
						console.log(graphList[m]);
						document.getElementById("graphs").innerHTML += "<h3>Graph found: <br>Causes: " +graphList[m].causes+ "<br>Effect: "+graphList[m].effect+"<br>SubCauses: "+graphList[m].subcauses+"</h3><br>";
						document.getElementById("graphs").innerHTML += "<p><center><h3><button id='button"+m+"' onclick=\"vis_fishbone('"+causes+"', '" +graphList[m].effect+"', "+m+", '"+subcauses+"', '"+graphList[m].parents+"');\" class='btn btn-warning btn-lg'>Graph " +graphList[m].effect+" </button><br><br>";
						document.getElementById("graphs").innerHTML += "<div id='graph"+m+"'> </div> <div id='buttonyo"+m+"'> </div>";
                    }
                }
                
                
            }

        } else {
            console.log('Error: ' + xhr.status)
        }
    }

    xhr.send(null);
}