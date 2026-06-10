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
  const ciclo = document.getElementById("ciclo").value;
  const fixo = document.getElementById("fixo").checked;

  gerarParcelas(descricao, valor, parcelas, cartao, data, ciclo, fixo);

  salvar();
  render();
  form.reset();
});

function gerarParcelas(desc, valor, parcelas, cartao, dataInicio, ciclo, fixo) {
  let valorParcela = parseFloat((valor / parcelas).toFixed(2));
  let data = new Date(dataInicio);

  for (let i = 1; i <= parcelas; i++) {
    let vencimento = new Date(data);
    vencimento.setMonth(data.getMonth() + (i - 1));

    contas.push({
      id: Date.now() + Math.random(),
      descricao: desc,
      valor: valorParcela,
      parcela: `${i}/${parcelas}`,
      cartao,
      vencimento: vencimento.toISOString().split("T")[0],
      ciclo,
      pago: false,
      fixo
    });
  }
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
      R$ ${c.valor.toFixed(2)} (${c.parcela})<br>
      ${c.cartao} - ${c.vencimento}<br>

      <button onclick="toggle('${c.id}')">
        ${c.pago ? "✅ Pago" : "💸 Pagar"}
      </button>

      <button onclick="editar('${c.id}')">✏️</button>
      <button onclick="remover('${c.id}')">❌</button>
    `;

    if (c.ciclo === "1") {
      lista1.appendChild(li);
      if (!c.pago) soma1 += c.valor;
    } else {
      lista15.appendChild(li);
      if (!c.pago) soma15 += c.valor;
    }
  });

  total1.innerText = "Total: R$ " + soma1.toFixed(2);
  total15.innerText = "Total: R$ " + soma15.toFixed(2);
}

function toggle(id) {
  contas = contas.map(c =>
    c.id == id ? { ...c, pago: !c.pago } : c
  );
  salvar();
  render();
}

function remover(id) {
  contas = contas.filter(c => c.id != id);
  salvar();
  render();
}

function editar(id) {
  const novo = prompt("Novo valor:");

  if (!novo) return;

  contas = contas.map(c =>
    c.id == id
      ? { ...c, valor: parseFloat(parseFloat(novo).toFixed(2)) }
      : c
  );

  salvar();
  render();
}

function gerarFixasMesAtual() {
  const hoje = new Date();
  const mesAtual = hoje.getMonth();

  const fixas = contas.filter(c => c.fixo);

  fixas.forEach(f => {
    const data = new Date(f.vencimento);

    if (data.getMonth() !== mesAtual) {
      let novaData = new Date();
      novaData.setDate(data.getDate());

      contas.push({
        ...f,
        id: Date.now() + Math.random(),
        vencimento: novaData.toISOString().split("T")[0],
        pago: false
      });
    }
  });

  salvar();
}

gerarFixasMesAtual();
render();
