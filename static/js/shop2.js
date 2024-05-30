let products = []
let favourites = []

//get products data
document.addEventListener('DOMContentLoaded', () => {
	upd_fav_data();
	fetch('/api/shop')
	  .then(response => response.json())
	  .then(data => {
		data.forEach(product => {
			products.push(product);
		});
	  })
	  .catch(error => console.error('Error fetching data:', error));
	console.log(products);
	display_products(products);
  });
  //get favourite data
//   document.addEventListener('DOMContentLoaded', () => {
// 	upd_fav_data();
//   });

  function upd_fav_data(){
	favourites = [];
	fetch('/api/fav')
	  .then(response => response.json())
	  .then(data => {
		data.forEach(fav => {
			if(favourites.includes(fav)){
			}else{
				favourites.push(fav);
			}
			
		});
	  })
	  .catch(error => console.error('Error fetching data:', error));
  }

let add_to_cart_btn = document.getElementsByClassName("add_to_cart");

function display_products(products_to_display){
  upd_fav_data();
  const pbody = document.getElementById('products');
  pbody.innerHTML = '';
  for(let i = 0; i < products_to_display.length; i++){
    let product_info = '';
	let fav_img = "/static/img/fav.png";
	let faved = favourites.includes(Number(products_to_display[i].id));
	console.log(products_to_display[i].id);
	console.log(favourites)
	if(faved){
		fav_img = "/static/img/faved.png";
	}
    product_info += '<div class="items">';
    product_info += `<img src="/static/img/${products_to_display[i].image}" alt="${products_to_display[i].name}">`;
    product_info += `<div class="name">${products_to_display[i].name}</div>`;
    product_info += `<table><tr><td class="behavior">${products_to_display[i].behavior}</td>`;
    product_info += `<td class="habitat">${products_to_display[i].habitat}</td></tr></table>`;
    product_info += `<div class="storage">Storage:${products_to_display[i].storage}</div>`;
    product_info += `<p class="price">$${products_to_display[i].price}</p>`;
    product_info += ` <img src=${fav_img} class="fav_btn" iid="${products_to_display[i].id}"></a>`;
    product_info += `<img src="/static/img/shopping-cart.png" class="add_to_cart">`;
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
	let c_id = products_to_filter[i].id;
	if(fav_checked){
		fit_fav=(favourites.includes(c_id));
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
//   display_products(result);
  let fav_btn = document.getElementsByClassName("fav_btn");
  Array.from(fav_btn).forEach(function(input){upd_fav(input);});
}


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
		if(favourites.includes(Number(ind))){
			input.src="/static/img/fav.png";
			favourites = favourites.filter(function(item){
				return item !== Number(ind)
			})
			fetch('/api/remove_fav', {
				'method': 'POST',
				'headers': {
					'Content-Type': 'application/json'
				},
				'body': JSON.stringify({data: ind})
			})
			.then(response => response.json())
			.catch(error => {console.error('Error:',error)});
		}else{
			input.src="/static/img/faved.png";
			favourites.push(Number(ind));
			fetch('/api/add_fav', {
				'method': 'POST',
				'headers': {
					'Content-Type': 'application/json'
				},
				'body': JSON.stringify({data: ind})
			})
			.then(response => response.json())
			.catch(error => {console.error('Error:',error)});
		}
		upd_fav_data();
	})
}

//fav button
let fav_btn = document.getElementsByClassName("fav_btn");
Array.from(fav_btn).forEach(function(input){upd_fav(input);});