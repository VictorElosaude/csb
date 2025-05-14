document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM completamente carregado e analisado - v3 Melhorias com Lupa");

    // Elementos da DOM
    const buscarCpfBtn = document.getElementById("buscar-cpf-btn");
    const cpfInput = document.getElementById("cpf");
    const dadosBeneficiarioSection = document.getElementById("dados-beneficiario");
    const nomeCompletoSpan = document.getElementById("nome-completo");
    const matriculaSpan = document.getElementById("matricula");
    const nomeSocialSpan = document.getElementById("nome-social");
    const dataNascimentoSpan = document.getElementById("data-nascimento");
    const planoBeneficiarioSpan = document.getElementById("plano-beneficiario");
    const ncBeneficiarioSpan = document.getElementById("nc-beneficiario");
    const voltarParaPrincipalBtn = document.getElementById("voltar-para-principal-btn");

    const grupoFamiliarSection = document.getElementById("grupo-familiar");
    const listaGrupoFamiliarDiv = document.getElementById("lista-grupo-familiar");

    const areaProtocolosSection = document.getElementById("area-protocolos");
    const pesquisarProtocoloInput = document.getElementById("pesquisar-protocolo");
    const menuProtocolosUl = document.querySelector("#menu-protocolos ul");
    const salvarDadosGlobalBtn = document.getElementById("salvar-dados-global-btn");

    const modalSalvar = document.getElementById("modal-salvar");
    const modalIrGrupoFamiliarBtn = document.getElementById("modal-ir-grupo-familiar");
    const modalFecharProtocoloBtn = document.getElementById("modal-fechar-protocolo");
    const modalCancelarSalvarBtn = document.getElementById("modal-cancelar-salvar");

    const linkLupaExterna = document.getElementById("link-lupa-externa"); // Novo elemento

    let beneficiarioAtual = null; 
    let membroFamiliaAtual = null; 
    let protocoloAbertoAtual = null; 

    const dadosBeneficiariosCompletos = {
        "12345678900": {
            id: "12345678900",
            nomeCompleto: "João da Silva Sauro (Principal)",
            matricula: "9876543",
            nomeSocial: "Jô",
            dataNascimento: "10/05/1985",
            plano: "Elosau Gold",
            nc: "", 
            grupoFamiliar: [
                { id: "gf1_1", nomeCompleto: "Fran da Silva Sauro", plano: "Elosau Gold", idade: 32, matricula: "GF001", nomeSocial: "Fran", dataNascimento: "15/03/1992", nc: "" },
                { id: "gf1_2", nomeCompleto: "Bob da Silva Sauro", plano: "Elosau Kids", idade: 8, matricula: "GF002", nomeSocial: "Bobinho", dataNascimento: "20/10/2015", nc: "" }
            ]
        },
        "11122233344": {
            id: "11122233344",
            nomeCompleto: "Maria Oliveira Pterodáctilo (Principal)",
            matricula: "1234567",
            nomeSocial: "Mari",
            dataNascimento: "22/08/1990",
            plano: "Elosau Premium",
            nc: "",
            grupoFamiliar: [
                { id: "gf2_1", nomeCompleto: "Pedro Oliveira Pterodáctilo", plano: "Elosau Premium", idade: 42, matricula: "GF003", nomeSocial: "Pepe", dataNascimento: "01/01/1982", nc: "" }
            ]
        }
    };

    const estruturaProtocolos = {
        "sinais-vitais": { titulo: "SINAIS VITAIS E ANTROPOMÉTRICOS", descricao: null, questoes: [{ id: "q7", titulo: "Valor da pressão arterial (ex: 120/080)", tipo: "text", placeholder: "120/080" }, {id: "q12", titulo: "IMC (índice de massa corpórea)", tipo: "radio", opcoes: ["Abaixo do peso", "Eutrófico", "Sobrepeso", "Obesidade grau I", "Obesidade grau II", "Obesidade grau III"]}] },
        "condicoes-saude": { titulo: "CONDIÇÕES DE SAÚDE DO BENEFICIÁRIO", descricao: null, questoes: [{ id: "q14", titulo: "Possui algumas destas condições de saúde?", tipo: "checkbox", opcoes: ["Ansiedade", "Asma"] }] },
        "phq2": { titulo: "PHQ - 2 Questionário de saúde do paciente", descricao: "Descrição PHQ-2...", questoes: [{id: "q19", titulo: "Pouco interesse ou prazer em fazer as coisas", tipo: "radio", opcoes:["0 Nenhuma vez", "1 Vários dias"]}]},
        "gad2": { titulo: "GAD 2 - Transtorno de ansiedade generalizada", descricao: "Descrição GAD-2...", questoes: [{id: "q20", titulo: "Sentindo-se nervoso, ansioso ou tenso", tipo: "radio", opcoes:["0 Nenhuma vez", "1 Vários dias"]}]},
        "rastreio": { titulo: "RASTREIO", descricao: null, questoes: [{id: "q21", titulo: "Vacinação Completa?", tipo: "radio", opcoes:["Sim", "Não"]}]},
        "resultado-exames": { titulo: "RESULTADO DE EXAMES", descricao: null, questoes: [{id: "q35", titulo: "LDL", tipo: "text"}]},
        "estilo-vida": { titulo: "ESTILO DE VIDA", descricao: null, questoes: [{id: "q45", titulo: "Lida bem com estresse?", tipo: "radio", opcoes:["Quase nunca", "Raramente"]}]},
        "avaliacao-final": {
            titulo: "AVALIAÇÃO FINAL", descricao: null, 
            questoes: [
                { id: "q56", titulo: "Nível de complexidade", tipo: "radio", opcoes: ["Nível 1", "Nível 2", "Nível 3", "Nível 4", "Nível 5"], afetaNC: true },
                { id: "q58", titulo: "Anotação", tipo: "textarea" }
            ]
        },
        "status-atendimento": { titulo: "Status do atendimento", descricao: null, questoes: [{id: "q63", titulo: "Visita realizada?", tipo: "radio", opcoes:["Sim", "Não"]}]}
    };

    // Lógica para o ícone de lupa
    if (linkLupaExterna) {
        linkLupaExterna.addEventListener("click", (event) => {
            event.preventDefault(); // Prevenir comportamento padrão do link se houver href="#"
            window.location.href = "https://elosaude.anyconnect.com.br/beneficiario/exames/paciente/22216847968";
        });
    }

    function carregarDadosBeneficiario(beneficiarioData) {
        nomeCompletoSpan.textContent = beneficiarioData.nomeCompleto;
        matriculaSpan.textContent = beneficiarioData.matricula || "N/A";
        nomeSocialSpan.textContent = beneficiarioData.nomeSocial || "N/A";
        dataNascimentoSpan.textContent = beneficiarioData.dataNascimento || "N/A";
        planoBeneficiarioSpan.textContent = beneficiarioData.plano || "N/A";
        ncBeneficiarioSpan.textContent = beneficiarioData.nc || "-"; 
        dadosBeneficiarioSection.style.display = "block";
    }

    function carregarGrupoFamiliar(grupo) {
        listaGrupoFamiliarDiv.innerHTML = "";
        if (grupo && grupo.length > 0) {
            const ul = document.createElement("ul");
            ul.className = "lista-familiares";
            grupo.forEach(membro => {
                const li = document.createElement("li");
                li.innerHTML = `<strong>${membro.nomeCompleto}</strong> (Plano: ${membro.plano}, Idade: ${membro.idade}) <button class="ver-protocolo-membro" data-membro-id="${membro.id}">Ver Protocolos</button>`;
                ul.appendChild(li);
            });
            listaGrupoFamiliarDiv.appendChild(ul);
            grupoFamiliarSection.style.display = "block";

            document.querySelectorAll(".ver-protocolo-membro").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const membroId = e.target.dataset.membroId;
                    const beneficiarioPrincipal = dadosBeneficiariosCompletos[beneficiarioAtual];
                    const membroSelecionado = beneficiarioPrincipal.grupoFamiliar.find(m => m.id === membroId);
                    if (membroSelecionado) {
                        membroFamiliaAtual = membroId;
                        carregarDadosBeneficiario(membroSelecionado);
                        voltarParaPrincipalBtn.style.display = "inline-block";
                        grupoFamiliarSection.style.display = "none"; 
                        areaProtocolosSection.style.display = "block";
                        salvarDadosGlobalBtn.style.display = "block";
                        gerarMenuProtocolos(); 
                    }
                });
            });
        } else {
            grupoFamiliarSection.style.display = "none";
        }
    }

    function limparSessaoProtocolos() {
        menuProtocolosUl.innerHTML = "";
        protocoloAbertoAtual = null;
        salvarDadosGlobalBtn.style.display = "none";
        areaProtocolosSection.style.display = "none";
    }

    if (buscarCpfBtn) {
        buscarCpfBtn.addEventListener("click", () => {
            const cpf = cpfInput.value.replace(/\D/g, "");
            const beneficiarioData = dadosBeneficiariosCompletos[cpf];
            if (beneficiarioData) {
                beneficiarioAtual = cpf;
                membroFamiliaAtual = null; 
                carregarDadosBeneficiario(beneficiarioData);
                carregarGrupoFamiliar(beneficiarioData.grupoFamiliar);
                voltarParaPrincipalBtn.style.display = "none";
                areaProtocolosSection.style.display = "block";
                salvarDadosGlobalBtn.style.display = "block";
                gerarMenuProtocolos();
            } else {
                alert("CPF não encontrado ou inválido.");
                dadosBeneficiarioSection.style.display = "none";
                grupoFamiliarSection.style.display = "none";
                limparSessaoProtocolos();
            }
        });
    }

    if (voltarParaPrincipalBtn) {
        voltarParaPrincipalBtn.addEventListener("click", () => {
            if (beneficiarioAtual) {
                const beneficiarioData = dadosBeneficiariosCompletos[beneficiarioAtual];
                membroFamiliaAtual = null;
                carregarDadosBeneficiario(beneficiarioData);
                carregarGrupoFamiliar(beneficiarioData.grupoFamiliar);
                voltarParaPrincipalBtn.style.display = "none";
                areaProtocolosSection.style.display = "block"; 
                salvarDadosGlobalBtn.style.display = "block";
                gerarMenuProtocolos(); 
            }
        });
    }

    function gerarMenuProtocolos(filtro = "") {
        menuProtocolosUl.innerHTML = "";
        Object.keys(estruturaProtocolos).forEach(protocoloId => {
            const protocolo = estruturaProtocolos[protocoloId];
            if (protocolo.titulo.toLowerCase().includes(filtro.toLowerCase())) {
                const li = document.createElement("li");
                const a = document.createElement("a");
                a.href = "#";
                a.dataset.protocolo = protocoloId;
                a.textContent = protocolo.titulo;
                if (protocolo.descricao) {
                    a.title = protocolo.descricao;
                }
                li.appendChild(a);

                const divDescricao = document.createElement("div");
                divDescricao.className = "descricao-protocolo-item";
                divDescricao.style.display = "none";
                li.appendChild(divDescricao);

                const divConteudo = document.createElement("div");
                divConteudo.className = "protocolo-conteudo";
                divConteudo.style.display = "none";
                li.appendChild(divConteudo);

                a.addEventListener("click", (event) => {
                    event.preventDefault();
                    const currentDescricaoDiv = divDescricao;
                    const currentConteudoDiv = divConteudo;
                    const isVisible = currentConteudoDiv.style.display === "block";

                    menuProtocolosUl.querySelectorAll("li").forEach(item => {
                        const desc = item.querySelector(".descricao-protocolo-item");
                        const cont = item.querySelector(".protocolo-conteudo");
                        if (desc !== currentDescricaoDiv) desc.style.display = "none";
                        if (cont !== currentConteudoDiv) cont.style.display = "none";
                    });

                    if (isVisible) {
                        currentDescricaoDiv.style.display = "none";
                        currentConteudoDiv.style.display = "none";
                        protocoloAbertoAtual = null;
                    } else {
                        if (protocolo.descricao) {
                            currentDescricaoDiv.innerHTML = `<p><strong>Descrição:</strong> ${protocolo.descricao}</p>`;
                            currentDescricaoDiv.style.display = "block";
                        } else {
                            currentDescricaoDiv.style.display = "none";
                        }
                        gerarQuestoesHTML(protocolo, currentConteudoDiv);
                        currentConteudoDiv.style.display = "block";
                        protocoloAbertoAtual = protocoloId;
                    }
                });
                menuProtocolosUl.appendChild(li);
            }
        });
    }
    
    function gerarQuestoesHTML(protocoloData, container) {
        let htmlQuestoes = ""; 
        protocoloData.questoes.forEach(q => {
            htmlQuestoes += `<div class="questao-item">`;
            htmlQuestoes += `<label for="${q.id}">${q.titulo}</label>`;
            switch (q.tipo) {
                case "text":
                    htmlQuestoes += `<input type="text" id="${q.id}" name="${q.id}" placeholder="${q.placeholder || ''}">`;
                    break;
                case "date":
                    htmlQuestoes += `<input type="date" id="${q.id}" name="${q.id}">`;
                    if(q.placeholder) htmlQuestoes += `<small style="display:block; color:#777;">${q.placeholder}</small>`;
                    break;
                case "radio":
                    q.opcoes.forEach((opt, index) => {
                        const radioId = `${q.id}_${index}`;
                        htmlQuestoes += `<div class="radio-option"><input type="radio" id="${radioId}" name="${q.id}" value="${opt}" ${q.afetaNC ? 'data-afeta-nc="true"' : ''}><label for="${radioId}">${opt}</label></div>`;
                    });
                    break;
                case "checkbox":
                case "checkbox_outro":
                    q.opcoes.forEach((opt, index) => {
                        const checkId = `${q.id}_${index}`;
                        htmlQuestoes += `<div class="checkbox-option"><input type="checkbox" id="${checkId}" name="${q.id}[]" value="${opt}"><label for="${checkId}">${opt}</label></div>`;
                    });
                    if (q.tipo === "checkbox_outro") {
                         htmlQuestoes += `<div class="checkbox-option"><label for="${q.id}_outro_text">${q.outro_label || 'Outro:'}</label><input type="text" id="${q.id}_outro_text" name="${q.id}_outro_text"></div>`;
                    }
                    break;
                case "textarea":
                    htmlQuestoes += `<textarea id="${q.id}" name="${q.id}" rows="4"></textarea>`;
                    break;
                case "tabela_radio":
                    htmlQuestoes += `<table class="tabela-questoes"><thead><tr><th></th>`;
                    q.colunas.forEach(col => htmlQuestoes += `<th>${col}</th>`);
                    htmlQuestoes += `</tr></thead><tbody>`;
                    q.linhas.forEach((linha, rowIndex) => {
                        htmlQuestoes += `<tr><td>${linha}</td>`;
                        q.colunas.forEach((col, colIndex) => {
                            const radioId = `${q.id}_r${rowIndex}_c${colIndex}`;
                            htmlQuestoes += `<td><input type="radio" id="${radioId}" name="${q.id}_r${rowIndex}" value="${col}"></td>`;
                        });
                        htmlQuestoes += `</tr>`;
                    });
                    htmlQuestoes += `</tbody></table>`;
                    break;
            }
            htmlQuestoes += `</div>`;
        });
        container.innerHTML = htmlQuestoes;

        if (protocoloData.questoes.some(q => q.afetaNC)) {
            container.querySelectorAll('input[data-afeta-nc="true"]').forEach(inputNC => {
                inputNC.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        const valorNC = e.target.value;
                        ncBeneficiarioSpan.textContent = valorNC;
                        let pessoaParaAtualizarNC = membroFamiliaAtual ? dadosBeneficiariosCompletos[beneficiarioAtual].grupoFamiliar.find(m => m.id === membroFamiliaAtual) : dadosBeneficiariosCompletos[beneficiarioAtual];
                        if(pessoaParaAtualizarNC) pessoaParaAtualizarNC.nc = valorNC;
                    }
                });
            });
        }
    }

    if (pesquisarProtocoloInput) {
        pesquisarProtocoloInput.addEventListener("keyup", (e) => {
            gerarMenuProtocolos(e.target.value);
        });
    }

    if (salvarDadosGlobalBtn) {
        salvarDadosGlobalBtn.addEventListener("click", () => {
            console.log("Dados do protocolo", protocoloAbertoAtual, "seriam salvos aqui.");
            modalSalvar.style.display = "block";
        });
    }

    if (modalIrGrupoFamiliarBtn) {
        modalIrGrupoFamiliarBtn.addEventListener("click", () => {
            modalSalvar.style.display = "none";
            if (beneficiarioAtual) {
                const beneficiarioData = dadosBeneficiariosCompletos[beneficiarioAtual];
                carregarGrupoFamiliar(beneficiarioData.grupoFamiliar);
                grupoFamiliarSection.scrollIntoView({ behavior: 'smooth' });
                limparSessaoProtocolosParcialmente(); 
            }
        });
    }

    if (modalFecharProtocoloBtn) {
        modalFecharProtocoloBtn.addEventListener("click", () => {
            modalSalvar.style.display = "none";
            alert("Salvo com sucesso!");
            limparSessaoProtocolosParcialmente(); 
        });
    }
    if(modalCancelarSalvarBtn) {
        modalCancelarSalvarBtn.addEventListener("click", () => {
            modalSalvar.style.display = "none";
        });
    }

    function limparSessaoProtocolosParcialmente(){
        if(protocoloAbertoAtual){
            const protocoloLi = menuProtocolosUl.querySelector(`a[data-protocolo="${protocoloAbertoAtual}"]`).closest('li');
            if(protocoloLi){
                protocoloLi.querySelector('.protocolo-conteudo').style.display = 'none';
                protocoloLi.querySelector('.descricao-protocolo-item').style.display = 'none';
            }
            protocoloAbertoAtual = null;
        }
    }

});
