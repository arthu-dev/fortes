function logar() {
  var login = document.getElementById("login").value;
  var senha = document.getElementById("senha").value;

  if (login == "cliente@fortes.com.br" && senha == "fortescliente") {
    alert("Sucesso");
    location.href = "clientes.html";
  } else if (
    login == "fornecedor@fortes.com.br" &&
    senha == "fortesfornecedor"
  ) {
    alert("Sucesso");
    location.href = "calculo.html";
  } else if (
    login == "funcionario@fortes.com.br" &&
    senha == "fortesfuncionario"
  ) {
    alert("Sucesso");
    location.href = "calendário2.html";
  } else {
    alert("Usuário ou senha incorretos");
  }
}

// esse objeto {} possui chave e valor,sendo "chave": valor.
// a chave é o value de cara option que está no html. através dela a gente encontra o valor
let tabela_precos = {
  prato_1: 6.8,
  prato_2: 7.25,
  prato_3: 10.3,
  prato_4: 6.8,
  prato_5: 7.25,
  prato_6: 10.3,
};

// declara todos os elementos que vamos manipular
let dropdownPratos = document.getElementById("select_pratos");
let valor_prato = document.getElementById("valor_prato");
let quantidade = document.getElementById("quantidade");
let valor_total = document.getElementById("valor_total");

// adiciona um evento "change", para ser disparado
// toda vez que alterar o dropdown
dropdownPratos.addEventListener("change", function (e) {
  // busca na tabela_precos o valor que foi selecionado no dropdown e atribui ao input desabilitado para mostrar na tela
  valor_prato.value = tabela_precos[e.target.value];

  // atribui o valor do prato à variável
  valor_do_prato = tabela_precos[e.target.value];
});

// coloca o valor no texto como sendo valor do prato * a quantidade
function calcularValor() {
  valor_total.innerText = valor_do_prato * quantidade.value;
}
