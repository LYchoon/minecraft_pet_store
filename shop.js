let products =[
	{'name': 'Bee', 'price': 10, 'habitat': 'sky', 'behavior': 'neutral', 'image_url': './resource/img/Bee_types.webp', 'storage':10, 'fav':false},
	{'name': 'Chicken', 'price': 20, 'habitat': 'land', 'behavior': 'passive', 'image_url': './resource/img/Chicken.webp', 'storage':100, 'fav':false},
	{'name': 'Cow', 'price': 50, 'habitat': 'land', 'behavior': 'passive', 'image_url': './resource/img/Cow.webp', 'storage':30, 'fav':false},
	{'name': 'Creeper', 'price': 120, 'habitat': 'land', 'behavior': 'hostile', 'image_url': './resource/img/Creeper.webp', 'storage':12, 'fav':true},
	{'name': 'Dolphin', 'price': 250, 'habitat': 'ocean', 'behavior': 'neutral', 'image_url': './resource/img/Dolphin.webp', 'storage':10, 'fav':false},
	{'name': 'Fox', 'price': 150, 'habitat': 'land', 'behavior': 'neutral', 'image_url': './resource/img/Fox.webp', 'storage':28, 'fav':false},
	{'name': 'Guardian', 'price': 600, 'habitat': 'ocean', 'behavior': 'hostile', 'image_url': './resource/img/Guardian.webp', 'storage':3, 'fav':true},
	{'name': 'Axolotl', 'price': 200, 'habitat': 'ocean', 'behavior': 'passive', 'image_url': './resource/img/Lucy_Axolotl.webp', 'storage':6, 'fav':false},
	{'name': 'Phantom', 'price': 400, 'habitat': 'sky', 'behavior': 'hostile', 'image_url': './resource/img/Phantom.webp', 'storage':4, 'fav':false},
	{'name': 'Pig', 'price': 40, 'habitat': 'land', 'behavior': 'passive', 'image_url': './resource/img/Pig.webp', 'storage':65, 'fav':false},
	{'name': 'Parrot', 'price': 80, 'habitat': 'sky', 'behavior': 'passive', 'image_url': './resource/img/Red_Parrot.webp', 'storage':30, 'fav':false},
	{'name': 'Sheep', 'price': 40, 'habitat': 'land', 'behavior': 'passive', 'image_url': './resource/img/Sheep.webp', 'storage':100, 'fav':false},
	{'name': 'Slime', 'price': 100, 'habitat': 'land', 'behavior': 'hostile', 'image_url': './resource/img/Slime.webp', 'storage':32, 'fav':false},
	{'name': 'Wolf', 'price': 140, 'habitat': 'land', 'behavior': 'neutral', 'image_url': './resource/img/Wolf.webp', 'storage':91, 'fav':true}
	
];

let add_to_cart_btn = document.getElementsByClassName("add_to_cart");

function display_products(products_to_display){
  const pbody = document.getElementById('products');
  pbody.innerHTML = '';
  for(let i = 0; i < products_to_display.length; i++){
    let product_info = '';
	let fav_img = "./resource/img/fav.png";
	if(products_to_display[i].fav){
		fav_img = "./resource/img/faved.png";
	}
    product_info += '<div class="items">';
    product_info += `<img src="${products_to_display[i].image_url}" alt="${products_to_display[i].name}">`;
    product_info += `<div class="name">${products_to_display[i].name}</div>`;
    product_info += `<table><tr><td class="behavior">${products_to_display[i].behavior}</td>`;
    product_info += `<td class="habitat">${products_to_display[i].habitat}</td></tr></table>`;
    product_info += `<div class="storage">Storage:${products_to_display[i].storage}</div>`;
    product_info += `<p class="price">$${products_to_display[i].price}</p>`;
    product_info += `<img src=${fav_img} class="fav_btn" iid="${i}">`;
    product_info += `<img src="./resource/img/shopping-cart.png" class="add_to_cart">`;
    product_info += '</div>';
    pbody.innerHTML += product_info;
  }
}

function apply_filter(){
  let products_to_filter = products;
  const behavior = document.getElementById('behavior').value;
  const habitat = document.getElementById('habitat').value;
  const max_price = document.getElementById('max_price').value;
  const min_price = document.getElementById('min_price').value;
  const fav_checked = document.getElementById('fav').checked;
  let result = [];
  for(let i = 0; i < products_to_filter.length; i++){
	let fit_habitat = false;
	let fit_behavior = false;
	let fit_fav = true;
	let fit_price = true;
	let c_habitat = products_to_filter[i].habitat;
	let c_behavior = products_to_filter[i].behavior;
	let c_price = products_to_filter[i].price;
	
	if(fav_checked){
		fit_fav=products_to_filter[i].fav;
	}
	
	if(behavior === "all"){
		fit_behavior = true;
	}else if(behavior === c_behavior){
		fit_behavior = true;
	}
	
	if(habitat === "all"){
		fit_habitat = true;
	}else if(c_habitat === habitat){
		fit_habitat = true;
	}
	
	if(max_price.length === 0){
	 }else if(c_price > max_price){
		 fit_price = false;
	 }
	 if(min_price.length === 0){
	 }else if(c_price < min_price){
		 fit_price = false;
	 }
	
    if(fit_price && fit_habitat && fit_behavior && fit_fav){
      result.push(products[i]);
    }
  }
  display_products(result);
  let fav_btn = document.getElementsByClassName("fav_btn");
  Array.from(fav_btn).forEach(function(input){upd_fav(input);});
}

display_products(products);
document.getElementById("behavior").addEventListener("change", function (){apply_filter()});
document.getElementById("habitat").addEventListener("change", function (){apply_filter()});
document.getElementById("fav").addEventListener("change", function (){apply_filter()});
document.getElementById("max_price").addEventListener("blur", function (){apply_filter()});
document.getElementById("min_price").addEventListener("blur", function (){apply_filter()});


Array.from(add_to_cart_btn).forEach(function(input){
	input.addEventListener("click",function(){
		console.log("hi");
	});
	
});

function upd_fav(input){
	let ind = input.getAttribute('iid');
	input.addEventListener("click",function(){
		console.log(input.getAttribute('iid'));
		if(products[ind].fav){
			input.src="./resource/img/fav.png";
			products[ind].fav=false;
		}else{
			input.src="./resource/img/faved.png";
			products[ind].fav=true;
		}
	})
}

//fav button
let fav_btn = document.getElementsByClassName("fav_btn");
Array.from(fav_btn).forEach(function(input){upd_fav(input);});