const menuItems = document.querySelectorAll('.menu-item');
const cartTableBody = document.querySelector('#cart-table tbody');
const totalPriceElem = document.querySelector('#total-price');

let cart = []; // 장바구니 상태 저장

// 드래그 앤 드롭 이벤트
menuItems.forEach(item => {
  item.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('name', item.dataset.name);
    e.dataTransfer.setData('price', item.dataset.price);
  });
});

document.querySelector('#cart-area').addEventListener('dragover', (e) => e.preventDefault());

document.querySelector('#cart-area').addEventListener('drop', (e) => {
  const name = e.dataTransfer.getData('name');
  const price = parseInt(e.dataTransfer.getData('price'));

  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity++;
    existingItem.subtotal += price;
  } else {
    cart.push({ name, price, quantity: 1, subtotal: price });
  }

  updateCart();
});

function updateCart() {
  cartTableBody.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    total += item.subtotal;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.price}원</td>
      <td>
        <button class="decrease">-</button>
        ${item.quantity}
        <button class="increase">+</button>
      </td>
      <td>${item.subtotal}원</td>
      <td><button class="delete">삭제</button></td>
    `;

    row.querySelector('.decrease').addEventListener('click', () => {
      if (item.quantity > 1) {
        item.quantity--;
        item.subtotal -= item.price;
        updateCart();
      }
    });

    row.querySelector('.increase').addEventListener('click', () => {
      item.quantity++;
      item.subtotal += item.price;
      updateCart();
    });

    row.querySelector('.delete').addEventListener('click', () => {
      cart = cart.filter(cartItem => cartItem.name !== item.name);
      updateCart();
    });

    cartTableBody.appendChild(row);
  });

  totalPriceElem.textContent = total;
}

document.querySelector('#checkout-btn').addEventListener('click', () => {
  const receiptContent = cart.map(item => `${item.name} x ${item.quantity} = ${item.subtotal}원`).join('<br>');
  document.querySelector('#receipt-content').innerHTML = receiptContent + `<br><strong>총 금액: ${totalPriceElem.textContent}원</strong>`;
  document.querySelector('#receipt-modal').style.display = 'block';
  cart = [];
  updateCart();
});

document.querySelector('#close-receipt').addEventListener('click', () => {
  document.querySelector('#receipt-modal').style.display = 'none';
});
