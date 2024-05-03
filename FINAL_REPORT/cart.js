const products =[
	{'name': 'Bee', 'price': 10, 'habitat': 'sky', 'behavior': 'neutral', 'image_url': './resource/img/Bee_types.webp', 'storage':10, 'amount':99},
	{'name': 'Chicken', 'price': 20, 'habitat': 'land', 'behavior': 'passive', 'image_url': './resource/img/Chicken.webp', 'storage':100},
	{'name': 'Cow', 'price': 50, 'habitat': 'land', 'behavior': 'passive', 'image_url': './resource/img/Cow.webp', 'storage':30},
	{'name': 'Creeper', 'price': 120, 'habitat': 'land', 'behavior': 'hostile', 'image_url': './resource/img/Creeper.webp', 'storage':12},
	{'name': 'Dolphin', 'price': 250, 'habitat': 'ocean', 'behavior': 'neutral', 'image_url': './resource/img/Dolphin.webp', 'storage':10},
	{'name': 'Fox', 'price': 150, 'habitat': 'land', 'behavior': 'neutral', 'image_url': './resource/img/Fox.webp', 'storage':28},
	{'name': 'Guardian', 'price': 600, 'habitat': 'ocean', 'behavior': 'hostile', 'image_url': './resource/img/Guardian.webp', 'storage':3},
	{'name': 'Axolotl', 'price': 200, 'habitat': 'ocean', 'behavior': 'passive', 'image_url': './resource/img/Lucy_Axolotl.webp', 'storage':6},
	{'name': 'Phantom', 'price': 400, 'habitat': 'sky', 'behavior': 'hostile', 'image_url': './resource/img/Phantom.webp', 'storage':4},
	{'name': 'Pig', 'price': 40, 'habitat': 'land', 'behavior': 'passive', 'image_url': './resource/img/Pig.webp', 'storage':65},
	{'name': 'Parrot', 'price': 80, 'habitat': 'sky', 'behavior': 'passive', 'image_url': './resource/img/Red_Parrot.webp', 'storage':30},
	{'name': 'Sheep', 'price': 40, 'habitat': 'land', 'behavior': 'passive', 'image_url': './resource/img/Sheep.webp', 'storage':100},
	{'name': 'Slime', 'price': 100, 'habitat': 'land', 'behavior': 'hostile', 'image_url': './resource/img/Slime.webp', 'storage':32},
	{'name': 'Wolf', 'price': 140, 'habitat': 'land', 'behavior': 'neutral', 'image_url': './resource/img/Wolf.webp', 'storage':91}
	
];

let add_to_cart_btn = document.getElementsByClassName("add_to_cart");

function display_products(products_to_display){
  const tbody = document.querySelector('#products table tbody');
  tbody.innerHTML = '';
  for(let i = 0; i < products_to_display.length; i++){
    let product_info = '';
    product_info += '<tr>';
    product_info += `<td><input type="checkbox" class="checkbox" name="checkbox_${i}"></td>`;
    product_info += `<td><img src='${products_to_display[i].image_url}' alt='${products_to_display[i].name}'></td>`;
    product_info += `<td id="name_${i}">${products_to_display[i].name}</td>`;
    product_info += `<td id="storage_${i}">${products_to_display[i].storage}</td>`;
    product_info += `<td id="singlePrice_${i}">${products_to_display[i].price}</td>`;
    product_info += `<td>
                        <div id="flex">
                            <div class="btn minus" id="min_${i}">
                            <b>-</b>
                            </div>
                            <input class="quantity" name="quantity_${i}" value="1">
                            <div class="btn plus" id="plus_${i}">
                            <b>+</b>
                            </div>
                        </div>
                      </td>`;
	product_info += `<td id="price_${i}">$0</td>`;
    product_info += '</tr>';
    tbody.innerHTML += product_info;
  }
  tbody.innerHTML += `<tr>
  <td colspan="6">total</td>
  <td><p id="totalPrice">$0</p></td>
</tr>`;
}


display_products(products);

// querySelector 可以選擇 class 也可以選擇 id
// 取得所有加減按鈕
const plusBtns = document.querySelectorAll('.btn.plus');
const minusBtns = document.querySelectorAll('.btn.minus');
var checkednum = 0;
var allChecked = false;

// 取得所有數量輸入框和價格元素
const quantityInputs = document.querySelectorAll('.quantity');
const priceElements = document.querySelectorAll('[id^="price_"]');
const storageElements = document.querySelectorAll('[id^="storage_"]');
var checkboxAll = document.querySelector("input[name='checkboxall']");
var checkboxes = document.querySelectorAll("[name^='checkbox_']");
var totalPrice = document.getElementById("totalPrice").innerText.substring(1);
var nameElements = document.querySelectorAll("[id^='name_']");
var checkoutBtn = document.getElementById("checkout_btn");

