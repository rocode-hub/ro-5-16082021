/* -------------------------------------------------------------------------------- */
/* classes                                                                          */
/* -------------------------------------------------------------------------------- */

class clsItem {
    constructor(param_id, param_name, param_img, param_price, param_lens, param_lenslib ) {
        this.str_id    = param_id;
        this.str_name  = param_name;
        this.str_img   = param_img;
        this.mon_price = param_price;
        this.int_lens  = param_lens;
        this.str_lens  = param_lenslib;
    }
};

class clsCart {
    constructor(param_ttc, param_tblitems) {
        this.mon_ttc = param_ttc;
        this.tbl_items = param_tblitems;
    }
};

/* -------------------------------------------------------------------------------- */
/* déclarations                                                                     */
/* -------------------------------------------------------------------------------- */

const str_urlget       = 'http://localhost:3000/api/cameras';
const str_tagitemlist  = 'item-list';
const str_tagitemimg   = 'item-img';
const str_tagitemname  = 'item-name';
const str_tagitemprice = 'item-price';
const str_tagiteminfo  = 'item-info';
const str_tagitemlens  = 'item-lens';
const str_tagcartchip  = 'cart-chip';
const str_tagcartnb    = 'cart-nb';
const str_tagcartlist  = 'cart-list';
const str_tagcartttc   = 'cart-ttc';
const str_idstorage    = 'orinoco_cart';

let obj_cart = new clsCart(0, []);
let obj_item;

/* -------------------------------------------------------------------------------- */
/* fonctions                                                                        */
/* -------------------------------------------------------------------------------- */

/* formatage monétaire */
/* -------------------------------------------------------------------------------- */
const euroPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
});

/* appel API */
/* -------------------------------------------------------------------------------- */
const getAPI = async function (param_URLget) {
    const response = await fetch(param_URLget);
    return await response.json();
};

/* récupération paramètre id dans URL */
/* -------------------------------------------------------------------------------- */
const getProductId = async function(param_id) {
    return new URL(window.location.href).searchParams.get(param_id);
};

/* affichage de tous les produits */
/* -------------------------------------------------------------------------------- */
async function fillCamList() {
    const tbl_cam = await getAPI(str_urlget);
    let html_itemlist = "";

    tbl_cam.forEach((elmt_camera) => {
        html_itemlist += `
            <div class="col-12 col-lg-4 col-md-6">
                <div class="card single-product">
                    <div class="product-image">
                        <img src="${elmt_camera.imageUrl}" alt="#">
                        <div class="button">
                            <a href="#" class="btn"><i class="lni lni-cart"></i> Acheter</a>
                        </div>
                    </div>
                    <div class="product-info">
                        <h4 class="title">
                            <a href="product-card.html?_id=${elmt_camera._id}" class="stretched-link">${elmt_camera.name}</a>
                        </h4>
                        <div class="price">
                            <span>${euroPrice.format(elmt_camera.price/100)}</span>
                        </div>
                    </div>
                </div>
            </div>`
        ;
    });
    document.getElementById(str_tagitemlist).innerHTML = html_itemlist;
}

/* affichage d'un produit */
/* -------------------------------------------------------------------------------- */
async function fillItemCard() {
    const item = await getAPI(str_urlget + '/' + (await getProductId('_id')));
    let html_lens = '';

    obj_item = new clsItem(item._id, item.name, item.imageUrl, item.price, 0, '');

    document.title = 'Orinoco : ' + item.name;
    document.getElementById(str_tagitemimg).setAttribute('src', item.imageUrl);
    document.getElementById(str_tagitemname).textContent = item.name;
    document.getElementById(str_tagitemprice).textContent = euroPrice.format(item.price/100);
    document.getElementById(str_tagiteminfo).textContent = item.description;
    item.lenses.forEach((elmt_item) => {
        html_lens += `
            <option>${elmt_item}</option>
            `;
    });
    document.getElementById(str_tagitemlens).innerHTML = html_lens;
}

/* mise à jour localstorage */
/* -------------------------------------------------------------------------------- */
async function updStorage() {
    localStorage.setItem(str_idstorage, JSON.stringify(obj_cart));
}

/* lecture localstorage */
/* -------------------------------------------------------------------------------- */
async function readStorage() {
    if (localStorage.length === 0) {
        updStorage();
    } else {

    /*    LECTURE STORAGE */


    };
    fillCartMini();
}

/* affichage mini panier temps réel */
/* -------------------------------------------------------------------------------- */
async function fillCartMini() {
    const html_cartchip = document.getElementById(str_tagcartchip);
    const int_cartnb = Object.keys(obj_cart.tbl_items).length;
    let html_cartlist = '';

    html_cartchip.innerHTML = '<i class="lni lni-cart"></i>';
    document.getElementById(str_tagcartlist).innerHTML = html_cartlist;

    if (int_cartnb > 0 ) {
        /* nombre d'articles - pastille */
        html_cartchip.innerHTML += `<span class="total-items">${int_cartnb}</span>`;
        /* affichage article */
        obj_cart.tbl_items.forEach((elmt_camera) => {
            html_cartlist += `
                <li>
                    <a href="javascript:void(0)" class="remove" title="Remove this item">
                        <i class="lni lni-close"></i>
                    </a>
                    <div class="cart-img-head">
                        <a class="cart-img-thumb cart-img" href="product-details.html">
                            <img src="${elmt_camera.str_img}" alt="#">
                        </a>
                    </div>
                    <div class="content">
                        <h4><a href="product-details.html">${elmt_camera.str_name}</a></h4>
                        <p>${elmt_camera.str_lens}</p>
                        <p class="text-primary">${euroPrice.format(elmt_camera.mon_price/100)}</p>
                    </div>
                </li>`
            ;
        });
        document.getElementById(str_tagcartlist).innerHTML = html_cartlist;
    
    }
    /* nombre d'articles - texte */
    document.getElementById(str_tagcartnb).innerText = `${int_cartnb} articles`;
    /* nombre d'articles - ttc */
    document.getElementById(str_tagcartttc).innerText = euroPrice.format(obj_cart.mon_ttc/100);
}  

/* ajout produit dans le panier */
/* -------------------------------------------------------------------------------- */
async function addCart() {
    let inputlens = document.getElementById(str_tagitemlens);
    let obj_new = obj_item;

    obj_new.int_lens = inputlens.selectedIndex;
    obj_new.str_lens = inputlens.value;
    obj_cart.mon_ttc += obj_item.mon_price;
    obj_cart.tbl_items.push(obj_new);
    updStorage();
    fillCartMini();
}
