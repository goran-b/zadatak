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
        <div class="amount">
            <div class="btn" onclick="changeQuantity(-1,'${p.id}')"><i class="material-icons">
                    remove
                </i>
            </div>
            <p>&nbsp;${q}&nbsp;</p>
            <div class="btn" onclick="changeQuantity(1,'${p.id}')"><i class="material-icons">
                    add
                </i>
            </div>
        </div>
        <p class='price-total'>${t} KM</p>
        <div class="cancel" >
            <i class="material-icons" onclick="removeProduct('${p.id}')">highlight_off</i>
        </div>
    </div>

</div>`
    table.innerHTML += `<tr>
<td><img src="${p.img1}"></td>
<td class='bold'>${p.name}</td>
<td>${p.price} KM</td>
<td>
    <div class="amount">
        <div class="btn" onclick="changeQuantity(-1,'${p.id}')"><i class="material-icons">
                remove
            </i>
        </div>
        <p>&nbsp;${q}&nbsp;</p>
        <div class="btn" onclick="changeQuantity(1,'${p.id}')"><i class="material-icons">
                add
            </i>
        </div>
    </div>
</td>
<td class='prize-total'>${t} KM</td>
<td class='cancel'>
    <div class="title" >
        <i class="material-icons" onclick="removeProduct('${p.id}')">highlight_off</i>
    </div>
</td>
</tr>`
    totalPrice.innerText = `Ukupno: ${totPrice.toFixed(2)}KM`
    totalProducts.innerText = `Proizvoda: ${totProds}`
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

function clearProducts() {
    totProds = 0
    totPrice = 0
    main.innerHTML = ''
    table.innerHTML = `<tr>
    <th>Slika</th>
    <th>Naziv</th>
    <th>Cijena po komadu</th>
    <th>Kolicina</th>
    <th>Ukupno</th>
    <th>Ukloni</th>
</tr>`
}

function removeProduct(id) {
    if (!confirm('Da li ste sigurni da zelite uklnoiti proizvod?')) {
        return
    }

    STORAGE = STORAGE.filter(el => {
        return el.id != id;
    })

    products = products.filter(el => {
        return el.id != id;
    })

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

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(STORAGE));
}

function toConfirm(){
    location.assign("./confirm.html")
}
