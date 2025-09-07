// contribuicao.js
// Gerencia contribuições usando localStorage


document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contribuicao-form');
    const cardsContainer = document.getElementById('cards-contribuintes');
    // const btnPdf = document.getElementById('btn-pdf');
    let contribuintes = JSON.parse(localStorage.getItem('contribuintes')) || [];
    const btnWhatsapp = document.getElementById('btn-whatsapp');
    // Compartilhar WhatsApp
    if (btnWhatsapp) {
        btnWhatsapp.addEventListener('click', function () {
            if (!contribuintes.length) {
                alert('Nenhum contribuinte cadastrado para compartilhar.');
                return;
            }
            let texto = '*Relatório de Contribuintes*%0A';
            texto += `Gerado em: ${formatarDataBR(new Date())}%0A%0A`;
            let totalPago = 0;
            contribuintes.forEach((c, idx) => {
                const hoje = new Date();
                const valorRestante = c.valorTotal - c.valorPago;
                const dataPag = new Date(c.dataPagamento);
                let status = 'Em dia';
                if (dataPag < hoje && valorRestante > 0) status = 'Atrasado';
                totalPago += Number(c.valorPago);
                texto += `🟩 *${c.nome}*%0A`;
                texto += `• Finalidade: ${c.finalidade}%0A`;
                texto += `• Pago: R$ ${Number(c.valorPago).toFixed(2)}%0A`;
                texto += `• Restante: R$ ${valorRestante.toFixed(2)}%0A`;
                texto += `• Data: ${formatarDataBR(c.dataPagamento)}%0A`;
                texto += '------------------------------%0A';
            });
            texto += `%0A*Resumo Geral*%0A`;
            texto += `Total Pago: R$ ${totalPago.toFixed(2)}%0A`;
            texto += '%0AEnviado pelo sistema Ministério Elohim';
            const url = `https://wa.me/?text=${texto}`;
            window.open(url, '_blank');
        });
    }

    function formatarDataBR(dataStr) {
        if (!dataStr) return '';
        const d = new Date(dataStr);
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const ano = d.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }

    function criarCardContribuinte(c, idx) {
        const hoje = new Date();
        const valorRestante = c.valorTotal - c.valorPago;
        const dataPag = new Date(c.dataPagamento);
        let status = 'Em dia';
        let badgeClass = 'badge-status';
        if (dataPag < hoje && valorRestante > 0) {
            status = 'Atrasado';
            badgeClass += ' atrasado';
        }
        const valorRestanteHtml = valorRestante > 0
            ? `<span style="color:#d32f2f;font-weight:bold;">R$ ${valorRestante.toFixed(2)}</span>`
            : `<span style="color:#43a047;font-weight:bold;">R$ 0.00</span>`;
        return `
        <div class="card-contribuinte">
            <div class="card-header">
                <span class="card-nome"><i class='fas fa-user'></i> <b>${c.nome}</b></span>
                <span class="status"><span class="${badgeClass}">${status}</span></span>
                <button class="btn-excluir" title="Excluir" data-idx="${idx}" style="background:none;border:none;cursor:pointer;color:#d32f2f;font-size:1.2em;margin-left:0.7em;"><i class="fas fa-trash"></i></button>
            </div>
            <div class="card-body">
                <div><b>Finalidade:</b> ${c.finalidade}</div>
                <div><b>Valor Mensal:</b> R$ ${Number(c.valorMensal).toFixed(2)}</div>
                <div><b>Valor Total:</b> R$ ${Number(c.valorTotal).toFixed(2)}</div>
                <div><b>Valor Pago:</b> R$ ${Number(c.valorPago).toFixed(2)}</div>
                <div><b>Valor Restante:</b> ${valorRestanteHtml}</div>
                <div><b>Data Pagamento:</b> ${formatarDataBR(c.dataPagamento)}</div>
            </div>
        </div>
        `;
    }

    function atualizarCards() {
        cardsContainer.innerHTML = '';
        if (contribuintes.length === 0) {
            cardsContainer.innerHTML = '<p style="text-align:center;color:#888;">Nenhum contribuinte cadastrado.</p>';
            return;
        }
        contribuintes.forEach((c, idx) => {
            cardsContainer.innerHTML += criarCardContribuinte(c, idx);
        });
        // Adicionar evento aos botões de excluir
        document.querySelectorAll('.btn-excluir').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const idx = parseInt(this.getAttribute('data-idx'));
                if (confirm('Deseja realmente excluir este contribuinte?')) {
                    contribuintes.splice(idx, 1);
                    localStorage.setItem('contribuintes', JSON.stringify(contribuintes));
                    atualizarCards();
                }
            });
        });
    }

    // PDF EXPORTAÇÃO removido



    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let nome = form.nome.value;
        if (nome === 'Outro') {
            nome = form['nome-outro'].value.trim();
            if (!nome) {
                alert('Digite o nome do contribuinte!');
                form['nome-outro'].focus();
                return;
            }
        }
        const finalidade = form.finalidade.value;
        const valorMensal = 12;
        const valorTotal = 120;
        const dataPagamento = form.dataPagamento.value;
        const pago = form.pago.checked;
        let valorPago = 0;
        if (pago) valorPago = valorMensal;
        // Verifica se o contribuinte já existe
        const idxExistente = contribuintes.findIndex(c => c.nome.toLowerCase() === nome.toLowerCase());
        if (idxExistente !== -1) {
            // Atualiza o valorPago somando o novo valor
            contribuintes[idxExistente].valorPago += valorPago;
            // Atualiza a data do último pagamento e finalidade, se desejar
            contribuintes[idxExistente].dataPagamento = dataPagamento;
            contribuintes[idxExistente].finalidade = finalidade;
        } else {
            contribuintes.push({ nome, finalidade, valorMensal, valorTotal, valorPago, dataPagamento });
        }

        localStorage.setItem('contribuintes', JSON.stringify(contribuintes));
        atualizarCards();
        form.reset();
        // Garantir que checkbox e campo nome-outro sejam resetados visualmente
        form.pago.checked = false;
        document.getElementById('nome-outro').style.display = 'none';
    });

    atualizarCards();
});
