const indexedDB =
window.indexedDB ||
window.mozIndexedDB ||
window.webkitIndexedDB ||
window.msIndexedDB ||
window.shimIndexedDB;

let request = indexedDB.open('MeuDB', 1);
let db;

request.onerror = function (event) {
console.log('Erro ao abrir o banco de dados:', event.target.errorCode);
};

request.onupgradeneeded = function (event) {
db = event.target.result;

let objectStore = db.createObjectStore('ExemploTable', { keyPath: 'id', autoIncrement: true });

objectStore.createIndex('data', 'data', { unique: false });
objectStore.createIndex('refeicao', 'refeicao', { unique: false });
objectStore.createIndex('pratoDoDia', 'pratoDoDia', { unique: false });
objectStore.createIndex('totalFeito', 'totalFeito', { unique: false });
objectStore.createIndex('totalConsumindo', 'totalConsumindo', { unique: false });
objectStore.createIndex('totalDesperdicado', 'totalDesperdicado', { unique: false });
objectStore.createIndex('valorTotal', 'valorTotal', { unique: false });
objectStore.createIndex('precoUnitario', 'precoUnitario', { unique: false });

console.log('Banco de dados criado com sucesso!');
};

request.onsuccess = function (event) {
db = event.target.result;
console.log('Conexão bem-sucedida com o banco de dados');
};
function adicionarDados() {
let transaction = db.transaction(['ExemploTable'], 'readwrite');
let objectStore = transaction.objectStore('ExemploTable');
let dados = {
  id: 6,
  data: "2023-11-17",
  refeicao: 'Janta3',
  pratoDoDia: 'Tapioca (frango com catupiry/ presunto, queijo e orégano/tomate e cebola) e salada de frutas',
  totalFeito: 300,
  totalConsumindo: 214,
  totalDesperdicado: 86,
  valorTotal: 2040.00,
  precoUnitario: 6.80
};

let request = objectStore.add(dados);

request.onsuccess = function (event) {
  console.log('Dados adicionados com sucesso!');
};

request.onerror = function (event) {
  console.log('Erro ao adicionar dados:', event.target.errorCode);
};
}
function buscarDadosData(dataBusca) {
let transaction = db.transaction(['ExemploTable'], 'readonly');
let objectStore = transaction.objectStore('ExemploTable');

if (!objectStore.indexNames.contains('data')) {
  objectStore.createIndex('data', 'data');
}

let dataIndex = objectStore.index('data');
let range = IDBKeyRange.only(dataBusca);
let request = dataIndex.openCursor(range);
const tabela = document.getElementById('dados');
tabela.innerHTML = '';

request.onsuccess = function (event) {
  let cursor = event.target.result;
  if (cursor) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${cursor.value.refeicao}</td>
      <td>${cursor.value.pratoDoDia}</td>
      <td>${cursor.value.totalFeito}</td>
      <td>${cursor.value.totalConsumindo}</td>
      <td>${cursor.value.totalDesperdicado}</td>
      <td>R$${cursor.value.valorTotal}</td>
      <td>R$${cursor.value.precoUnitario}</td>
    `;
    tabela.appendChild(row);
    cursor.continue();
  } else {
    console.log('Busca concluída.');
  }
};

request.onerror = function (event) {
  console.log('Erro na busca:', event.target.errorCode);
};
}



const inputDate = document.getElementById('dataSelecionada');

inputDate.addEventListener('change', function () {
const dataSelecionada = inputDate.value;
buscarDadosData(dataSelecionada);
});