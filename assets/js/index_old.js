const str_URLGet = "http://localhost:3000/api/cameras";
const str_HtmlIdStart = "products-list";

const getCamList = async function () {
    const response = await fetch(str_URLGet);
    return await response.json();
}

async function fillCam() {

    const tbl_Cam = await getCamList();
    let html_IdStart = document.getElementById(str_HtmlIdStart);

    tbl_Cam.forEach((elmt_camera) => {

        let html_DivCol = document.createElement("div");
        html_DivCol.classList.add("col-lg-4", "col-md-6", "col-12");
        html_IdStart.appendChild(html_DivCol);

        let html_DivProd = document.createElement("div");
        html_DivProd.classList.add("single-product");
        html_DivCol.appendChild(html_DivProd);

        let html_DivImg = document.createElement("div");
        html_DivImg.classList.add("product-image");
        html_DivProd.appendChild(html_DivImg);

        let html_Img = document.createElement("img");
        html_Img.setAttribute("src", elmt_camera.imageUrl);
        html_Img.setAttribute("alt", "#");
        html_DivImg.appendChild(html_Img);

        let html_Btn = document.createElement("div");
        html_Btn.classList.add("button");
        html_DivImg.appendChild(html_Btn);

        let html_Btna = document.createElement("a");
        html_Btna.classList.add("btn");
        html_Btna.setAttribute("href", "#");
        html_Btna.innerHTML = "<i class=\"lni lni-cart\"></i> Acheter";
        html_Btn.appendChild(html_Btna);

        let html_DivInfo = document.createElement("div");
        html_DivInfo.classList.add("product-info");
        html_DivProd.appendChild(html_DivInfo);

        let html_Title = document.createElement("h4");
        html_Title.classList.add("title");
        html_DivInfo.appendChild(html_Title);

        let html_Titlea = document.createElement("a");
        html_Titlea.setAttribute("href", "product.html?id=" + elmt_camera._id);
        html_Titlea.textContent = elmt_camera.name;
        html_Title.appendChild(html_Titlea);

        let html_Price = document.createElement("div");
        html_Titlea.setAttribute("href", "product.html?id=" + elmt_camera._id);
        html_Titlea.textContent = elmt_camera.name;
        html_Title.appendChild(html_Titlea);

    });
};

fillCam();
