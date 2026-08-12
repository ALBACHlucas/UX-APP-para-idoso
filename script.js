    
        // Estado da Aplicação
        let tamanhoFonteAtual = 18; // Tamanho base da fonte
        let modoAltoContraste = false;
        let pontuacaoQuiz = 0;
        let indiceQuizAtual = 0;

        // Lista de Perguntas do Simulador
        const perguntasQuiz = [
            {
                mensagem: "Recebeu uma mensagem SMS: 'Alerta Bancário: O seu cartão será suspenso hoje. Clique aqui para atualizar os seus dados: bit.ly/banco-123'",
                ehGolpe: true,
                explicacao: "É BURLA! Os bancos não enviam hiperligações por SMS a pedir dados de conta. Elimine a mensagem."
            },
            {
                mensagem: "A sua filha envia mensagem de um número novo: 'Olá mãe, mudei de número. Preciso de pagar uma conta urgente de 200€, podes fazer uma transferência?'",
                ehGolpe: true,
                explicacao: "É BURLA! Nunca faça transferências sem LIGAR primeiro para o número antigo do seu familiar para confirmar."
            },
            {
                mensagem: "Abre a aplicação oficial do seu banco instalada no telemóvel para consultar o saldo da conta.",
                ehGolpe: false,
                explicacao: "É SEGURO! Utilizar a aplicação oficial descarregada da loja oficial do telemóvel é seguro."
            }
        ];

        // Mudar de Aba
        function mudarAba(nomeAba) {
            pararVoz();

            document.getElementById('aba-dicas').classList.add('hidden');
            document.getElementById('aba-jogo').classList.add('hidden');
            document.getElementById('aba-sos').classList.add('hidden');
            document.getElementById('aba-audio').classList.add('hidden');

            const botoes = document.querySelectorAll('.tab-btn');
            botoes.forEach(btn => {
                btn.classList.remove('bg-blue-700', 'text-white');
                btn.classList.add('bg-white', 'text-blue-900');
            });

            document.getElementById(`aba-${nomeAba}`).classList.remove('hidden');
            const btnAtivo = document.getElementById(`btn-tab-${nomeAba}`);
            btnAtivo.classList.remove('bg-white', 'text-blue-900');
            btnAtivo.classList.add('bg-blue-700', 'text-white');

            if (nomeAba === 'jogo' && indiceQuizAtual === 0) {
                carregarPerguntaQuiz();
            }
        }

        // Alterar o Tamanho da Fonte
        function alterarTamanhoFonte(delta) {
            tamanhoFonteAtual += delta * 2;
            if (tamanhoFonteAtual < 14) tamanhoFonteAtual = 14;
            if (tamanhoFonteAtual > 26) tamanhoFonteAtual = 26;
            
            document.body.style.fontSize = `${tamanhoFonteAtual}px`;
        }

        // Alternar o Modo de Alto Contraste
        function alternarAltoContraste() {
            modoAltoContraste = !modoAltoContraste;
            const body = document.getElementById('app-body');
            
            if (modoAltoContraste) {
                body.classList.add('high-contrast');
                localStorage.setItem('modoAltoContraste', 'true');
            } else {
                body.classList.remove('high-contrast');
                localStorage.setItem('modoAltoContraste', 'false');
            }
        }

        // Leitura em Voz Alta (Text-to-Speech)
        function lerTexto(texto) {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();

                const mensagem = new SpeechSynthesisUtterance(texto);
                mensagem.lang = 'pt-PT';
                mensagem.rate = 0.9;
                
                window.speechSynthesis.speak(mensagem);
            }
        }

        function pararVoz() {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        }

        function tocarResumoVoz() {
            const resumo = "Bem-vindo ao Guia de Segurança Digital. Lembre-se destas três regras principais: Primeira: Nunca envie palavras-passe ou códigos recebidos por SMS a ninguém. Segunda: Se um parente pedir dinheiro por mensagem com um número novo, ligue para ele antes de fazer qualquer pagamento. Terceira: Na dúvida sobre qualquer mensagem estranha, procure um familiar de confiança para ajudar.";
            lerTexto(resumo);
        }

        // Lógica do Quiz
        function carregarPerguntaQuiz() {
            const pergunta = perguntasQuiz[indiceQuizAtual];
            document.getElementById('texto-simulacao').innerText = pergunta.mensagem;
            document.getElementById('progresso-quiz').innerText = `Pergunta ${indiceQuizAtual + 1} de ${perguntasQuiz.length}`;
            
            document.getElementById('feedback-quiz').classList.add('hidden');
            document.getElementById('btn-proximo-quiz').classList.add('hidden');
            
            document.getElementById('botoes-resposta').classList.remove('pointer-events-none', 'opacity-50');
        }

        function lerMensagemQuiz() {
            const mensagem = perguntasQuiz[indiceQuizAtual].mensagem;
            lerTexto(mensagem);
        }

        function responderQuiz(escolheuGolpe) {
            const pergunta = perguntasQuiz[indiceQuizAtual];
            const acertou = escolheuGolpe === pergunta.ehGolpe;
            const divFeedback = document.getElementById('feedback-quiz');

            if (acertou) {
                pontuacaoQuiz += 10;
                document.getElementById('pontuacao').innerText = `Pontos: ${pontuacaoQuiz}`;
                divFeedback.className = "mt-6 p-4 rounded-xl border-2 bg-emerald-100 border-emerald-500 text-emerald-900";
                divFeedback.innerHTML = `<h4 class="font-bold text-xl mb-1"><i class="fa-solid fa-circle-check text-emerald-600"></i> Muito Bem! Acertou!</h4><p>${pergunta.explicacao}</p>`;
                lerTexto("Muito bem! Acertou! " + pergunta.explicacao);
            } else {
                divFeedback.className = "mt-6 p-4 rounded-xl border-2 bg-red-100 border-red-500 text-red-900";
                divFeedback.innerHTML = `<h4 class="font-bold text-xl mb-1"><i class="fa-solid fa-circle-xmark text-red-600"></i> Cuidado!</h4><p>${pergunta.explicacao}</p>`;
                lerTexto("Cuidado! " + pergunta.explicacao);
            }

            divFeedback.classList.remove('hidden');
            document.getElementById('botoes-resposta').classList.add('pointer-events-none', 'opacity-50');
            document.getElementById('btn-proximo-quiz').classList.remove('hidden');
        }

        function proximaPergunta() {
            indiceQuizAtual++;
            if (indiceQuizAtual < perguntasQuiz.length) {
                carregarPerguntaQuiz();
            } else {
                document.getElementById('container-quiz').innerHTML = `
                    <div class="text-center py-8 space-y-4">
                        <i class="fa-solid fa-trophy text-6xl text-amber-500"></i>
                        <h3 class="text-2xl font-bold text-slate-800">Parabéns! Concluiu o treino!</h3>
                        <p class="text-xl text-slate-600">Pontuação final: <strong>${pontuacaoQuiz} pontos</strong></p>
                        <p class="text-slate-600">Continue a praticar para manter a segurança ao navegar na internet.</p>
                        <button onclick="reiniciarQuiz()" class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-xl text-lg mt-4">
                            Jogar Novamente
                        </button>
                    </div>
                `;
                lerTexto(`Parabéns! Concluiu o treino com ${pontuacaoQuiz} pontos!`);
            }
        }

        function reiniciarQuiz() {
            pontuacaoQuiz = 0;
            indiceQuizAtual = 0;
            location.reload();
        }

        // Fechar Modal de Boas-vindas
        function fecharModalBoasVindas() {
            const modal = document.getElementById('modal-boas-vindas');
            modal.classList.add('hidden');
            localStorage.setItem('modalBoasVindasVisto', 'true');
        }

        // Ler Modal de Boas-vindas em Voz Alta
        function lerModalBoasVindas() {
            const texto = "Bem-vindo ao Digital Seguro. Este é um guia completo de segurança na internet. Aqui você encontrará dicas úteis sobre WhatsApp, senhas e segurança em transferências. Pode praticar com um jogo de simulação de burlas. Se cair em um golpe, temos instruções de emergência. Todas as funcionalidades têm som para melhor acessibilidade.";
            lerTexto(texto);
        }

        // Inicialização
        window.onload = function() {
            document.body.style.fontSize = `${tamanhoFonteAtual}px`;
            
            // Mostrar modal apenas na primeira visita
            if (!localStorage.getItem('modalBoasVindasVisto')) {
                document.getElementById('modal-boas-vindas').classList.remove('hidden');
            } else {
                document.getElementById('modal-boas-vindas').classList.add('hidden');
            }
            
            // Restaurar modo alto contraste se estava ativo
            if (localStorage.getItem('modoAltoContraste') === 'true') {
                alternarAltoContraste();
            }
        };
    