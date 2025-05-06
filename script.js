document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM completamente carregado e analisado - v2");

    const buscarCpfBtn = document.getElementById("buscar-cpf-btn");
    const cpfInput = document.getElementById("cpf");
    const dadosBeneficiarioSection = document.getElementById("dados-beneficiario");
    const menuProtocolosNav = document.getElementById("menu-protocolos");
    // A seção de questões agora será o próprio item do menu que expande
    // const questoesProtocoloSection = document.getElementById("questoes-protocolo"); 

    const dadosFicticios = {
        "12345678900": {
            nomeCompleto: "João da Silva Sauro",
            matricula: "9876543",
            nomeSocial: "Jô",
            dataNascimento: "10/05/1985"
        },
        "11122233344": {
            nomeCompleto: "Maria Oliveira Pterodáctilo",
            matricula: "1234567",
            nomeSocial: "Mari",
            dataNascimento: "22/08/1990"
        }
    };

    if (buscarCpfBtn) {
        buscarCpfBtn.addEventListener("click", () => {
            const cpf = cpfInput.value.replace(/\D/g, "");
            if (dadosFicticios[cpf]) {
                const beneficiario = dadosFicticios[cpf];
                document.getElementById("nome-completo").textContent = beneficiario.nomeCompleto;
                document.getElementById("matricula").textContent = beneficiario.matricula;
                document.getElementById("nome-social").textContent = beneficiario.nomeSocial;
                document.getElementById("data-nascimento").textContent = beneficiario.dataNascimento;

                dadosBeneficiarioSection.style.display = "block";
                menuProtocolosNav.style.display = "block";
                // Limpar qualquer protocolo aberto anteriormente
                document.querySelectorAll(".protocolo-conteudo").forEach(div => {
                    div.style.display = "none";
                    div.innerHTML = "";
                });
                document.querySelectorAll(".descricao-protocolo-item").forEach(div => {
                    div.style.display = "none";
                    div.innerHTML = "";
                });
            } else {
                alert("CPF não encontrado ou inválido.");
                dadosBeneficiarioSection.style.display = "none";
                menuProtocolosNav.style.display = "none";
            }
        });
    }

    // Estrutura de dados para as questões (baseado no mapeamento_questoes.md)
    const estruturaProtocolos = {
        "sinais-vitais": {
            titulo: "SINAIS VITAIS E ANTROPOMÉTRICOS",
            descricao: null,
            questoes: [
                { id: "q7", titulo: "Valor da pressão arterial (ex: 120/080)", tipo: "text", placeholder: "120/080" },
                { id: "q8", titulo: "Saturação (ex: 98)", tipo: "text", placeholder: "98" },
                { id: "q9", titulo: "Glicemia capilar", tipo: "text" },
                { id: "q10", titulo: "Altura (ex: 1,68)", tipo: "text", placeholder: "1,68" },
                { id: "q11", titulo: "Peso (ex: 68,5)", tipo: "text", placeholder: "68,5" },
                {
                    id: "q12", titulo: "IMC (índice de massa corpórea)", tipo: "radio",
                    opcoes: ["Abaixo do peso", "Eutrófico", "Sobrepeso", "Obesidade grau I", "Obesidade grau II", "Obesidade grau III"]
                },
                { id: "q13", titulo: "Circunferência abdominal (ex: 85)", tipo: "text", placeholder: "85" }
            ]
        },
        "condicoes-saude": {
            titulo: "CONDIÇÕES DE SAÚDE DO BENEFICIÁRIO",
            descricao: null,
            questoes: [
                {
                    id: "q14", titulo: "Possui algumas destas condições de saúde?", tipo: "checkbox",
                    opcoes: ["Ansiedade", "Asma", "Cardiopatia", "Depressão", "Diabetes", "Dislipidemia", "Doença osteomuscular", "Doenças do sistema nevorso", "DPOC Doença Pulmonar Obstrutiva Crônica", "DRC Doença renal crônica", "Gravidez", "Hipertensão arterial sistêmica", "Neoplasia - em tratamento", "Neoplasia - Recidiva", "Neoplasia - Remissão", "Obesidade", "Outro"]
                },
                {
                    id: "q15", titulo: "Se sim para neoplasia, qual o tratamento atual?", tipo: "checkbox",
                    opcoes: ["Cirúrgico", "Medicamentoso", "Paliativo", "Práticas Integrativas e complementares em Saúde: Ex. Aromaterapia, ayurveda, hipnoterapia, homeopatia, reiky, meditação, osteopatia, ozonioterapia, plantas medicinais, quiropraxia, yoga", "Quimioterapia", "Radioterapia", "Não adesão ao tratamento convencional"]
                },
                {
                    id: "q16", titulo: "Se automedica? Se sim, com qual desses?", tipo: "checkbox",
                    opcoes: ["Não", "Analgésico e anti-inflamatórios (dipirona, paracetamol, diclofenaco, ibuprofeno)", "Ansiolítico (Ex. clonazepam, diazepam)", "Antidepressivo (Ex. Amitriptilina, fluoxetina, sertralina, ácido valpróico ou valproato de sódio, carbamazepina)", "Anti - hipertensivos (Ex.Captopril, losartana, hidroclorotiazida)", "Outros"]
                },
                {
                    id: "q17", titulo: "Presença de lesão em tecido cutâneo", tipo: "radio",
                    opcoes: ["Ausente e sem fatores de risco", "Ausente e com fatores de risco", "Presente"]
                },
                {
                    id: "q18", titulo: "Atividades de vida diária instrumentais AVDIs (Escala de Lawton e Brody)", tipo: "radio",
                    opcoes: ["Sai de casa sem ajuda para realizar atividades sociais e controlar as finanças", "Necessita de ajuda para sair de casa e para realizar as atividades sociais e controlar as finanças", "Não sai de casa, mas realiza as tarefas de casa sem ajuda/ou controla suas finanças", "Não tem nenhuma autonomia"]
                }
            ]
        },
        "phq2": {
            titulo: "PHQ - 2 Questionário de saúde do paciente (Rastreamento de depressão)",
            descricao: "Uma pontuação PHQ-2 varia de 0 a 6. Se a pontuação for 3 ou maior, é provável que haja transtorno depressivo maior. Pacientes com resultado positivo no teste devem ser avaliados posteriormente com o PHQ-9, outros instrumentos de diagnóstico ou entrevista direta para determinar se atendem aos critérios para um transtorno depressivo.",
            questoes: [
                {
                    id: "q19", titulo: "Nas últimas 2 semanas , com que frequência você foi incomodado pelos seguintes problemas?", tipo: "tabela_radio",
                    linhas: ["Pouco interesse ou prazer em fazer as coisas", "Sentindo-se triste, deprimido ou sem esperança"],
                    colunas: ["0 Nenhuma vez", "1 Vários dias", "2 Mais da metade dos dias", "3 Quase todos os dias"]
                }
            ]
        },
        "gad2": {
            titulo: "GAD 2 - Transtorno de ansiedade generalizada (Rastreamento de ansiedade)",
            descricao: "Uma pontuação de 3 pontos é o ponto de corte para identificar possíveis casos e nos quais uma avaliação diagnóstica adicional para transtorno de ansiedade generalizada é necessária",
            questoes: [
                 {
                    id: "q20", titulo: "Nas últimas 2 semanas com que frequência você ficou incomodado com esses sintomas?", tipo: "tabela_radio",
                    linhas: ["1.Sentindo-se nervoso, ansioso ou tenso", "2. Não ser capaz de parar ou controlar a preocupação"],
                    colunas: ["0 Nenhuma vez", "1 Vários dias", "2 Mais da metade dos dias", "3 Quase todos os dias"]
                }
            ]
        },
        "rastreio": {
            titulo: "RASTREIO",
            descricao: null,
            questoes: [
                { id: "q21", titulo: "Vacinação (Hepatite B: 3 doses, tríplice viral, febre amarela, influenza, pneumocócicas)", tipo: "radio", opcoes: ["Completa", "Incompleta", "Não informada"] },
                { id: "q22", titulo: "Exame clínico dos pés", tipo: "radio", opcoes: ["Sensibilidade preservada", "Sensibilidade alterada", "Não realizado", "Não se aplica"] },
                { id: "q23", titulo: "Risco de polifarmácia (Uso de 4 ou mais medicamentos de forma concomitante, segundo Organização Mundial de Saúde (OMS)", tipo: "radio", opcoes: ["> 4 medicamentos", "< 4 medicamentos"] },
                { id: "q24", titulo: "Risco cardiovascular (App Hearts: Utiliza tabela de risco publicada pela OMS)", tipo: "checkbox", opcoes: ["Baixo (< 5%)", "Moderado (5% e 10%)", "Alto (10% a 20%)", "Muito alto 20% a < 30%", "Crítico ≥ 30%"] },
                { id: "q25", titulo: "Sorologia realizada no último ano (RAST)", tipo: "radio", opcoes: ["Normal", "Alterado", "Alterado em acompanhamento", "Aguardando resultado", "Não realizado"] },
                { id: "q26", titulo: "Data do último exame de sorologia", tipo: "date", placeholder: "Exemplo: 7 de janeiro de 2019" },
                { id: "q27", titulo: "Laudo citopatológico (mulheres de 25 a 64 anos, sendo Ministério da Saúde)", tipo: "radio", opcoes: ["Normal", "Alterado", "Alterado em acompanhamento", "Aguardando resultado", "Não realizado", "Não se aplica"] },
                { id: "q28", titulo: "Data do último exame citopatológico", tipo: "date", placeholder: "Exemplo: 7 de janeiro de 2019" },
                { id: "q29", titulo: "Laudo da mamografia (Mulheres sem fatores de risco com idade de 50 a 69 anos a precisam realizar a mamografia a cada 2 anos, segundo Ministério da Saúde)", tipo: "radio", opcoes: ["Normal (Bi-Rads 1, 2 e 3)", "Alterado e/ou Inconclusivo (Bi-Rads 0 ou > Bi-Rads 4)", "Aguardando resultado", "Não realizado", "Não se aplica"] },
                { id: "q30", titulo: "Data da última mamografia", tipo: "date", placeholder: "Exemplo: 7 de janeiro de 2019" },
                { id: "q31", titulo: "Pesquisa de sangue oculto nas fezes", tipo: "radio", opcoes: ["Normal", "Alterado", "Aguadando resultado", "Não realizado", "Não se aplica"] },
                { id: "q32", titulo: "Data da última pesquisa de sangue oculto nas fezes.", tipo: "date", placeholder: "Exemplo: 7 de janeiro de 2019" },
                { id: "q33", titulo: "Exame de colonoscopia (RAST) de 50 a 75 anos de idade e repetir a cada 10 anos (Segundo recomendação do Ministério da Saúde).", tipo: "radio", opcoes: ["Normal", "Alterado", "Alterado - Pólipos", "Aguardando resultado", "Não realizado", "Não se aplica"] },
                { id: "q34", titulo: "Data da última colonoscopia", tipo: "date", placeholder: "Exemplo: 7 de janeiro de 2019" }
            ]
        },
        "resultado-exames": {
            titulo: "RESULTADO DE EXAMES",
            descricao: null,
            questoes: [
                { id: "q35", titulo: "LDL", tipo: "text" },
                { id: "q36", titulo: "HDL", tipo: "text" },
                { id: "q37", titulo: "Colesterol total", tipo: "text" },
                { id: "q38", titulo: "Função renal (Filtração Glomerular Estimada)", tipo: "radio", opcoes: ["Normal (TFG ≥ a 90)", "Reduzida (TFG entre 60-89)", "Doença Renal Crônica (TFG < 60 por pelo menos 3 meses)", "Aguardando resultado", "Não realizado", "Não se aplica"] },
                { id: "q39", titulo: "Creatinina", tipo: "radio", opcoes: ["Normal ( Homens 0,6 a 1,2 / Mulheres 0,5 -1,1)", "Alterado > 1,2 para homens e > 1,1 para mulheres", "Aguardando resultado", "Não realizou"] },
                { id: "q40", titulo: "Dosagem de Albuminúria nos últimos 12 meses", tipo: "radio", opcoes: ["Normal (<30MG/G)", "Alterado (>30 MG/G)", "Aguardando resultado", "Não realizado", "Não se aplica"] },
                { id: "q41", titulo: "Exame de fundo de olho realizado no último ano", tipo: "radio", opcoes: ["Sim, normal", "Sim, alterado", "Não realizado", "Não se aplica"] },
                { id: "q42", titulo: "Data dos exames laboratoriais", tipo: "date", placeholder: "Exemplo: 7 de janeiro de 2019" },
                { id: "q43", titulo: "Hemoglobina glicada (HbA1c)", tipo: "text" },
                { id: "q44", titulo: "Data do exame HbA1c", tipo: "date", placeholder: "Exemplo: 7 de janeiro de 2019" }
            ]
        },
        "estilo-vida": {
            titulo: "ESTILO DE VIDA",
            descricao: null,
            questoes: [
                { id: "q45", titulo: "Consegue lidar bem com o estresse do dia a dia?", tipo: "radio", opcoes: ["Quase nunca", "Raramente", "Algumas vezes", "Com relativa frequência", "Quase sempre"] },
                { id: "q46", titulo: "Você consome alimentos ricos em fibras, como grãos integrais, legumes e leguminosas?", tipo: "radio", opcoes: ["Sempre", "Frequentemente", "Às vezes", "Raramente"] },
                { id: "q47", titulo: "Com que frequência você consome alimentos processados ou ultraprocessados (fast food, alimentos prontos, etc.)?", tipo: "radio", opcoes: ["Diariamente", "Algumas vezes por semana", "Raramente", "Nunca"] },
                { id: "q48", titulo: "Você costuma beber água ao longo do dia? Quantos copos você consome, em média?", tipo: "radio", opcoes: ["Menos de 2 copos", "Entre 2 e 4 copos", "Entre 5 e 8 copos", "Mais de 8 copos"] },
                { id: "q49", titulo: "Atividade física", tipo: "checkbox", opcoes: ["Intensidade leve", "Intensidade moderada", "Intensidade vigorosa", "< 75min por semana", "75min a 150min por semana", "> 150min por semana", "Não pratica atividade física"] },
                { id: "q50", titulo: "Bebida alcoólica na mesma ocasião no último mês", tipo: "radio", opcoes: ["Ingestão de 1-3 doses na mesma ocasião", "Ingestão de mais de 4 doses na mesma ocasião", "Diariamente", "Nunca"] },
                { id: "q51", titulo: "Sono - Consegue dormir bem e sentir-se descansado?", tipo: "radio", opcoes: ["Quase nunca", "Raramente", "Algumas vezes", "Com relativa freqüência", "Sono induzido por medicação"] },
                { id: "q52", titulo: "É fumante", tipo: "radio", opcoes: ["Fumante atual", "Fumante em tratamento", "Ex - fumante", "Não fumante", "Fumante passiva"] },
                { id: "q53", titulo: "Em geral você diria que sua saúde é", tipo: "radio", opcoes: ["Excelente", "Muito boa", "Boa", "Ruim", "Muito ruim"] }
            ]
        },
        "avaliacao-final": {
            titulo: "AVALIAÇÃO FINAL",
            descricao: null,
            questoes: [
                { id: "q54", titulo: "Estágio Motivacional", tipo: "radio", opcoes: ["1. Pré-contemplação: é um estágio em que não há intenção de mudança nem mesmo uma crítica a respeito do conflito envolvendo o comportamento-problema", "2. Contemplação: caracterizada pela conscientização de que existe um problema, no entanto há uma ambivalência quanto à perspectiva de mudança", "3. Planejamento ou preparação: O indivíduo já tem uma visão mais clara e precisa sobre seu problema e começa a pensar em possíveis ações que podem ajudá-lo a se recuperar e superar suas limitações.", "4. Ação: se dá quando o beneficiário escolhe uma estratégia para a realização desta mudança e toma uma atitude neste sentido", "5. Manutenção: é o estágio onde se trabalha a prevenção à recaída e a consolidação dos ganhos obtidos durante a Ação", "6. Recaída ou conclusão: Após o estágio da manutenção, a pessoa pode cometer um deslize ou retornar ao comportamento considerado inadequado ou prejudicial."] },
                { id: "q55", titulo: "Adesão ao plano de cuidados", tipo: "radio", opcoes: ["Aderiu totalmente", "Aderiu parcialmente", "Não aderiu ao tratamento"] },
                { id: "q56", titulo: "Nível de complexidade", tipo: "radio", opcoes: ["Nível 1", "Nível 2", "Nível 3", "Nível 4", "Nível 5"] },
                { id: "q57", titulo: "Nível de complexidade após VD/monitoramento/Consulta APS", tipo: "radio", opcoes: ["Nível 1", "Nível 2", "Nível 3", "Nível 4", "Nível 5"] },
                { id: "q58", titulo: "Anotação", tipo: "textarea" },
                { id: "q59", titulo: "Medicamentos de uso contínuo", tipo: "textarea" },
                { id: "q60", titulo: "CID", tipo: "text" },
                { id: "q61", titulo: "CIAP", tipo: "text" },
                { id: "q62", titulo: "Plano terapêutico", tipo: "textarea" }
            ]
        },
        "status-atendimento": {
            titulo: "Status do atendimento",
            descricao: null,
            questoes: [
                { id: "q63", titulo: "Status do atendimento *", tipo: "radio", opcoes: ["Visita realizada", "Não estava em casa", "Não teve interesse em receber visita", "Contato com sucesso", "Ligar em outro momento", "Não atende", "Nº inválido ou contato pertence a outra pessoa", "Óbito", "Consulta na APS", "Consulta na Elosaúde", "Preenchimento administrativo"] },
                { id: "q64", titulo: "Formulário preenchido por *", tipo: "radio", opcoes: ["Equipe Clínica de APS", "Equipe Elosaúde"] },
                { id: "q65", titulo: "Próximo contato *", tipo: "date", placeholder: "Exemplo: 7 de janeiro de 2019" },
                {
                    id: "q66", titulo: "Encaminhamentos", tipo: "checkbox_outro",
                    opcoes: ["Clínica de APS", "Psicologia", "Nutrição", "Fisioterapia", "Conexa", "Cardiologista", "Endocrinologista", "Pneumologista", "Oftalmologista", "Geriatra"],
                    outro_label: "Outro:"
                }
            ]
        }
    };

    if (menuProtocolosNav) {
        const linksProtocolos = menuProtocolosNav.querySelectorAll("ul li a");
        linksProtocolos.forEach(link => {
            // Criar divs para descrição e conteúdo de questões para cada item do menu
            const protocoloId = link.dataset.protocolo;
            const divDescricao = document.createElement("div");
            divDescricao.className = "descricao-protocolo-item";
            divDescricao.id = `desc-${protocoloId}`;
            divDescricao.style.display = "none";
            link.parentNode.appendChild(divDescricao);

            const divConteudo = document.createElement("div");
            divConteudo.className = "protocolo-conteudo";
            divConteudo.id = `cont-${protocoloId}`;
            divConteudo.style.display = "none";
            link.parentNode.appendChild(divConteudo);

            link.addEventListener("click", (event) => {
                event.preventDefault();
                const targetProtocoloId = event.currentTarget.dataset.protocolo;
                const currentConteudoDiv = document.getElementById(`cont-${targetProtocoloId}`);
                const currentDescricaoDiv = document.getElementById(`desc-${targetProtocoloId}`);
                const isVisible = currentConteudoDiv.style.display === "block";

                // Fechar todos os outros protocolos
                document.querySelectorAll(".protocolo-conteudo").forEach(div => {
                    if (div.id !== `cont-${targetProtocoloId}`) {
                        div.style.display = "none";
                        div.innerHTML = ""; 
                    }
                });
                document.querySelectorAll(".descricao-protocolo-item").forEach(div => {
                    if (div.id !== `desc-${targetProtocoloId}`) {
                        div.style.display = "none";
                        div.innerHTML = "";
                    }
                });
                
                // Abrir/Fechar o clicado
                if (isVisible) {
                    currentConteudoDiv.style.display = "none";
                    currentConteudoDiv.innerHTML = "";
                    currentDescricaoDiv.style.display = "none";
                    currentDescricaoDiv.innerHTML = "";
                } else {
                    const protocoloData = estruturaProtocolos[targetProtocoloId];
                    if (protocoloData) {
                        if (protocoloData.descricao) {
                            currentDescricaoDiv.innerHTML = `<p><strong>Descrição:</strong> ${protocoloData.descricao}</p>`;
                            currentDescricaoDiv.style.display = "block";
                        } else {
                            currentDescricaoDiv.innerHTML = "";
                            currentDescricaoDiv.style.display = "none";
                        }
                        gerarQuestoesHTML(protocoloData, currentConteudoDiv);
                        currentConteudoDiv.style.display = "block";
                    } else {
                        currentConteudoDiv.innerHTML = "<p>Definição do protocolo não encontrada.</p>";
                        currentConteudoDiv.style.display = "block";
                        currentDescricaoDiv.style.display = "none";
                    }
                }
            });
        });
    }

    function gerarQuestoesHTML(protocoloData, container) {
        let htmlQuestoes = `<h3>${protocoloData.titulo}</h3>`;
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
                        htmlQuestoes += `<div class="radio-option"><input type="radio" id="${radioId}" name="${q.id}" value="${opt}"><label for="${radioId}">${opt}</label></div>`;
                    });
                    break;
                case "checkbox":
                    q.opcoes.forEach((opt, index) => {
                        const checkId = `${q.id}_${index}`;
                        htmlQuestoes += `<div class="checkbox-option"><input type="checkbox" id="${checkId}" name="${q.id}[]" value="${opt}"><label for="${checkId}">${opt}</label></div>`;
                    });
                    break;
                case "checkbox_outro":
                    q.opcoes.forEach((opt, index) => {
                        const checkId = `${q.id}_${index}`;
                        htmlQuestoes += `<div class="checkbox-option"><input type="checkbox" id="${checkId}" name="${q.id}[]" value="${opt}"><label for="${checkId}">${opt}</label></div>`;
                    });
                    htmlQuestoes += `<div class="checkbox-option"><label for="${q.id}_outro">${q.outro_label || 'Outro:'}</label><input type="text" id="${q.id}_outro_text" name="${q.id}_outro_text"></div>`;
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
            htmlQuestoes += `</div>`; // fim .questao-item
        });
        htmlQuestoes += `<button class="salvar-protocolo-btn">Salvar ${protocoloData.titulo}</button>`;
        container.innerHTML = htmlQuestoes;
    }
});
