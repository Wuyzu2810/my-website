// Tải dữ liệu từ localStorage khi trang được tải lại
document.addEventListener('DOMContentLoaded', function() {
  loadPlayersFromLocalStorage();
});

// Xử lý sự kiện gửi form
document.getElementById('playerForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Ngăn form gửi theo cách truyền thống

  // Lấy giá trị từ form
  const name = document.getElementById('name').value;
  const dob = document.getElementById('dob').value;
  const shirtSize = document.getElementById('shirtSize').value;
  const position = document.getElementById('position').value;
  const number = document.getElementById('number').value;
  const idCardFront = document.getElementById('idCardFront').files[0];
  const idCardBack = document.getElementById('idCardBack').files[0];
  const portrait = document.getElementById('portrait').files[0];

  // Kiểm tra xem đã chọn ảnh chưa
  if (!idCardFront || !idCardBack || !portrait) {
    alert('Vui lòng chọn tất cả các ảnh!');
    return;
  }

  // Tạo URL để hiển thị ảnh
  const idCardFrontURL = URL.createObjectURL(idCardFront);
  const idCardBackURL = URL.createObjectURL(idCardBack);
  const portraitURL = URL.createObjectURL(portrait);

  // Tạo đối tượng cầu thủ
  const player = {
    name, dob, shirtSize, position, number,
    idCardFrontURL, idCardBackURL, portraitURL
  };

  // Lưu cầu thủ vào localStorage
  savePlayerToLocalStorage(player);

  // Thêm cầu thủ vào danh sách hiển thị và bảng
  addPlayerToList(player);
  addPlayerToTable(player);

  // Reset form
  document.getElementById('playerForm').reset();

  // Hiển thị thông báo hoàn thành
  alert('Cập nhật thông tin cầu thủ thành công!');
});

// Hàm lưu cầu thủ vào localStorage
function savePlayerToLocalStorage(player) {
  let players = JSON.parse(localStorage.getItem('players')) || [];
  players.push(player);
  localStorage.setItem('players', JSON.stringify(players));
}

// Hàm tải cầu thủ từ localStorage
function loadPlayersFromLocalStorage() {
  const players = JSON.parse(localStorage.getItem('players')) || [];
  players.forEach(player => {
    addPlayerToList(player);
    addPlayerToTable(player);
  });
}

// Hàm thêm cầu thủ vào danh sách hiển thị
function addPlayerToList(player) {
  const playerCard = document.createElement('div');
  playerCard.classList.add('player-card');
  playerCard.innerHTML = `
    <p>Ảnh chân dung:</p>
    <img src="${player.portraitURL}" alt="Ảnh chân dung" style="max-width: 100%; height: auto;">
    <p><strong>${player.name}</strong></p>
    <p>Ngày sinh: ${player.dob}</p>
    <p>Size áo: ${player.shirtSize}</p>
    <p>Vị trí: ${player.position}</p>
    <p>Số áo: ${player.number}</p>
    <button class="toggle-details">Hiện chi tiết</button>
    <div class="details">
      <img src="${player.idCardFrontURL}" alt="Ảnh căn cước (Mặt trước)">
      <img src="${player.idCardBackURL}" alt="Ảnh căn cước (Mặt sau)">
    </div>
    <button onclick="deletePlayer('${player.name}')">Xóa</button>
  `;

  // Thêm sự kiện toggle cho nút hiện chi tiết
  playerCard.querySelector('.toggle-details').addEventListener('click', function() {
    const details = playerCard.querySelector('.details');
    details.classList.toggle('visible');
    this.textContent = details.classList.contains('visible') ? 'Ẩn chi tiết' : 'Hiện chi tiết';
  });

  document.getElementById('playerList').appendChild(playerCard);
}

// Hàm thêm cầu thủ vào bảng
function addPlayerToTable(player) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td><img src="${player.portraitURL}" alt="Ảnh chân dung" style="max-width: 50px;"></td>
    <td>${player.name}</td>
    <td>${player.dob}</td>
    <td>${player.shirtSize}</td>
    <td>${player.position}</td>
    <td>${player.number}</td>
    <td><img src="${player.idCardFrontURL}" alt="Ảnh căn cước (Mặt trước)" style="max-width: 50px;"></td>
    <td><img src="${player.idCardBackURL}" alt="Ảnh căn cước (Mặt sau)" style="max-width: 50px;"></td>
    <td><button onclick="deletePlayer('${player.name}')">Xóa</button></td>
  `;
  document.querySelector('#playerTable tbody').appendChild(row);
}

// Hàm xóa cầu thủ
function deletePlayer(name) {
  let players = JSON.parse(localStorage.getItem('players')) || [];
  players = players.filter(player => player.name !== name);
  localStorage.setItem('players', JSON.stringify(players));

  // Xóa cầu thủ khỏi danh sách hiển thị và bảng mà không cần tải lại trang
  document.getElementById('playerList').innerHTML = ''; // Xóa danh sách hiển thị
  document.querySelector('#playerTable tbody').innerHTML = ''; // Xóa bảng hiển thị

  // Tải lại dữ liệu từ localStorage để cập nhật danh sách và bảng
  loadPlayersFromLocalStorage();
}
