let contas = JSON.parse(localStorage.getItem("contas")) || [];

const form = document.getElementById("form");
const lista1 = document.getElementById("lista1");
const lista15 = document.getElementById("lista15");

const total1 = document.getElementById("total1");
const total15 = document.getElementById("total15");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const descricao = document.getElementById("descricao").value;
  const valor = parseFloat(document.getElementById("valor").value);
  const parcelas = parseInt(document.getElementById("parcelas").value);
  const cartao = document.getElementById("cartao").value;
  const data = document.getElementById("data").value;
  const vencimento = parseInt(document.getElementById("vencimento").value);

  gerarParcelas(descricao, valor, parcelas, cartao, data, vencimento);

  salvar();
  render();
});

function gerarParcelas(desc, valor, parcelas, cartao, dataInicio, vencDia) {
  const valorParcela = (valor / parcelas).toFixed(2);

  let data = new Date(dataInicio);

  for (let i = 1; i <= parcelas; i++) {
    let vencimento = new Date(data);

    vencimento.setMonth(data.getMonth() + i);
    vencimento.setDate(vencDia);

    const ciclo = definirCiclo(vencimento);

    contas.push({
      id: Date.now() + i,
      descricao: desc,
      valor: parseFloat(valorParcela),
      parcela: `${i}/${parcelas}`,
      cartao: cartao,
      vencimento: vencimento.toISOString().split("T")[0],
      ciclo: ciclo,
      pago: false
    });
  }
}

function definirCiclo(data) {
  const dia = new Date(data).getDate();
  return dia <= 14 ? "1" : "15";
}

function salvar() {
  localStorage.setItem("contas", JSON.stringify(contas));
}

function render() {
  lista1.innerHTML = "";
  lista15.innerHTML = "";

  let soma1 = 0;
  let soma15 = 0;

  contas.forEach(c => {
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${c.descricao}</strong><br>
      R$ ${c.valor} | ${c.parcela}<br>
      ${c.cartao} - ${c.vencimento}<br>

      <button onclick="toggle(${c.id})">
        ${c.pago ? "✅ Pago" : "💸 Pagar"}
      </button>

      <button onclick="remover(${c.id})">❌</button>
    `;

    if (c.ciclo === "1") {
      lista1.appendChild(li);
      if (!c.pago) soma1 += c.valor;
    } else {
      lista15.appendChild(li);
      if (!c.pago) soma15 += c.valor;
    }
  });

  total1.innerText = "Total a pagar: R$ " + soma1.toFixed(2);
  total15.innerText = "Total a pagar: R$ " + soma15.toFixed(2);
}

function toggle(id) {
  contas = contas.map(c =>
    c.id === id ? { ...c, pago: !c.pago } : c
  );
  salvar();
  render();
}

function remover(id) {
  contas = contas.filter(c => c.id !== id);
  salvar();
  render();
}

render();
