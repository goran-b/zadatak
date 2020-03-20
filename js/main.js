
let products=[];
async function ucitaj() {

    const snapshot = await firebase.firestore().collection('products').get()
    return snapshot.docs.map(doc => {
        doc.data()
        let product=doc.data()
        product.id=doc.id
        products.push(product) 
    });
}

ucitaj().then((a)=> {
     let main = document.getElementById("main");
    products.forEach(prod=>{
     
        main.innerHTML+=`<div class="card" onclick="javascript:toDetails('${prod.id}')">
        <img src="${prod.img1}">
        <div class="info">
            <strong class="title">${prod.name}</strong>
            <p class="price">${prod.price} KM</p>
        </div>
    </div>`
        
    })
    
})
.catch(function(error) {
    console.error("Error adding document: ", error);
});

function toDetails(id){

    window.location.assign('pages/details.html?id='+ id)  
}
function goCart(){
  
    window.location.assign("./pages/cart.html")
}
