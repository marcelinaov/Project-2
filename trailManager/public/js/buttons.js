// function onSignIn(googleUser){
//   var profile = googleUser.getBasicProfile();
//   $(".g-signin2").css("display", "none");
//   $(".data").css("display", "block");
//   $("#pic").attr("scr", profile.getImageUrl());
//   $("#email").text(profile.getEmail());
// }

// function signOut(){
//   var auth2 = gapi.auth2.getAuthInstance();
//   auth2.signOut()
//   .then(function(){
//     alert("You have been successfully signed out");
//     $(".g-signin2").css("display", "block");
//     $(".data").css("display", "none");
//   });
// }

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}

// auth2 is initialized with gapi.auth2.init() and a user is signed in.

if (auth2.isSignedIn.get()) {
  var profile = auth2.currentUser.get().getBasicProfile();
  console.log('ID: ' + profile.getId());
  console.log('Full Name: ' + profile.getName());
  console.log('Given Name: ' + profile.getGivenName());
  console.log('Family Name: ' + profile.getFamilyName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail());
}

gapi.load('auth2', function() {
  auth2 = gapi.auth2.init({
    client_id: 'CLIENT_ID.apps.googleusercontent.com',
    fetch_basic_profile: false,
    scope: 'profile'
  });

  // Sign the user in, and then retrieve their ID.
  auth2.signIn().then(function() {
    console.log(auth2.currentUser.get().getId());
  });
});

//Authentication with backend

function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;
  ...
}

var xhr = new XMLHttpRequest();
xhr.open('POST', 'https://yourbackend.example.com/tokensignin');
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.onload = function() {
  console.log('Signed in as: ' + xhr.responseText);
};
xhr.send('idtoken=' + id_token);

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;

...

GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
    // Specify the CLIENT_ID of the app that accesses the backend:
    .setAudience(Collections.singletonList(CLIENT_ID))
    // Or, if multiple clients access the backend:
    //.setAudience(Arrays.asList(CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3))
    .build();

// (Receive idTokenString by HTTPS POST)

GoogleIdToken idToken = verifier.verify(idTokenString);
if (idToken != null) {
  Payload payload = idToken.getPayload();

  // Print user identifier
  String userId = payload.getSubject();
  System.out.println("User ID: " + userId);

  // Get profile information from payload
  String email = payload.getEmail();
  boolean emailVerified = Boolean.valueOf(payload.getEmailVerified());
  String name = (String) payload.get("name");
  String pictureUrl = (String) payload.get("picture");
  String locale = (String) payload.get("locale");
  String familyName = (String) payload.get("family_name");
  String givenName = (String) payload.get("given_name");

  // Use or store profile information
  // ...

} else {
  System.out.println("Invalid ID token.");
}

// {
//   // These six fields are included in all Google ID Tokens.
//   "iss": "https://accounts.google.com",
//   "sub": "110169484474386276334",
//   "azp": "1008719970978-hb24n2dstb40o45d4feuo2ukqmcc6381.apps.googleusercontent.com",
//   "aud": "1008719970978-hb24n2dstb40o45d4feuo2ukqmcc6381.apps.googleusercontent.com",
//   "iat": "1433978353",
//   "exp": "1433981953",
 
//   // These seven fields are only included when the user has granted the "profile" and
//   // "email" OAuth scopes to the application.
//   "email": "testuser@gmail.com",
//   "email_verified": "true",
//   "name" : "Test User",
//   "picture": "https://lh4.googleusercontent.com/-kYgzyAWpZzJ/ABCDEFGHI/AAAJKLMNOP/tIXL9Ir44LE/s99-c/photo.jpg",
//   "given_name": "Test",
//   "family_name": "User",
//   "locale": "en"
//  }