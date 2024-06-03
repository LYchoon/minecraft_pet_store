document.addEventListener("DOMContentLoaded", function() {
  // querySelector 可以選擇 class 也可以選擇 id
  var checkednum = 0;
  var allChecked = false;

  const checkboxAll = document.querySelector("input[name='checkboxall']");
  const quantityInputs = document.querySelectorAll('.quantity');
  const storageElements = document.querySelectorAll('[id^="storage_"]');
  const checkboxes = document.querySelectorAll('.checkbox');
  const singlePriceElements = document.querySelectorAll('.singalPrice');
  const priceElements = document.querySelectorAll('.price');
  const checkoutBtn = document.getElementById("checkout_btn");
  const nameElements = document.querySelectorAll("[id^='name_']");
  const deleteButtons = document.querySelectorAll('.delete');

  // 初始化价格
  quantityInputs.forEach(function(input, index) {
      var quantity = parseInt(input.value);
      calculatePrice(index, quantity);
      updateTotalPrice();
  });

  // 监听数量输入框的blur事件
  quantityInputs.forEach(function(input, index) {
    input.addEventListener("blur", function() {
      var currentQuantity = parseInt(input.value);
      let id_index = this.getAttribute('id').split('_')[1];
      let storage = parseInt(document.getElementById(`storage_${index}`).textContent);
      // 如果输入数量大于库存，则将数量设置为库存数量
      if (currentQuantity > storage) {
        input.value = storage;
      }
      // 如果输入非数字或小于1，则将数量设置为1
      else if (isNaN(currentQuantity) || currentQuantity < 1) {
        input.value = 1;
      }
      calculatePrice(index, id_index, currentQuantity);
      updateTotalPrice();
    });
  });
              

  // 計算金額
  function calculatePrice(index, quantity) {
    let singlePrice = parseInt(singlePriceElements[index].textContent.replace('$', ''));
    let totalPrice = singlePrice * parseInt(quantity);
    document.getElementById(priceElements[index].getAttribute('id')).textContent = `$${totalPrice}`;
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

  checkoutBtn.addEventListener("click", function() {
    let billContent = "";
    let totalBill = 0;
    let items = [];

    // 遍历所有商品
    for (let i = 0; i < checkboxes.length; i++) {
        // 如果商品的复选框被选中，则将其加入到帐单中
        if (checkboxes[i].checked) {
            let quantity = parseInt(quantityInputs[i].value);
            let totalPrice = parseInt(priceElements[i].textContent.replace('$', ''));
            let name = nameElements[i].textContent;
            let id = checkboxes[i].closest('tr').dataset.id;
            totalBill += totalPrice;
            billContent += `${name} * ${quantity},\n`;
            items.push({ id: id, quantity: quantity });
        }
    }

    // 如果消费总金额为0，则不执行任何操作
    if (totalBill === 0) {
        return;
    } else {
        // 发送请求到后端处理结账
        fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: items })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 弹出帐单
                alert("感謝您的購買，您的您購買的產品如下：\n\n" + billContent + "總計： $" + totalBill + "元");
                location.reload();  // 重新加載頁面
            } else {
                alert('Error during checkout');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});


  // 监听所有checkbox的点击事件
  checkboxes.forEach((checkbox, index) => {
      checkbox.addEventListener('click', function() {
          let allChecked = Array.from(checkboxes).every(cb => cb.checked);
          checkboxAll.checked = allChecked;
          updateTotalPrice();
      });
  });

  // 监听checkbox_all的点击事件
  checkboxAll.addEventListener("click", function() {
      allChecked = !allChecked;
      // 如果checkbox_all被选中，则选中所有的checkbox，否则取消选中
      checkboxes.forEach(function(checkbox) {
          checkbox.checked = allChecked;
      });
      updateTotalPrice();
  });

  // 加按鈕點擊事件
  document.querySelectorAll('.plus').forEach(function(button, index){
      button.addEventListener('click', function() {
          let iindex = this.getAttribute('id').split('_')[1];
          let quantity = parseInt(quantityInputs[index].value);
          let storage = parseInt(document.getElementById(`storage_${iindex}`).textContent);
          if (quantity < storage) {
            quantity++;
            document.getElementById(`quantity_${iindex}`).value = quantity;
            calculatePrice(index, quantity);
            updateTotalPrice();
          }

          fetch('/api/add_amount', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ id: iindex, add: quantity }),
          })
          .then(response => response.json())
      });
  });

  // 減按鈕點擊事件
  document.querySelectorAll('.minus').forEach(function(button, index){
    button.addEventListener('click', function() {
        let iindex = this.getAttribute('id').split('_')[1];
        let quantity = parseInt(quantityInputs[index].value);
        console.log(quantity);
        if (quantity > 1) {
          quantity--;
          document.getElementById(`quantity_${iindex}`).value = quantity;
          calculatePrice(index, quantity);
          updateTotalPrice();
        }

        fetch('/api/add_amount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: iindex, add: quantity }),
        })
        .then(response => response.json())
    });
  });

  // 刪除按鈕點擊事件
  deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        const row = this.closest('tr');

        fetch('/api/remove_cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: productId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                row.remove();
            } else {
                alert('Failed to remove the item from the cart.');
            }
        })
        .catch(error => console.error('Error:', error));
    });
  });
});
