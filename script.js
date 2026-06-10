function gerarParcelas(desc, valor, parcelas, cartao, dataInicio, ciclo, fixo) {
  let valorParcela = parseFloat((valor / parcelas).toFixed(2));

  let data = new Date(dataInicio);

  for (let i = 1; i <= parcelas; i++) {
    let vencimento = new Date(data);
    vencimento.setMonth(data.getMonth() + (i - 1));

    contas.push({
      id: Date.now() + i,
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
