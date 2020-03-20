 // Your web app's Firebase configuration
 var firebaseConfig = {
    apiKey: "AIzaSyAE8ypKBmc3sYKNfPdX2pM61fxq3mlO9vw",
    authDomain: "products-45677.firebaseapp.com",
    databaseURL: "https://products-45677.firebaseio.com",
    projectId: "products-45677",
    storageBucket: "products-45677.appspot.com",
    messagingSenderId: "1056378206419",
    appId: "1:1056378206419:web:f9d5e94b89776c9cd2fc26"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function goBack() {
    
    location.href = document.referrer; return false;
}
function goHome(){
    location.replace("/index.html")
}
function goCart(){
    location.replace("/pages/cart.html")
}