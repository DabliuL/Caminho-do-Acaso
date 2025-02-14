// Função que gera uma cor aleatória
function randomColor(){
    r = Math.floor(Math.random() * 255); // Gera um valor aleatório para o vermelho
    g = Math.floor(Math.random() * 255); // Gera um valor aleatório para o verde
    b = Math.floor(Math.random() * 255); // Gera um valor aleatório para o azul
    return {r,g,b} // Retorna um objeto com os valores RGB
}

// Função que converte graus para radianos
function toRad(deg){
    return deg * (Math.PI / 180.0); // Converte graus para radianos
}

// Função que gera um número aleatório entre um mínimo e máximo
function randomRange(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min; // Retorna um número inteiro aleatório dentro do intervalo
}

// Função de easing para suavizar a rotação
function easeOutSine(x) {
    return Math.sin((x * Math.PI) / 2); // Retorna um valor suavizado
}

// Função para calcular a porcentagem entre dois números
function getPercent(input, min, max){
    return (((input - min) * 100) / (max - min)) / 100; // Retorna a porcentagem do valor entre os limites
}

// Seleciona o elemento canvas e seu contexto para desenhar
const canvas = document.getElementById("canvas"); // Obtém o canvas pelo ID
const ctx = canvas.getContext("2d"); // Obtém o contexto 2D do canvas
const width = document.getElementById("canvas").width; // Largura do canvas
const height = document.getElementById("canvas").height; // Altura do canvas

const centerX = width / 2; // Posição central no eixo X
const centerY = height / 2; // Posição central no eixo Y
const radius = width / 2; // Raio do círculo da roleta

let items = document.getElementsByTagName("textarea")[0].value.split("\n"); // Obtém as opções do textarea e as divide em um array

let currentDeg = 0; // Grau atual de rotação
let step = 360 / items.length; // Passo de cada item na roleta
let colors = []; // Array para armazenar as cores
let itemDegs = {}; // Objeto para armazenar os ângulos dos itens

// Preenche o array de cores para cada item na roleta
for(let i = 0; i < items.length + 1; i++){
    colors.push(randomColor()); // Adiciona uma cor aleatória ao array
}

// Função que cria a roleta a partir das opções
function createWheel(){
    // Atualiza os itens a partir do textarea, filtrando entradas vazias
    items = document.getElementsByTagName("textarea")[0].value.split("\n").filter(item => item.trim() !== "");
    step = 360 / items.length; // Atualiza o passo de cada item
    colors = []; // Limpa o array de cores
    // Preenche o array de cores novamente
    for(let i = 0; i < items.length + 1; i++){
        colors.push(randomColor()); // Adiciona uma cor aleatória ao array
    }
    draw(); // Desenha a roleta com os novos itens
}
draw(); // Desenha a roleta inicialmente

// Função que desenha a roleta no canvas
function draw(){
    ctx.beginPath(); // Inicia um novo caminho de desenho
    ctx.arc(centerX, centerY, radius, toRad(0), toRad(360)); // Desenha o círculo da roleta
    ctx.fillStyle = `rgb(${33},${33},${33})`; // Define a cor de preenchimento
    ctx.lineTo(centerX, centerY); // Cria uma linha até o centro do círculo
    ctx.fill(); // Preenche o círculo

    let startDeg = currentDeg; // Inicializa o grau de início
    // Desenha cada segmento da roleta
    for(let i = 0; i < items.length; i++, startDeg += step){
        let endDeg = startDeg + step; // Define o grau de fim para o segmento

        let color = colors[i]; // Obtém a cor do segmento atual
        let colorStyle = `rgb(${color.r},${color.g},${color.b})`; // Define o estilo da cor do segmento

        ctx.beginPath(); // Inicia um novo caminho para o segmento
        let rad = toRad(360 / step); // Calcula o raio em radianos
        ctx.arc(centerX, centerY, radius - 2, toRad(startDeg), toRad(endDeg)); // Desenha o arco do segmento
        let colorStyle2 = `rgb(${color.r - 30},${color.g - 30},${color.b - 30})`; // Cria uma cor mais escura para o contorno
        ctx.fillStyle = colorStyle2; // Define a cor de preenchimento
        ctx.lineTo(centerX, centerY); // Cria uma linha até o centro
        ctx.fill(); // Preenche o segmento

        ctx.beginPath(); // Inicia um novo caminho para o segmento
        rad = toRad(360 / step); // Calcula o raio em radianos
        ctx.arc(centerX, centerY, radius - 30, toRad(startDeg), toRad(endDeg)); // Desenha o arco do segmento
        ctx.fillStyle = colorStyle; // Define a cor de preenchimento
        ctx.lineTo(centerX, centerY); // Cria uma linha até o centro
        ctx.fill(); // Preenche o segmento

        // Desenha o texto no segmento
        ctx.save(); // Salva o estado do contexto
        ctx.translate(centerX, centerY); // Move a origem para o centro da roleta
        ctx.rotate(toRad((startDeg + endDeg) / 2)); // Rotaciona o contexto para alinhar o texto
        ctx.textAlign = "center"; // Alinha o texto ao centro
        if(color.r > 150 || color.g > 150 || color.b > 150){ // Verifica se a cor é clara
            ctx.fillStyle = "#000"; // Define a cor do texto como preto
        } else {
            ctx.fillStyle = "#fff"; // Define a cor do texto como branco
        }
        ctx.font = 'bold 24px serif'; // Define a fonte do texto
        ctx.fillText(items[i], 130, 10); // Desenha o texto na posição especificada
        ctx.restore(); // Restaura o estado anterior do contexto

        // Armazena os ângulos de cada item
        itemDegs[items[i]] = {
            "startDeg": startDeg,
            "endDeg": endDeg
        };

        // Verifica se o item é o vencedor
        if(startDeg % 360 < 360 && startDeg % 360 > 270 && endDeg % 360 > 0 && endDeg % 360 < 90 ){
            document.getElementById("winner").innerHTML = items[i]; // Atualiza o resultado do vencedor
        }
    }
}

