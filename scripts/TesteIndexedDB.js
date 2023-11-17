const indexedDB =
window.indexedDB ||
window.mozIndexedDB ||
window.webkitIndexedDB ||
window.msIndexedDB ||
window.shimIndexedDB;

let request = indexedDB.open('Meu_DB', 1);
let db;

request.onerror = function (event) {
console.log('Erro ao abrir o banco de dados:', event.target.errorCode);
};

request.onupgradeneeded = function (event) {
db = event.target.result;

let objectStore = db.createObjectStore('Refeicoes', { keyPath: 'id', autoIncrement: true });

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
  fetch('json/dados.json') 
  .then(response => response.json())
  .then(data => {
    console.log(data);
    let transaction = db.transaction(['Refeicoes'], 'readwrite');
    let objectStore = transaction.objectStore('Refeicoes');

    data.forEach(item => {
      let request = objectStore.add(item);
      request.onsuccess = function (event) {
        console.log('Dados adicionados com sucesso!');
      };

      request.onerror = function (event) {
        console.log('Erro ao adicionar dados:', event.target.errorCode);
      };
    });
  })
  .catch(error => {
    console.log('Erro ao buscar o arquivo JSON:', error);
  });
}

function deletarDados(){

let transaction = db.transaction(['Refeicoes'], 'readwrite');
let objectStore = transaction.objectStore('Refeicoes');

let request = objectStore.clear();

request.onsuccess = function(event) {
  console.log('Todos os registros foram apagados com sucesso!');
};

request.onerror = function(event) {
  console.log('Erro ao apagar os registros:', event.target.errorCode);
};
}
function buscarDadosData(dataBusca) {
let transaction = db.transaction(['Refeicoes'], 'readonly');
let objectStore = transaction.objectStore('Refeicoes');

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