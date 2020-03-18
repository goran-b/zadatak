let product
let params = (new URL(document.location)).searchParams
let id = params.get('id')

async function ucitajProizvod() {

    await firebase.firestore().collection('products').doc(`${id}`).get().then((doc) => {
        if (doc.exists) {
            product = doc.data()
            product.id = doc.id
        } else {
            console.log("No such document!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}

let name = document.getElementById("name");
let desc = document.getElementById('desc')
let price = document.getElementById('price')
let img = document.getElementById('img')

ucitajProizvod().then((a) => {

    name.innerText = product.name
    desc.innerText = product.desc
    price.innerText = product.price
    img.innerHTML = `<img src="${product.img1}">`


}).catch(function (error) {
    console.error("Error adding document: ", error);
});



function sledecaSlika() {
    console.log(id)
}