let speed = 0; // Inicializa a velocidade de rotação
let maxRotation = randomRange(360 * 3, 360 * 6); // Define a rotação máxima aleatória
let pause = false; // Inicializa o estado de pausa
function animate(){
    if(pause){ // Verifica se a animação está pausada
        return; // Se estiver, não faz nada
    }
    speed = easeOutSine(getPercent(currentDeg, maxRotation, 0)) * 20; // Calcula a nova velocidade
    if(speed < 0.01){ // Verifica se a velocidade é baixa o suficiente
        speed = 0; // Para a rotação
        pause = true; // Define pausa como verdadeira
    }
    currentDeg += speed; // Atualiza o grau atual
    draw(); // Desenha a roleta na nova posição
    window.requestAnimationFrame(animate); // Chama a função novamente para criar a animação
}

function spin(){ // Função que inicia a rotação da roleta
    if(speed != 0){ // Verifica se a roleta já está girando
        return; // Se sim, não faz nada
    }

    maxRotation = 0; // Reseta a rotação máxima
    currentDeg = 0; // Reseta o grau atual
    createWheel(); // Cria a roleta com as opções atuais
    draw(); // Desenha a roleta

    // Rotação aleatória para um item
    maxRotation = (360 * randomRange(3, 6)) + randomRange(0, 360); // Define a nova rotação máxima aleatória
    itemDegs = {}; // Limpa os ângulos dos itens
    pause = false; // Reinicia o estado de pausa
    window.requestAnimationFrame(animate); // Inicia a animação
}

// Função para confirmar o título e ocultar o campo de edição e o botão
function confirmTitle() {
    let titleInput = document.getElementById("customTitle"); // Obtém o campo de entrada do título
    let titleDisplay = document.getElementById("customTitleDisplay"); // Obtém o título exibido
    let confirmButton = document.getElementById("confirmButton"); // Obtém o botão de confirmar

    if ( titleInput.value != "") {
    titleDisplay.innerText = titleInput.value; // Atualiza o título exibido com o valor do input
    titleInput.style.display = "none"; // Oculta o campo de entrada
    confirmButton.style.display = "none"; // Oculta o botão de confirmar
    titleDisplay.style.display = "block"; // Exibe o título
}
}

// Função para permitir que o usuário edite o título novamente ao clicar no título exibido
function editTitle() {
    let titleInput = document.getElementById("customTitle"); // Obtém o campo de entrada do título
    let titleDisplay = document.getElementById("customTitleDisplay"); // Obtém o título exibido
    let confirmButton = document.getElementById("confirmButton"); // Obtém o botão de confirmar

    titleInput.style.display = "block"; // Exibe o campo de entrada
    confirmButton.style.display = "block"; // Exibe o botão de confirmar
    titleDisplay.style.display = "none"; // Oculta o título exibido
}

function limitCharsPerLine(maxChars) {
    const textarea = document.getElementById('optionsInput');
    const lines = textarea.value.split("\n");
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].length > 16) {
            lines[i] = lines[i].substring(0, 16); // Limita a linha ao número máximo de caracteres
        }
    }
    
    // Atualiza o valor do textarea com as linhas limitadas
    textarea.value = lines.join("\n");
}


// Função para exibir a janela de login
function showLogin() {
    document.getElementById("loginContainer").style.display = "flex"; // Exibe a janela de login
}

// Função para ocultar a janela de login
function hideLogin() {
    document.getElementById("loginContainer").style.display = "none"; // Esconde a janela de login
}

// Redireciona para o index.php ao clicar em "OK"
document.getElementById('okButton').onclick = function() {
    window.location.href = 'index.php';
};
