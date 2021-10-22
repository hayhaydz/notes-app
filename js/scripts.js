// Initialize Firebase
//   var config = {
//     apiKey: "AIzaSyB9RynyMVJPsIgE9xVqi71mP3UIckEjoXg",
//     authDomain: "notes-4f85d.firebaseapp.com",
//     databaseURL: "https://notes-4f85d.firebaseio.com",
//     projectId: "notes-4f85d",
//     storageBucket: "notes-4f85d.appspot.com",
//     messagingSenderId: "34291808832"
//   };
var config = {
    apiKey: "AIzaSyCAYKHWWhiLM6vDq6_1jJpeXRZrL0e6OSc",
    authDomain: "get-rent.firebaseapp.com",
    databaseURL: "https://get-rent.firebaseio.com",
    projectId: "get-rent",
    storageBucket: "get-rent.appspot.com",
    messagingSenderId: "767402603461"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

// Functions  
    function sanitizeInputs(string) {
        return string.replace(/[*+^{}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
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
    }

    function sendToFirebase(note) {
        var noteData = {
            note: note
        };

        database.ref('notes').push().set(noteData)
            .then(function(snapshot) {
                firebaseSuccess(snapshot); //success method
            }, function(error) {
                firebaseError(error); //error method
            });
    }
    function firebaseSuccess(snapshot) {
        window.location.replace('../notes.html?notests=success');
    }

    function firebaseError(error) {
        window.location.replace('../new-note.html?notests=error');
    }

    var noteParagraphItem = [];
    var retrieveCount = 0;
    function retrieveNotesFromFirebase() {
        var noteRef = database.ref('notes');

        noteRef.on('value', retrieveDataSuccess, retrieveDataError);
    }
    function retrieveDataSuccess(data) {
    //Display recieved Data.
    var notesData = data.val();
        if (notesData !== null) {
            // ++retrieveCount;
            // var keys = Object.keys(notesData);
            // keys.reverse();
            // for (var i = 0; i < keys.length; i++) {
            //     var k = keys[i];
            //     var finalNote = notesData[k].note;
            //     var finalNoteSanitized = sanitizeInputs(finalNote);
            //     //console.log(finalNote);
            //     writeNoteData(finalNote, i);
            // }
            console.log(notesData);
        }
        else {
            console.log('No data in database');
        }
    }
    function retrieveDataError(error) {
        console.log('Error');
        console.log(error);
    }
    function writeNoteData(noteData, count) {
        var noteContainer = document.getElementById('notes');
        if (retrieveCount > 1) {
            if (count < noteParagraphItem.length) {
                noteParagraphItem[count].remove();
            }
        }
        var noteParagraph = document.createElement('p');
        var noteText = document.createTextNode(noteData);
        noteParagraph.appendChild(noteText);
        noteContainer.appendChild(noteParagraph);
        noteParagraph.classList.add('noteParagraph');
        noteParagraphItem[count] = noteParagraph;
    }

// Check if there was an error
var urlString = window.location.href;
var urlNewNote = urlString.includes('new-note.html');
var urlNewNoteError = urlString.includes('new-note.html?notests=error');
var urlNotes = urlString.includes('notes.html');
if (urlNewNote) {  
//Send note to Firebase
var submitButton = $('#submitButton');
var textarea = $('#noteTextarea');
var note;
var noteEscaped;

submitButton.click(function() {
    if (textarea.val().length > 1) {
        note = textarea.val();
        sendToFirebase(note);
    }
});

//See if is at error URL.
if (urlNewNoteError) {
    var urlParams = parseURLParams(urlString);
    var notestsItems = ['error'];
    var findError = searchIfError(urlParams.notests, notestsItems);
    var notests = $('#notests');
    if (findError) {
    notests.css({display: 'block'});
    notests.animate({opacity: '1'}, 250);
    }
}
}

//Retrieve notes from Firebase
if (urlNotes) {
    retrieveNotesFromFirebase();   
}

