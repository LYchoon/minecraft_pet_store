// some resource
const fav_img = '/static/img/fav.png'
const faved_img = '/static/img/faved.png'
const cart_img = '/static/img/shopping-cart.png'

// fetch all products data
let products = []
document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/shop')
        .then(response => response.json())
        .then(data => {
            data.forEach(p => {
                products.push(p);
            });
        })
        .catch(error => console.error('Error fetching product\'s data:', error));
})

// fetch favourite products data
let favourites = []
function fetch_fav_data(){
    favourites = [] // initial data
    fetch('/api/fav')
        .then(response => response.json())
        .then(data => {
            data.forEach(p => {
                favourites.push(p);
            });
        })
        .catch(error => console.error('Error fetching product\'s data:', error));
    
    // console.log(favourites);
}
document.addEventListener('DOMContentLoaded', () => {
    fetch_fav_data();
})


// filter elements
let behavior_filter = document.getElementById("behavior");
let habitat_filter = document.getElementById("habitat");
let favourite_filter = document.getElementById("fav");
let max_price_filter = document.getElementById("max_price");
let min_price_filter = document.getElementById("min_price");
// add eventlistener
// 我想應該有什麽辦法可以一般化這部分代碼
behavior_filter.addEventListener("change", function (){display_products()});
habitat_filter.addEventListener("change", function (){display_products()});
favourite_filter.addEventListener("change", function (){display_products()});
max_price_filter.addEventListener("blur", function (){display_products()});
min_price_filter.addEventListener("blur", function (){display_products()});
add_eventlistener();


// display fucntion
function display_products(){
    const pbody = document.getElementById('products');
    pbody.innerHTML = ''; // clear it
    for(let i = 0; i < products.length; i++){
        // check filter criterion
        let check = true;
        if(behavior_filter.value === 'all'){}
        else if(products[i].behavior !== behavior_filter.value){
            check = false;
            // console.log('products'+i+'not match behavior')
        }
        if(habitat_filter.value === 'all'){}
        else if(products[i].habitat !== habitat_filter.value){
            check = false;
            // console.log('products'+i+'not match habitat')
        }

        if(max_price_filter.value.length === 0){}
        else if(products[i].price > max_price_filter.value){
            check = false;
            // console.log('products'+i+'not match max price')
        }

        if(min_price_filter.value.length === 0){}
        else if(products[i].price < min_price_filter.value){
            check = false;
            // console.log('products'+i+'not match min price')
        }

        if(favourite_filter.checked){
            if(favourites.includes(products[i].id)){}
            else{
                check = false;
                // console.log('products'+i+'not match fav')
            }
        }
        if(check){
            let product_info = '';
            product_info += '<div class="items">';
            product_info += `<img src="/static/img/${products[i].image}" alt="${products[i].name}">`;
            product_info += `<div class="name">${products[i].name}</div>`;
            product_info += `<table><tr><td class="behavior">${products[i].behavior}</td>`;
            product_info += `<td class="habitat">${products[i].habitat}</td></tr></table>`;
            product_info += `<div class="storage">Storage:${products[i].storage}</div>`;
            product_info += `<p class="price">$${products[i].price}</p>`;
            if(favourites.includes(products[i].id)){product_info += ` <img src=${faved_img} alt='favourited' class="fav_btn" iid="${products[i].id}">`;}
            else{product_info += ` <img src=${fav_img} alt='favourite' class="fav_btn" iid="${products[i].id}">`;}
            product_info += `<img src=${cart_img} alt='cart' class="add_to_cart" name='${products[i].name}' iid="${products[i].id}">`;
            product_info += '</div>';
            pbody.innerHTML += product_info;
        }
    }
    // remember to add eventlistener at here
    add_eventlistener();
}

function add_eventlistener(){
    // add cart button
    let add_to_cart_btn = document.getElementsByClassName("add_to_cart");
    Array.from(add_to_cart_btn).forEach(function(input){
        input.addEventListener("click",function(){
            let id = input.getAttribute('iid');
			let name = input.getAttribute('name');
            add_cart(id,name);
        });
        
    });
    // favourite button
    let fav_btn = document.getElementsByClassName("fav_btn");
    Array.from(fav_btn).forEach(function(input){
        input.addEventListener("click",function(){
            let id = input.getAttribute('iid');
            upd_fav(Number(id),input);
        });
        
    });
}


// add to cart button
function add_cart(id,name='item'){
	fetch('/api/add_cart', {
		'method' : 'POST',
		'headers' : {
			'Content-Type' : 'application/json'
		},
		'body': JSON.stringify({data: id})
	})
	.then(response => response.json())
	.then(data => {
		if(data.success){
			alert(`${name} 成功加入購物車`)
		}else{
			alert(`${name} 已經在購物車了`);
		}
	})
	.catch(error => {console.error('Error: ',error)});
}

// update favourite button
function upd_fav(id,btn){
    // check fav status
    if(favourites.includes(id)){ //faved to fav
        btn.src = fav_img;
        // api
        fetch('/api/remove_fav', {
            'method' : 'POST',
            'headers' : {
                'Content-Type' : 'application/json'
            },
            'body': JSON.stringify({data: id})
        })
        .then(response => response.json())
        .catch(error => {console.error('Error: ',error)});
        favourites = favourites.filter(function(item){// delete id from favourites
            return item !== id
        })
    }else{ // fav to faved
        btn.src = faved_img;
        // api
        fetch('/api/add_fav', {
            'method' : 'POST',
            'headers' : {
                'Content-Type' : 'application/json'
            },
            'body': JSON.stringify({data: id})
        })
        .then(response => response.json())
        .catch(error => {console.error('Error: ',error)});
        favourites.push(id); // add id to favourites
        // console.log(favourites);
    }
}

// Apply favorite button event listeners
let fav_btn = document.getElementsByClassName("fav_btn");
Array.from(fav_btn).forEach(function(input){upd_fav(input);});
