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
const str_tagorderlist = 'order-list';
const str_tagorderttc  = 'order-ttc';
const str_tagorderform = 'order-account';
const str_tagorderbtn  = 'order-btn';
const str_tagsumnb     = 'sum-nb';
const str_tagsumstotal = 'sum-stotal';
const str_tagsumttc    = 'sum-ttc';
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
    try {
        const response = await fetch(param_URLget);
        return await response.json();
    } catch {
        alert('Le serveur n\'est pas joignable !');
    }
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
    let html_itemlist = '';

    if (!(typeof tbl_cam === 'undefined')) {
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
                                <a href="item-card.html?_id=${elmt_camera._id}" class="stretched-link">${elmt_camera.name}</a>
                            </h4>
                            <div class="price">
                                <span>${euroPrice.format(elmt_camera.price/100)}</span>
                            </div>
                        </div>
                    </div>
                </div>`
            ;
        });
    }
    document.getElementById(str_tagitemlist).innerHTML = html_itemlist;
}

/* affichage d'un produit */
/* -------------------------------------------------------------------------------- */
async function fillItemCard() {
    const item = await getAPI(str_urlget + '/' + (await getProductId('_id')));
    let html_lens = '';

    if (!(typeof item === 'undefined')) {
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
    }
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
        obj_cart = JSON.parse(localStorage.getItem(str_idstorage));
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
        obj_cart.tbl_items.forEach((elmt_item, elmt_index) => {
            html_cartlist += `
                <li>
                    <a onclick="removeCart(${elmt_index});" class="remove" title="Supprimer cet article">
                        <i class="lni lni-close"></i>
                    </a>
                    <div class="cart-img-head">
                        <a class="cart-img-thumb cart-img" href="item-card.html?_id=${elmt_item.str_id}">
                            <img src="${elmt_item.str_img}" alt="#">
                        </a>
                    </div>
                    <div class="content">
                        <h4><a href="item-card.html?_id=${elmt_item.str_id}">${elmt_item.str_name}</a></h4>
                        <p>${elmt_item.str_lens}</p>
                        <p class="text-primary">${euroPrice.format(elmt_item.mon_price/100)}</p>
                    </div>
                </li>`
            ;
        });
        document.getElementById(str_tagcartlist).innerHTML = html_cartlist;
    
    }
    /* nombre d'articles - texte */
    document.getElementById(str_tagcartnb).textContent = `${int_cartnb} articles`;
    /* nombre d'articles - ttc */
    document.getElementById(str_tagcartttc).textContent = euroPrice.format(obj_cart.mon_ttc/100);
}  

/* panier - ajout article */
/* -------------------------------------------------------------------------------- */
async function addCart() {
    let inputlens = document.getElementById(str_tagitemlens);
    let obj_itemnew = new clsItem(obj_item.str_id, obj_item.str_name, obj_item.str_img, obj_item.mon_price,
                                  inputlens.selectedIndex, inputlens.value)
    obj_cart.mon_ttc += obj_item.mon_price;
    obj_cart.tbl_items.push(obj_itemnew);
    updStorage();
    fillCartMini();
}

/* panier - suppression article */
/* -------------------------------------------------------------------------------- */
async function removeCart(param_index) {
    obj_cart.mon_ttc -= obj_cart.tbl_items[param_index].mon_price;
    obj_cart.tbl_items.splice(param_index, 1);
    updStorage();
    fillCartMini();
}

/* panier */
/* -------------------------------------------------------------------------------- */
async function fillCart() {
    const int_cartnb = Object.keys(obj_cart.tbl_items).length;
    const order_form = document.getElementById(str_tagorderform);
    const order_btn  = document.getElementById(str_tagorderbtn);
    let html_orderlist = '';
    order_form.setAttribute('hidden', '');
    order_btn.setAttribute('hidden', '');

    document.getElementById(str_tagorderlist).innerHTML = html_orderlist;

    if (int_cartnb > 0 ) {
        /* affichage article */
        obj_cart.tbl_items.forEach((elmt_item, elmt_index) => {
            html_orderlist += `
                <div class="col-lg-6 col-12">
                    <div class="card single-product">
                        <img src="${elmt_item.str_img}" alt="#">
                        <h6 class="mt-3">${elmt_item.str_name}</h6>
                        <p>${elmt_item.str_lens}<span class="text-primary align-right font-bold">${euroPrice.format(elmt_item.mon_price/100)}</span></p>
                        <div class="button cart-button text-center mt-2">
                            <button class="btn" onclick="removeCart(${elmt_index});fillCart();">Supprimer</button>
                        </div>
                    </div>
                </div>`
            ;
        });
        document.getElementById(str_tagorderlist).innerHTML = html_orderlist;
        order_form.removeAttribute('hidden');
        order_btn.removeAttribute('hidden');
    }
    /* nombre d'articles */
    document.getElementById(str_tagsumnb).textContent = `${int_cartnb} articles`;
    /* sous-total */
    document.getElementById(str_tagsumstotal).textContent = euroPrice.format(obj_cart.mon_ttc/100);
    /* ttc */
    document.getElementById(str_tagsumttc).textContent = euroPrice.format(obj_cart.mon_ttc/100);
}

/* formulaire - contrôle */
/* -------------------------------------------------------------------------------- */
async function submitOrder() {
    document.getElementById('form-btn').click();
    document.getElementById('form-btn').clear();
}

/* formulaire - confirmation */
/* -------------------------------------------------------------------------------- */
async function validateOrder() {
    window.open('./validation.html');
}

/* confirmation de commande */
/* -------------------------------------------------------------------------------- */
async function validationOrder() {
    obj_cart = JSON.parse(localStorage.getItem(str_idstorage));
    document.getElementById(str_tagorderttc).textContent = euroPrice.format(obj_cart.mon_ttc/100);
    localStorage.clear();
    obj_cart.mon_ttc = 0;
    obj_cart.tbl_items = [];
    updStorage();
}
