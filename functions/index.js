const functions = require('firebase-functions');
const cors = require('cors')({origin: "*"});

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();
// [END import]

// [START addMessage]
// Take the text parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /messages/:documentId/original
// [START addMessageTrigger]
exports.addMessage = functions.https.onRequest(async (req, res) => {
// [END addMessageTrigger]
  // Grab the text parameter.
  const original = req.query.text;
  // [START adminSdkAdd]
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await admin.firestore().collection('messages').add({original: original});
  // Send back a message that we've successfully written the message
  res.json({result: `Message with ID: ${writeResult.id} added.`});
  // [END adminSdkAdd]
});


exports.saveGraph = functions.https.onRequest((request, response) =>
{
    cors(request, response, () => {
        //const currentTime = admin.firestore.Timestamp.now();
        //request.body.timestamp = currentTime;

        return admin.firestore().collection("graph").add(request.body).then((snapshot) =>{
            console.log("saved in database");
            console.log(snapshot.id);
            // console.log(snapshot.DocumentReference.toString());
            // console.log("sending document reference id: ");
            //console.log(DocumentReference[id]);
            response.send(JSON.stringify(snapshot.id));
        });
    });
});

exports.saveGraphPrivate = functions.https.onRequest((request, response) =>
{
    cors(request, response, () => {
        //const currentTime = admin.firestore.Timestamp.now();
        //request.body.timestamp = currentTime;

        return admin.firestore().collection("graphPrivate").add(request.body).then((snapshot) =>{
            console.log("saved in database");
            console.log(snapshot.id);
            // console.log(snapshot.DocumentReference.toString());
            // console.log("sending document reference id: ");
            //console.log(DocumentReference[id]);
            response.send(JSON.stringify(snapshot.id));
        });
    });
});


exports.createUser = functions.https.onRequest((request, response) =>
{
    console.log("createUserObj called");
    console.log("Request body", request.body);
    console.log("request.email: ", request.body.email);
    console.log("request.password: ", request.body.password);
    cors(request, response, () => {
        //const currentTime = admin.firestore.Timestamp.now();
        //request.body.timestamp = currentTime;

        return admin.firestore().collection("users").add(request.body).then((snapshot) =>{
            console.log("saved in database");
            console.log(snapshot.id);
            // console.log(snapshot.DocumentReference.toString());
            // console.log("sending document reference id: ");
            //console.log(DocumentReference[id]);
            response.send(JSON.stringify(snapshot.id));
        });
    });
});

exports.returnGraphs = functions.https.onRequest((request, response) => {
	console.log("returnGraphs");

    //connect to our Firestore database
    cors(request, response, () => {
        let myData = []
        //console.log("request body: "+request.body);
        //console.log("request docid: "+request.body.docid);
		//doc(request.body.docid)
		console.log("request: "+request.body.toString());
		console.log("at least it worked");
        admin.firestore().collection("graph").get().then((snapshot) => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                response.status(404).send('No data in database'); // fix syntax error and add error status
                return;
            }

            snapshot.forEach(doc => {
				let docObj = {};
                docObj.id = doc.id;
                myData.push(Object.assign(docObj, doc.data()));
            })
			console.log("myData: "+myData[0].code);
            response.send(myData);
        }).catch((error) => { // add catch block to handle errors
            console.error(error);
            response.status(500).send('Internal server error');
        });
    });
});

exports.returnUserGraphs = functions.https.onRequest((request, response) => {
	console.log("returnUserGraphs");

    //connect to our Firestore database
    cors(request, response, () => {
        let myData = []
        //console.log("request body: "+request.body);
        //console.log("request docid: "+request.body.docid);
		//doc(request.body.docid)
		console.log("request: "+request.body.toString());
		console.log("at least it worked");
        admin.firestore().collection("graphPrivate").get().then((snapshot) => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                response.status(404).send('No data in database'); // fix syntax error and add error status
                return;
            }

            snapshot.forEach(doc => {
				let docObj = {};
                docObj.id = doc.id;
                myData.push(Object.assign(docObj, doc.data()));
            })
			console.log("myData: "+myData[0].code);
            response.send(myData);
        }).catch((error) => { // add catch block to handle errors
            console.error(error);
            response.status(500).send('Internal server error');
        });
    });
});



exports.returnUserEmail = functions.https.onRequest((request, response) => {

    //connect to our Firestore database
    cors(request, response, () => {
        let myData = []
        //console.log("request body: "+request.body);
        //console.log("request docid: "+request.body.docid);
		//doc(request.body.docid)
		console.log("request: "+request.body.toString());
		console.log("at least it worked");
        admin.firestore().collection("users").get().then((snapshot) => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                response.status(404).send('No data in database'); // fix syntax error and add error status
                return;
            }

            snapshot.forEach(doc => {
				let docObj = {};
                docObj.id = doc.id;
                myData.push(Object.assign(docObj, doc.data()));
            })
			console.log("myData: "+myData[0].code);
            response.send(myData);
        }).catch((error) => { // add catch block to handle errors
            console.error(error);
            response.status(500).send('Internal server error');
        });
    });
});


exports.authorizedendpoint = functions.https.onRequest((request, response) => {
    cors(request, response, () => {

        console.log('Check if request is authorized with Firebase ID token');
        if ((!request.headers.authorization || !request.headers.authorization.startsWith('Bearer '))) {
            console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
                'Make sure you authorize your request by providing the following HTTP header:',
                'Authorization: Bearer <Firebase ID Token>');
            response.status(403).send('Unauthorized');
            return;
        }
        let idToken;
        if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
            console.log('Found "Authorization" header');
            // Read the ID Token from the Authorization header.
            idToken = request.headers.authorization.split('Bearer ')[1];
        } else {
            // No cookie
            response.status(403).send('Unauthorized');
            return;
        }
        try {
            admin.auth().verifyIdToken(idToken).then((token) => {
                console.log('ID Token correctly decoded', token);
                // Use token.uid to get documents belonging to a user
                let myComments = [];
                admin.firestore().collection('comments').where('uid', '==', token.uid).get().then((snapshot) => {

                    if (snapshot.empty) {
                        console.log('No matching documents.');
                        response.send('No data ');
                        return;
                    }

                    snapshot.forEach(doc => {
                        let docObj = {};
                        docObj.id = doc.id;
                        myComments.push(Object.assign(docObj, doc.data()));
                    });

                    // 2. Send data back to client
                    response.send(myComments);
                })
            });
        } catch (error) {
            console.error('Error while verifying Firebase ID token:', error);
            response.status(403).send('Unauthorized');
            return;
        }
});
});
