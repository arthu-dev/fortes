function logar() {
  var login = document.getElementById("login").value;
  var senha = document.getElementById("senha").value;

  if (login == "cliente@fortes.com.br" && senha == "fortescliente") {
    alert("Sucesso");
    location.href = "index.html";
  } else if (
    login == "fornecedor@fortes.com.br" &&
    senha == "fortesfornecedor"
  ) {
    alert("Sucesso");
    location.href = "tabela.html";
  } else {
    alert("Usuário ou senha incorretos");
  }
}

let tabela_precos = {
  prato_1: 6.8,
  prato_2: 7.25,
  prato_3: 10.3,
  prato_4: 6.8,
  prato_5: 7.25,
  prato_6: 10.3,
};

let dropdownPratos = document.getElementById("select_pratos");
let valor_prato = document.getElementById("valor_prato");
let quantidade = document.getElementById("quantidade");
let valor_total = document.getElementById("valor_total");

dropdownPratos.addEventListener("change", function (e) {

  valor_prato.value = tabela_precos[e.target.value];
  valor_do_prato = tabela_precos[e.target.value];
});

function calcularValor() {
  valor_total.innerText = valor_do_prato * quantidade.value;
}
