const str_URLGet = "http://localhost:3000/api/cameras";
const str_HtmlIdStart = "products-list";

const euroPrice = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
    });

const getCamList = async function () {
    const response = await fetch(str_URLGet);
    return await response.json();
}

async function fillCamList() {

    const tbl_Cam = await getCamList();
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
                            <a href="product-card.html?id=${elmt_camera._id}">${elmt_camera.name}</a>
                        </h4>
                        <div class="price">
                            <span>${euroPrice.format(elmt_camera.price/100)}</span>
                        </div>
                    </div>
                </div>
            </div>
            `
    });

    document.getElementById(str_HtmlIdStart).innerHTML = html_ProductList;

};

fillCamList();
