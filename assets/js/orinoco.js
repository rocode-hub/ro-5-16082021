const str_URLGet  = "http://localhost:3000/api/cameras";
const str_IdStart = "product-list";
const str_IdImg   = "current";
const str_IdName  = "product-name";
const str_IdPrice = "product-price";
const str_IdInfo  = "product-info";
const str_IdLens  = "lens";

const euroPrice = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
    });

const getAPI = async function (param_URLGet) {
    const response = await fetch(param_URLGet);
    return await response.json();
}

const getProductId = async function(param_Id) {
    return new URL(window.location.href).searchParams.get(param_Id);
}

async function fillCamList() {

    const tbl_Cam = await getAPI(str_URLGet);
    let html_ProductList = "";

    tbl_Cam.forEach((elmt_camera) => {
        html_ProductList += `
            <div class="col-12 col-lg-4 col-md-6">
                <div class="single-product">
                    <div class="product-image">
                        <img src="${elmt_camera.imageUrl}" alt="#">
                        <div class="button">
                            <a href="#" class="btn"><i class="lni lni-cart"></i> Acheter</a>
                        </div>
                    </div>
                    <div class="product-info">
                        <h4 class="title">
                            <a href="product-card.html?_id=${elmt_camera._id}">${elmt_camera.name}</a>
                        </h4>
                        <div class="price">
                            <span>${euroPrice.format(elmt_camera.price/100)}</span>
                        </div>
                    </div>
                </div>
            </div>
            `
    });
    document.getElementById(str_IdStart).innerHTML = html_ProductList;

}

async function fillProductCard() {

    const num_ProductId = await getProductId("_id");
    const tbl_Product = await getAPI(str_URLGet + "/" + num_ProductId);
    let html_lenselist = "";

    document.title = "Orinoco : " + tbl_Product.name;
    document.getElementById(str_IdImg).setAttribute( "src", tbl_Product.imageUrl);
    document.getElementById(str_IdName).textContent = tbl_Product.name;
    document.getElementById(str_IdPrice).textContent = euroPrice.format(tbl_Product.price/100);
    document.getElementById(str_IdInfo).textContent = tbl_Product.description;

    tbl_Product.lenses.forEach((elmt_product) => {
        html_lenselist += `
            <option>${elmt_product}</option>
            `
    });
    document.getElementById(str_IdLens).innerHTML = html_lenselist;

}
