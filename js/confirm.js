let STORAGE = []
let products = []
let totPrice = 0
let totProds = 0
const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}
const loadProducts = async () => {
    STORAGE = JSON.parse(localStorage.getItem("products")) || [];
    await asyncForEach(STORAGE, async (pr) => {
        await firebase.firestore().collection('products').doc(`${pr.id}`).get().then((doc) => {
            if (doc.exists) {
                product = doc.data()
                product.id = pr.id
                products.push(product)
                presentProduct(product, pr.q)
            } else {
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    });
    console.log('Done');
}

loadProducts();

let main = document.getElementById('main')
let table = document.getElementById('table')
let totalProducts = document.getElementById('totalProducts')
let totalPrice = document.getElementById('totalPrice')

function presentProduct(p, q) {
    t = p.price * q
    t = t.toFixed(2)
    totProds += q
    totPrice += p.price * q
    main.innerHTML += `<div class="card">
    <div class="top">
    <div class="img"><img src="${p.img1}">
    </div>
    <div class="product-title">
    <p class='bold'>${p.name}</p>
</div> </div>
    <div class="info">   
        <p>${p.price} KM</p>
        <p>X</p>
        <p>2</p>
        <p>=</p>
        <p class='price-total'>${t} KM</p>

    </div>
</div>`

    table.innerHTML += `<tr>
<td><img src="${p.img1}"></td>
<td>${p.name}</td>
<td>${p.price} KM</td>
<td>
    <div class="amount">      
        <p>&nbsp;${q}&nbsp;</p>
    </div>
</td>
<td class='price-total'>${t} KM</td>
</td>
</tr>`
    totalPrice.innerText = `Ukupno: ${totPrice.toFixed(2)}KM`
    totalProducts.innerText = `Proizvoda: ${totProds} Ukupno: ${totPrice.toFixed(2)}KM`
}

function changeQuantity(q, i) {
    let isRemoved = false
    STORAGE.forEach(e => {
        if (e.id == i) {
            e.q = e.q + q
            if (e.q < 1) {
                removeProduct(i)
                e.q = 1
                isRemoved = true

            }
        }
    });
    if (isRemoved) {
        return
    }
    saveProducts()
    clearProducts()

    STORAGE.forEach(el => {
        products.forEach(e => {
            if (el.id == e.id) {
                presentProduct(e, el.q)
            }
        });
    });
}


let errors = document.getElementById('errors')
function orderProducts() {
    let form = document.forms[0].elements;
    name = form.name.value,
    surname = form.surname.value,
    adress = form.adress.value,
    mail = form.mail.value,
    phone = form.phone.value


    

    let text;
    let letters = /^[a-z\u0161\u0111\u010D\u0107\u017E ]+$/gi;
    let numbers=/^[0-9]+$/;
    let mails=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if (name.length == ''|| name == null) {
        text = "Popunite ime!";
        errors.innerHTML = ` <span>${text}</span>`;
        return false;
    }
    if (!letters.test(name+surname)) {
        text = "Unesite ispravno ime i prezime!";
        errors.innerHTML = ` <span>${text}</span>`;
        return false;
    }
   
    if (surname.length == ''|| surname == null ) {
        text = "Popunite prezime!";
        errors.innerHTML = ` <span>${text}</span>`;
        return false;
    }
  

    if (adress.length == ''|| adress == null) {
        text = "Popunite adresu!";
        errors.innerHTML = ` <span>${text}</span>`;
        return false;
    }
    if (mail.length == ''|| mail == null) {
        text = "Popunite email!";
        errors.innerHTML = ` <span>${text}</span>`;
        return false;
    }
  
    if (!mails.test(mail)) {
        text = "Unesite ispravan email!";
        errors.innerHTML = ` <span>${text}</span>`;
        return false;
    }

    if (isNaN(phone) || phone.length < 9 || !numbers.test(phone)) {
        text = "Unesite ispravan telefon oblika 065123456!";
        errors.innerHTML = ` <span style='padding:2px'>${text}</span>`;
        return false;
    }

    let data = {
        name: form.name.value,
        surname: form.surname.value,
        adress: form.adress.value,
        mail: form.mail.value,
        phone: form.phone.value
    }

    alert(`Form Submitted Successfully!`);
    

}
function goCart(){
    window.location.assign("./cart.html")  
}
