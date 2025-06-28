// Variables físicas base
let longitudInicial = 1.0; // en metros
let area = 0.0002; // m²
let moduloYoung = 10e9; // N/m² (acero)
let fuerza = 200; // N

//imagen de la niña
const imagenNina = new Image();
imagenNina.src = "nina.png"; // nombre del archivo de la niña

// ✅ REDIBUJAR CUANDO LA IMAGEN ESTÉ LISTA
imagenNina.onload = () => {
  dibujarBarra(); // Redibuja solo si la imagen ya cargó correctamente
};

// datos para el grafico
let chart;
const datosGrafico = {
  labels: [],
  datasets: [{
    label: 'Esfuerzo (MPa)',
    data: [],
    backgroundColor: 'rgba(0, 116, 217, 0.5)',
    borderColor: '#0074D9',
    borderWidth: 2,
    tension: 0.3,
    fill: true,
    pointRadius: 3
  }]
};

// funcion para crear el grafrico 
function crearGrafico() {
  const ctx = document.getElementById('graficoChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: datosGrafico,
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Deformación (m)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Esfuerzo (MPa)'
          },
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

// funcion para actualizar el grafico 
function actualizarFuerza(valor) {
  fuerza = parseFloat(valor);
  document.getElementById("valorFuerza").textContent = valor;
  calcularElasticidad();
  dibujarBarra();
}

function calcularElasticidad() {
  const deltaL = (fuerza * longitudInicial) / (area * moduloYoung);
  const esfuerzo = fuerza / area;
  const energia = 0.5 * fuerza * deltaL;

  document.getElementById("deformacion").textContent = deltaL.toFixed(6);
  document.getElementById("esfuerzo").textContent = (esfuerzo / 1e6).toFixed(2); // MPa
  document.getElementById("energia").textContent = energia.toFixed(2);
   
  // Actualizar gráfico
  datosGrafico.labels.push(deltaL.toFixed(4));
  datosGrafico.datasets[0].data.push((esfuerzo / 1e6).toFixed(2));
  chart.update();

}

function dibujarBarra() {
  const canvas = document.getElementById("canvasSimulador");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const anchoOriginal = 400;
  const inicioX = 100;
  const barraY = 100;

  // Calcular elongación proporcional
  const deltaL = (fuerza * longitudInicial) / (area * moduloYoung);
  const escala = 400; // escala visual
  const elongacionPx = deltaL * escala;

  const anchoFinal = anchoOriginal + elongacionPx;

  // Dibujar soporte
  ctx.fillStyle = "#888";
  ctx.fillRect(inicioX - 20, barraY - 20, 20, 40);

  // Dibujar barra elástica
  ctx.fillStyle = fuerza > 600 ? "#e74c3c" : fuerza > 400 ? "#f1c40f" : "#2ecc71";
  ctx.fillRect(inicioX, barraY - 10, anchoFinal, 20);

  // Dibujar flecha de fuerza
ctx.drawImage(imagenNina, inicioX + anchoFinal + 10, barraY - 40, 40, 60);
}

// Inicialización
window.onload = () => {
  crearGrafico();
  calcularElasticidad();
  dibujarBarra();
};
