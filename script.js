document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM completamente carregado e analisado - v10 Ajustes de Texto");

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
    
    const avaliacaoFinalSecao = document.getElementById("avaliacao-final-secao");
    const tituloAvaliacaoFinal = avaliacaoFinalSecao ? avaliacaoFinalSecao.querySelector(".titulo-expansivel") : null;
    const conteudoAvaliacaoFinalDiv = document.getElementById("conteudo-avaliacao-final");
    const setaAvaliacaoFinal = tituloAvaliacaoFinal ? tituloAvaliacaoFinal.querySelector(".seta-expansivel") : null;

    const controlesGlobaisDiv = document.getElementById("controles-globais");
    const salvarDadosGlobalBtn = document.getElementById("salvar-dados-global-btn");

    const modalSalvar = document.getElementById("modal-salvar");
    const modalIrGrupoFamiliarBtn = document.getElementById("modal-ir-grupo-familiar");
    const modalFecharTelaBtn = document.getElementById("modal-fechar-tela");
    const modalCancelarSalvarBtn = document.getElementById("modal-cancelar-salvar");

    const linkLupaExterna = document.getElementById("link-lupa-externa");

    let beneficiarioAtual = null;
    let membroFamiliaAtual = null;
    let protocoloAbertoAtual = null;

    const dadosBeneficiariosCompletos = {
        "12345678900": {
            id: "12345678900",
            nomeCompleto: "João da Silva Sauro",
            matricula: "9876543",
            nomeSocial: "Jô",
            dataNascimento: "10/05/1985",
            plano: "Plano Perfil",
            nc: "",
            grupoFamiliar: [
                { id: "gf1_1", nomeCompleto: "Fran da Silva Sauro", plano: "Plano Perfil", idade: 32, matricula: "GF001", nomeSocial: "Fran", dataNascimento: "15/03/1992", nc: "" },
                { id: "gf1_2", nomeCompleto: "Bob da Silva Sauro", plano: "Plano Perfil", idade: 8, matricula: "GF002", nomeSocial: "Bobinho", dataNascimento: "20/10/2015", nc: "" }
            ]
        },
        "11122233344": {
            id: "11122233344",
            nomeCompleto: "Maria Oliveira Pterodáctilo",
            matricula: "1234567",
            nomeSocial: "Mari",
            dataNascimento: "22/08/1990",
            plano: "Plano Perfil",
            nc: "",
            grupoFamiliar: [
                { id: "gf2_1", nomeCompleto: "Pedro Oliveira Pterodáctilo", plano: "Plano Perfil", idade: 42, matricula: "GF003", nomeSocial: "Pepe", dataNascimento: "01/01/1982", nc: "" }
            ]
        }
    };

    const estruturaProtocolos = {
        "sinais-vitais": { titulo: "SINAIS VITAIS E ANTROPOMÉTRICOS", descricao: null, questoes: [{ id: "q7", titulo: "Valor da pressão arterial (ex: 120/080)", tipo: "text", placeholder: "120/080" }, {id: "q12", titulo: "IMC (índice de massa corpórea)", tipo: "radio", opcoes: ["Abaixo do peso", "Eutrófico", "Sobrepeso", "Obesidade grau I", "Obesidade grau II", "Obesidade grau III"]}] },
        "condicoes-saude": { titulo: "CONDIÇÕES DE SAÚDE DO BENEFICIÁRIO", descricao: null, questoes: [{ id: "q14", titulo: "Possui algumas destas condições de saúde?", tipo: "checkbox", opcoes: ["Ansiedade", "Asma"] }] },
        "phq2": { titulo: "PHQ - 2 Questionário de saúde do paciente", descricao: "Uma pontuação PHQ-2 varia de 0 a 6. Se a pontuação for 3 ou maior, é provável que haja transtorno depressivo maior...", questoes: [{id: "q19", titulo: "Pouco interesse ou prazer em fazer as coisas", tipo: "radio", opcoes:["0 Nenhuma vez", "1 Vários dias", "2 Mais da metade dos dias", "3 Quase todos os dias"]}]},
        "gad2": { titulo: "GAD 2 - Transtorno de ansiedade generalizada", descricao: "Se o paciente obtiver 3 pontos ou mais no GAD-2, deve-se considerar a possibilidade de transtorno de ansiedade generalizada...", questoes: [{id: "q20", titulo: "Sentindo-se nervoso, ansioso ou tenso", tipo: "radio", opcoes:["0 Nenhuma vez", "1 Vários dias", "2 Mais da metade dos dias", "3 Quase todos os dias"]}]},
        "rastreio": { titulo: "RASTREIO", descricao: null, questoes: [{id: "q21", titulo: "Vacinação Completa?", tipo: "radio", opcoes:["Sim", "Não"]}]},
        "resultado-exames": { titulo: "RESULTADO DE EXAMES", descricao: null, questoes: [{id: "q35", titulo: "LDL", tipo: "text"}]},
        "estilo-vida": { titulo: "ESTILO DE VIDA", descricao: null, questoes: [{id: "q45", titulo: "Lida bem com estresse?", tipo: "radio", opcoes:["Quase nunca", "Raramente"]}]}
    };

    const estruturaAvaliacaoFinal = {
        questoes: [
            { id: "af_q1_nivel_complexidade", titulo: "Nível de complexidade", tipo: "radio", opcoes: ["Nível 1", "Nível 2", "Nível 3", "Nível 4", "Nível 5"], afetaNC: true },
            { id: "af_q2_anotacao", titulo: "Anotação", tipo: "textarea" },
            { id: "af_q3_visita_realizada", titulo: "Visita realizada?", tipo: "radio", opcoes:["Sim", "Não"]},
            { 
                id: "af_q4_pendencias", 
                titulo: "Houve pendências?", 
                tipo: "radio", 
                opcoes:["Sim", "Não"], 
                controlaProximo: "af_q5_detalhar_pendencias",
                valorParaExibir: "Sim"
            },
            { 
                id: "af_q5_detalhar_pendencias", 
                titulo: "Detalhar Pendências", 
                tipo: "textarea_condicional", 
                placeholder: "Descreva as pendências...",
                dependeDe: "af_q4_pendencias",
                valorParaExibir: "Sim",
                obrigatorioSeVisivel: true
            }
        ]
    };

    if (linkLupaExterna) {
        linkLupaExterna.addEventListener("click", (event) => {
            event.preventDefault();
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
                li.innerHTML = `<strong>${membro.nomeCompleto}</strong> (Plano: ${membro.plano}, Idade: ${membro.idade}) <button class="ver-protocolo-membro" data-membro-id="${membro.id}">Ver Conteúdo</button>`;
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
                        avaliacaoFinalSecao.style.display = "block";
                        conteudoAvaliacaoFinalDiv.style.display = "none"; // Inicia recolhido
                        if(setaAvaliacaoFinal) setaAvaliacaoFinal.innerHTML = "&#9660;"; // Seta para baixo
                        controlesGlobaisDiv.style.display = "block";
                        gerarMenuProtocolos();
                        gerarConteudoAvaliacaoFinal();
                    }
                });
            });
        } else {
            grupoFamiliarSection.style.display = "none";
        }
    }

    function limparSessoesDeConteudo() {
        menuProtocolosUl.innerHTML = "";
        conteudoAvaliacaoFinalDiv.innerHTML = "";
        conteudoAvaliacaoFinalDiv.style.display = "none";
        if(setaAvaliacaoFinal) setaAvaliacaoFinal.innerHTML = "&#9660;";
        protocoloAbertoAtual = null;
        areaProtocolosSection.style.display = "none";
        avaliacaoFinalSecao.style.display = "none";
        controlesGlobaisDiv.style.display = "none";
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
                avaliacaoFinalSecao.style.display = "block";
                conteudoAvaliacaoFinalDiv.style.display = "none"; // Inicia recolhido
                if(setaAvaliacaoFinal) setaAvaliacaoFinal.innerHTML = "&#9660;"; // Seta para baixo
                controlesGlobaisDiv.style.display = "block";
                gerarMenuProtocolos();
                gerarConteudoAvaliacaoFinal();
            } else {
                alert("CPF não encontrado ou inválido.");
                dadosBeneficiarioSection.style.display = "none";
                grupoFamiliarSection.style.display = "none";
                limparSessoesDeConteudo();
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
                avaliacaoFinalSecao.style.display = "block";
                conteudoAvaliacaoFinalDiv.style.display = "none"; // Inicia recolhido
                if(setaAvaliacaoFinal) setaAvaliacaoFinal.innerHTML = "&#9660;"; // Seta para baixo
                controlesGlobaisDiv.style.display = "block";
                gerarMenuProtocolos();
                gerarConteudoAvaliacaoFinal();
            }
        });
    }

    if (tituloAvaliacaoFinal) {
        tituloAvaliacaoFinal.addEventListener("click", () => {
            const isVisible = conteudoAvaliacaoFinalDiv.style.display === "block";
            conteudoAvaliacaoFinalDiv.style.display = isVisible ? "none" : "block";
            if (setaAvaliacaoFinal) {
                setaAvaliacaoFinal.innerHTML = isVisible ? "&#9660;" : "&#9650;"; // Alterna seta
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
                a.innerHTML = `${protocolo.titulo}`;
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
                    const currentSeta = a.querySelector(".seta-expansivel-protocolo");
                    const isVisible = currentConteudoDiv.style.display === "block";

                    // Fecha todos os outros protocolos
                    menuProtocolosUl.querySelectorAll("li").forEach(item => {
                        const desc = item.querySelector(".descricao-protocolo-item");
                        const cont = item.querySelector(".protocolo-conteudo");
                        const seta = item.querySelector(".seta-expansivel-protocolo");
                        if (desc !== currentDescricaoDiv) desc.style.display = "none";
                        if (cont !== currentConteudoDiv) cont.style.display = "none";
                        if (seta && seta !== currentSeta) seta.innerHTML = "&#9660;";
                    });

                    if (isVisible) {
                        currentDescricaoDiv.style.display = "none";
                        currentConteudoDiv.style.display = "none";
                        if(currentSeta) currentSeta.innerHTML = "&#9660;";
                        protocoloAbertoAtual = null;
                    } else {
                        if (protocolo.descricao) {
                            currentDescricaoDiv.innerHTML = `<p><strong>Descrição:</strong> ${protocolo.descricao}</p>`;
                            currentDescricaoDiv.style.display = "block";
                        } else {
                            currentDescricaoDiv.style.display = "none";
                        }
                        gerarQuestoesHTML(protocolo.questoes, currentConteudoDiv, false);
                        currentConteudoDiv.style.display = "block";
                        if(currentSeta) currentSeta.innerHTML = "&#9650;";
                        protocoloAbertoAtual = protocoloId;
                    }
                });
                menuProtocolosUl.appendChild(li);
            }
        });
    }

    function gerarConteudoAvaliacaoFinal(){
        conteudoAvaliacaoFinalDiv.innerHTML = "";
        gerarQuestoesHTML(estruturaAvaliacaoFinal.questoes, conteudoAvaliacaoFinalDiv, true);
    }
    
    function gerarQuestoesHTML(questoesArray, container, isAvaliacaoFinal = false) {
        let htmlQuestoes = "";
        questoesArray.forEach(q => {
            const questaoItemId = `questao-item-${q.id}`;
            htmlQuestoes += `<div class="questao-item" id="${questaoItemId}" ${q.tipo === 'textarea_condicional' ? 'style="display:none;"' : ''}>`;
            htmlQuestoes += `<label for="${q.id}">${q.titulo} ${q.obrigatorioSeVisivel && q.tipo === 'textarea_condicional' ? '<span class="campo-obrigatorio-asterisco">*</span>' : ''}</label>`;
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
                        htmlQuestoes += `<div class="radio-option"><input type="radio" id="${radioId}" name="${q.id}" value="${opt}" 
                                        ${q.afetaNC ? 'data-afeta-nc="true"' : ''}
                                        ${q.controlaProximo ? `data-controla-proximo="${q.controlaProximo}" data-valor-para-exibir="${q.valorParaExibir}"` : ''}>
                                     <label for="${radioId}">${opt}</label></div>`;
                    });
                    break;
                case "checkbox":
                    q.opcoes.forEach((opt, index) => {
                        const checkId = `${q.id}_${index}`;
                        htmlQuestoes += `<div class="checkbox-option"><input type="checkbox" id="${checkId}" name="${q.id}" value="${opt}"><label for="${checkId}">${opt}</label></div>`;
                    });
                    break;
                case "textarea":
                case "textarea_condicional": // Tratar ambos da mesma forma para o HTML inicial
                    htmlQuestoes += `<textarea id="${q.id}" name="${q.id}" placeholder="${q.placeholder || ''}"></textarea>`;
                    break;
                case "tabela_radio":
                    htmlQuestoes += `<table class="tabela-questoes"><thead><tr><th></th>`;
                    q.opcoes_coluna.forEach(col => htmlQuestoes += `<th>${col}</th>`);
                    htmlQuestoes += `</tr></thead><tbody>`;
                    q.opcoes_linha.forEach((linha, rowIndex) => {
                        htmlQuestoes += `<tr><td>${linha.titulo}</td>`;
                        q.opcoes_coluna.forEach((col, colIndex) => {
                            const radioId = `${q.id}_${rowIndex}_${colIndex}`;
                            htmlQuestoes += `<td><input type="radio" id="${radioId}" name="${q.id}_${rowIndex}" value="${col}"></td>`;
                        });
                        htmlQuestoes += `</tr>`;
                    });
                    htmlQuestoes += `</tbody></table>`;
                    break;
            }
            htmlQuestoes += `</div>`;
        });
        container.innerHTML = htmlQuestoes;

        // Adicionar event listeners para campos que controlam outros ou afetam NC
        questoesArray.forEach(q => {
            if (q.controlaProximo) {
                const radios = container.querySelectorAll(`input[name="${q.id}"]`);
                radios.forEach(radio => {
                    radio.addEventListener("change", (event) => {
                        const campoControlado = container.querySelector(`#questao-item-${q.controlaProximo}`);
                        const inputControlado = container.querySelector(`#${q.controlaProximo}`);
                        if (campoControlado) {
                            if (event.target.value === q.valorParaExibir) {
                                campoControlado.style.display = "block";
                                if(inputControlado && q.obrigatorioSeVisivel) inputControlado.required = true;
                            } else {
                                campoControlado.style.display = "none";
                                if(inputControlado) inputControlado.required = false;
                            }
                        }
                    });
                });
            }
            if (q.afetaNC) {
                const radiosNC = container.querySelectorAll(`input[name="${q.id}"]`);
                radiosNC.forEach(radio => {
                    radio.addEventListener("change", (event) => {
                        ncBeneficiarioSpan.textContent = event.target.value || "-";
                        // Atualizar no objeto de dados também, se necessário para persistência
                        const cpfBenef = membroFamiliaAtual ? dadosBeneficiariosCompletos[beneficiarioAtual].grupoFamiliar.find(m => m.id === membroFamiliaAtual) : dadosBeneficiariosCompletos[beneficiarioAtual];
                        if(cpfBenef) cpfBenef.nc = event.target.value;
                    });
                });
            }
        });
    }

    if (pesquisarProtocoloInput) {
        pesquisarProtocoloInput.addEventListener("input", (e) => {
            gerarMenuProtocolos(e.target.value);
        });
    }

    if (salvarDadosGlobalBtn) {
        salvarDadosGlobalBtn.addEventListener("click", () => {
            let camposObrigatoriosPendentes = false;
            // Validar campos obrigatórios na Avaliação Final, se visível e necessário
            if (conteudoAvaliacaoFinalDiv.style.display === "block") {
                estruturaAvaliacaoFinal.questoes.forEach(q => {
                    if (q.obrigatorioSeVisivel && q.tipo === "textarea_condicional") {
                        const campoTextarea = conteudoAvaliacaoFinalDiv.querySelector(`#${q.id}`);
                        const campoControlador = conteudoAvaliacaoFinalDiv.querySelector(`input[name="${q.dependeDe}"]:checked`);
                        if (campoControlador && campoControlador.value === q.valorParaExibir) {
                            if (!campoTextarea.value.trim()) {
                                camposObrigatoriosPendentes = true;
                                campoTextarea.classList.add("campo-obrigatorio");
                                alert(`O campo "${q.titulo}" é obrigatório.`);
                            } else {
                                campoTextarea.classList.remove("campo-obrigatorio");
                            }
                        }
                    }
                });
            }

            if (camposObrigatoriosPendentes) {
                return; // Interrompe o salvamento se houver pendências
            }

            modalSalvar.style.display = "block";
        });
    }

    if (modalIrGrupoFamiliarBtn) {
        modalIrGrupoFamiliarBtn.addEventListener("click", () => {
            modalSalvar.style.display = "none";
            if (grupoFamiliarSection.style.display !== 'none') {
                grupoFamiliarSection.scrollIntoView({ behavior: 'smooth' });
            } else if (beneficiarioAtual && dadosBeneficiariosCompletos[beneficiarioAtual].grupoFamiliar.length > 0) {
                // Se o grupo familiar não estiver visível mas existir, exibe e rola
                grupoFamiliarSection.style.display = 'block';
                grupoFamiliarSection.scrollIntoView({ behavior: 'smooth' });
            }
            // Se não houver grupo familiar, não faz nada ou poderia dar um feedback
        });
    }

    if (modalFecharTelaBtn) {
        modalFecharTelaBtn.addEventListener("click", () => {
            modalSalvar.style.display = "none";
            alert("Salvo com sucesso!"); // Mensagem de feedback
            // Poderia adicionar lógica para recolher protocolos ou limpar tela, se desejado.
            if (protocoloAbertoAtual) {
                const protocoloLi = menuProtocolosUl.querySelector(`a[data-protocolo="${protocoloAbertoAtual}"]`).closest('li');
                if (protocoloLi) {
                    protocoloLi.querySelector(".descricao-protocolo-item").style.display = "none";
                    protocoloLi.querySelector(".protocolo-conteudo").style.display = "none";
                    const seta = protocoloLi.querySelector(".seta-expansivel-protocolo");
                    if(seta) seta.innerHTML = "&#9660;";
                }
                protocoloAbertoAtual = null;
            }
            if (conteudoAvaliacaoFinalDiv.style.display === "block"){
                conteudoAvaliacaoFinalDiv.style.display = "none";
                if(setaAvaliacaoFinal) setaAvaliacaoFinal.innerHTML = "&#9660;";
            }
        });
    }

    if (modalCancelarSalvarBtn) {
        modalCancelarSalvarBtn.addEventListener("click", () => {
            modalSalvar.style.display = "none";
        });
    }

    // Fechar modal clicando fora
    window.onclick = function(event) {
        if (event.target == modalSalvar) {
            modalSalvar.style.display = "none";
        }
    }

    // Inicialização
    limparSessoesDeConteudo(); // Garante que tudo comece oculto e limpo
});
