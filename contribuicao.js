// contribuicao.js
// Gerencia contribuições usando localStorage


document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contribuicao-form');
    const cardsContainer = document.getElementById('cards-contribuintes');
    const btnPdf = document.getElementById('btn-pdf');
    let contribuintes = JSON.parse(localStorage.getItem('contribuintes')) || [];

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

    // PDF EXPORTAÇÃO
    btnPdf.addEventListener('click', function () {
        if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
            alert('Para exportar PDF, inclua a biblioteca jsPDF no HTML.');
            return;
        }
        const doc = new (window.jspdf ? window.jspdf.jsPDF : window.jsPDF)();
        // Cabeçalho
        doc.setFontSize(18);
        doc.setTextColor(40, 40, 40);
        doc.text('Relatório de Contribuintes', 105, 18, { align: 'center' });
        doc.setFontSize(11);
        doc.setTextColor(100, 100, 100);
        doc.text(`Gerado em: ${formatarDataBR(new Date())}`, 200, 12, { align: 'right' });

        // Tabela
        let y = 30;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        // Cabeçalho da tabela
        doc.setFillColor(248, 191, 44);
        doc.rect(10, y, 245, 9, 'F'); // largura aumentada para cobrir todas as colunas
        doc.setTextColor(40, 40, 40);
        // Definir espaçamentos maiores entre colunas
        const col = {
            nome: 14,
            finalidade: 54,
            mensal: 94,
            total: 124,
            pago: 154,
            restante: 184,
            data: 214,
            status: 244
        };
        doc.text('Nome', col.nome, y + 6);
        doc.text('Finalidade', col.finalidade, y + 6);
        doc.text('Mensal', col.mensal, y + 6);
        doc.text('Total', col.total, y + 6);
        doc.text('Pago', col.pago, y + 6);
        doc.text('Restante', col.restante, y + 6);
        doc.text('Data', col.data, y + 6);
        doc.text('Status', col.status, y + 6);
        y += 11;
        contribuintes.forEach((c, idx) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
                doc.setFontSize(12);
                doc.setFillColor(248, 191, 44);
                doc.rect(10, y, 245, 9, 'F'); // largura aumentada para cobrir todas as colunas
                doc.setTextColor(40, 40, 40);
                doc.text('Nome', col.nome, y + 6);
                doc.text('Finalidade', col.finalidade, y + 6);
                doc.text('Mensal', col.mensal, y + 6);
                doc.text('Total', col.total, y + 6);
                doc.text('Pago', col.pago, y + 6);
                doc.text('Restante', col.restante, y + 6);
                doc.text('Data', col.data, y + 6);
                doc.text('Status', col.status, y + 6);
                y += 11;
            }
            const hoje = new Date();
            const valorRestante = c.valorTotal - c.valorPago;
            const dataPag = new Date(c.dataPagamento);
            let status = 'Em dia';
            let statusColor = [67, 160, 71];
            if (dataPag < hoje && valorRestante > 0) {
                status = 'Atrasado';
                statusColor = [211, 47, 47];
            }
            // Linhas alternadas
            if (idx % 2 === 0) {
                doc.setFillColor(255, 251, 231);
                doc.rect(10, y - 1, 190, 9, 'F');
            }
            doc.setTextColor(40, 40, 40);
            doc.text(String(c.nome), col.nome, y + 6);
            doc.text(String(c.finalidade), col.finalidade, y + 6);
            doc.text(`R$ ${Number(c.valorMensal).toFixed(2)}`, col.mensal, y + 6);
            doc.text(`R$ ${Number(c.valorTotal).toFixed(2)}`, col.total, y + 6);
            doc.text(`R$ ${Number(c.valorPago).toFixed(2)}`, col.pago, y + 6);
            // Valor restante colorido
            if (valorRestante > 0) {
                doc.setTextColor(211, 47, 47);
            } else {
                doc.setTextColor(67, 160, 71);
            }
            doc.text(`R$ ${valorRestante.toFixed(2)}`, col.restante, y + 6);
            doc.setTextColor(40, 40, 40);
            doc.text(formatarDataBR(c.dataPagamento), col.data, y + 6);
            // Status badge
            doc.setTextColor(...statusColor);
            doc.text(status, col.status, y + 6);
            y += 10;
        });
        // Rodapé
        doc.setFontSize(10);
        doc.setTextColor(120, 120, 120);
        doc.text('Relatório gerado pelo sistema Ministério Elohim', 105, 290, { align: 'center' });
        doc.save('contribuintes.pdf');
    });



    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const nome = form.nome.value;
        const finalidade = form.finalidade.value;
        const valorMensal = parseFloat(form.valorMensal.value);
        const valorTotal = parseFloat(form.valorTotal.value);
        const dataPagamento = form.dataPagamento.value;
        const valorPago = valorMensal; // Considera o valor mensal como pago no mês do cadastro
        contribuintes.push({ nome, finalidade, valorMensal, valorTotal, valorPago, dataPagamento });

        localStorage.setItem('contribuintes', JSON.stringify(contribuintes));
        atualizarCards();
        form.reset();
    });

    atualizarCards();
});
