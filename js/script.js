// Initialize Firebase
  var config = {
    apiKey: "AIzaSyB9RynyMVJPsIgE9xVqi71mP3UIckEjoXg",
    authDomain: "notes-4f85d.firebaseapp.com",
    databaseURL: "https://notes-4f85d.firebaseio.com",
    projectId: "notes-4f85d",
    storageBucket: "notes-4f85d.appspot.com",
    messagingSenderId: "34291808832"
  };
  firebase.initializeApp(config);

// Functions  
    function parseURLParams(url) {
        var queryStart = url.indexOf("?") + 1,
            queryEnd   = url.indexOf("#") + 1 || url.length + 1,
            query = url.slice(queryStart, queryEnd - 1),
            pairs = query.replace(/\+/g, " ").split("&"),
            parms = {}, i, n, v, nv;

        if (query === url || query === "") return;

        for (i = 0; i < pairs.length; i++) {
            nv = pairs[i].split("=", 2);
            n = decodeURIComponent(nv[0]);
            v = decodeURIComponent(nv[1]);

            if (!parms.hasOwnProperty(n)) parms[n] = [];
            parms[n].push(nv.length === 2 ? v : null);
        }
        return parms;
    } 

    function searchIfError (area, items) {
        return items.some(function (v) {
            return area.indexOf(v) >= 0;
        });
    };

    function firebaseSuccess(snapshot) {
        window.location.replace('../notes.html?notests=success');
    }

    function firebaseError(error) {
        window.location.replace('../new-note.html?notests=error');
    }

    function sendToFirebase(note) {
        var noteObject = {
            note: note
        };

        firebase.database().ref('notes').push().set(noteObject)
            .then(function(snapshot) {
                firebaseSuccess(snapshot); //success method
            }, function(error) {
                firebaseError(error); //error method
            });
    }


// Check if there was an error
var urlString = window.location.href;
var urlCorrect = urlString.includes('new-note.html?notests=error');
if (urlCorrect) {  
var urlParams = parseURLParams(urlString);
var notestsItems = ['error'];
var findError = searchIfError(urlParams.notests, notestsItems);
var notests = $('#notests');
if (findError) {
    notests.css({display: 'block'});
    notests.animate({opacity: '1'}, 250);
}
}

var submitButton = $('#submitButton');
var textarea = $('#noteTextarea');
var note;

submitButton.click(function() {
    if (textarea.val().length > 1) {
        note = textarea.val();
        sendToFirebase(note)
    }
});

