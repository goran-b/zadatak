let product
let params = (new URL(document.location)).searchParams
let id = params.get('id')
let curentQuantity
let STORAGE = []
let exists
loadSTORAGE()

async function loadProduct() {
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
let numbertext = document.getElementById('numbertext')
let dots = document.getElementsByClassName("dot");

loadProduct().then((a) => {

    name.innerText = product.name
    desc.innerText = product.desc
    price.innerHTML = `<span>${product.price}KM</span>`
    showImage(0);
    showQuantity(1)

}).catch(function (error) {
    console.error("Error adding document: ", error);
});

let curentImageId
function showImage(imgId) {

    if (imgId > -1) {

        curentImageId = imgId
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        dots[curentImageId].className += " active";
        img.innerHTML = `<span class="numbertext">${imgId + 1}/5</span><img src="${indexToImage(imgId)}" alt='Photo'>`
    } else { img.innerText = 'Somethings goes wrong!' }
}

function indexToImage(n) {
    let image
    switch (n) {
        case 0:
            image = product.img1
            break;
        case 1:
            image = product.img2
            break;
        case 2:
            image = product.img3
            break;
        case 3:
            image = product.img4
            break;
        case 4:
            image = product.img5
    }
    return image
}


function nextImage(n) {
    let next = curentImageId + n
    if (next > 4) {
        next = 0
    } else if (next < 0) {
        next = 4
    }
    showImage(next)
}

let quantity = document.getElementById('quantity')
let total = document.getElementById('total')

function changeQuantity(n) {
    let q = curentQuantity + n
    if (q < 0) {
        q = 0

    }
    curentQuantity = q
    showQuantity(q)
}

function showQuantity(q) {
    quantity.innerHTML = `&nbsp;${curentQuantity}&nbsp;`
    total.innerHTML = `<h2 >Ukupno: ${(product.price * curentQuantity).toFixed(2)} KM</h2>`

}


function loadSTORAGE() {
    STORAGE = JSON.parse(localStorage.getItem("products")) || [];
    let pr
    STORAGE.forEach(e => {
        if (e.id == id) {
            pr = e
            exists = true
        }
    });
    if (pr) {
        curentQuantity = pr.q
    } else {
        curentQuantity = 1
    }
}


function addToCart() {

    if (exists) {
        STORAGE.forEach(e => {
            if (e.id == id) {
                e.q = curentQuantity
            }
        });
    } else {
        let product = {}
        product.id = id;
        product.q = curentQuantity
        STORAGE.push(product)
    }

    if (curentQuantity < 1) {
        alert('Nije moguće dodati 0 proizvoda!')
        return
    } else {
        localStorage.setItem("products", JSON.stringify(STORAGE));
        alert(`Uspješno ste dodavli ${curentQuantity} proizvoda!`)
        location.reload();
    }
}