// 初始化价格
document.addEventListener("DOMContentLoaded", function() {
    quantityInputs.forEach(function(input, index) {
        var quantity = parseInt(input.value);
        calculatePrice(index, quantity);
        updateTotalPrice();
    });
});

// 加按鈕點擊事件
plusBtns.forEach(function(btn, index){
  btn.addEventListener('click', function(){
    let quantity = parseInt(quantityInputs[index].value);
    let storage = parseInt(document.getElementById(`storage_${index}`).textContent);
    if (quantity < storage) {
      quantity++;
      quantityInputs[index].value = quantity;
      calculatePrice(index, quantity);
      updateTotalPrice();
    }
  });
});

// 減按鈕點擊事件
minusBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    let quantity = parseInt(quantityInputs[index].value);
    if (quantity > 1) {
      quantity--;
      quantityInputs[index].value = quantity;
      calculatePrice(index, quantity);
      updateTotalPrice();
    }
  });
});

// 监听数量输入框的blur事件
quantityInputs.forEach(function(input, index) {
    input.addEventListener("blur", function() {
      var currentQuantity = parseInt(input.value);
      var storage = parseInt(document.getElementById("storage_" + index).innerText);
      // 如果输入数量大于库存，则将数量设置为库存数量
      if (currentQuantity > storage) {
        input.value = storage;
      }
      // 如果输入非数字或小于1，则将数量设置为1
      else if (isNaN(currentQuantity) || currentQuantity < 1) {
        input.value = 1;
      }
      calculatePrice(index, currentQuantity);
      updateTotalPrice();
    });
});

// 监听所有checkbox的点击事件
var n;
for (n = 0; n < checkboxes.length; n++) {
    checkboxes[n].onclick = function() {
        for (var m = 0; m < checkboxes.length; m++) {
            if (!checkboxes[m].checked) {
                allChecked = false;
                break;
            }
            else {
                allChecked = true;
            }
        }
        updateTotalPrice();
        checkboxAll.checked = allChecked;
    };
}
                        
// 监听checkbox_all的点击事件
checkboxAll.addEventListener("click", function() {
    allChecked = !allChecked;
    // 如果checkbox_all被选中，则选中所有的checkbox，否则取消选中
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = allChecked;
    });
    updateTotalPrice();
});

// 計算金額
function calculatePrice(index, quantity) {
  let singlePrice = parseInt(document.getElementById(`singlePrice_${index}`).textContent.replace('$', ''));
  let totalPrice = singlePrice * quantity;
  document.getElementById(`price_${index}`).textContent = `$${totalPrice}`;
}

// 更新總金額
function updateTotalPrice() {
    let total = 0;
    for (var k = 0; k < checkboxes.length; k++) {
        // 如果商品的复选框被选中，则计算其价格并加入到总金额中
        if (checkboxes[k].checked) {
            var price = parseInt(priceElements[k].textContent.replace('$', ''));
            total += price;
        }
    }
    document.getElementById('totalPrice').textContent = `$${total}`;
}

// 监听结账按钮的点击事件
checkoutBtn.addEventListener("click", function() {
    var billContent = "";
    var totalBill = 0;
    var n = 0;
    // 遍历所有商品
    for (var i = 0; i < checkboxes.length; i++) {
        // 如果商品的复选框被选中，则将其加入到帐单中
        if (checkboxes[i].checked) {
            n++;
            var quantity = parseInt(quantityInputs[i].value);
            var totalPrice = parseInt(priceElements[i].textContent.replace('$', ''));
            var name = nameElements[i].textContent;
            totalBill += totalPrice;
            billContent += `${name} * ${quantity},\n`;
        }
    }
    // 如果消费总金额为0，则不执行任何操作
    if (totalBill === 0) {
        return;
    }
    else {
        // 弹出帐单
        alert("感謝您的購買，您的您購買的產品如下：\n\n" + billContent + "總計： $" + totalBill + "元");
        checkboxAll.checked = false;
        for (var j = 0; j < checkboxes.length; j++) {
            if (checkboxes[j].checked) {
                checkboxes[j].checked = false;
                // 更新库存数量
                var quantity = parseInt(quantityInputs[j].value);
                var remainingStock = parseInt(storageElements[j].textContent) - quantity;
                storageElements[j].textContent = remainingStock < 0 ? 0 : remainingStock;

                // 如果库存仍有商品，将数量重置为1，否则重置为0
                quantityInputs[j].value = remainingStock > 0 ? 1 : 0;
                var quantity = parseInt(quantityInputs[j].value);
                calculatePrice([j], quantity);
                updateTotalPrice();
            }
        }  
    }
});