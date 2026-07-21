const express = require('express');
const { isValidBookCode, calculateFine } = require('./book');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Endpoint 1: Información General
app.get('/', (req, res) => {
  res.status(200).json({
    mensaje: 'Biblioteca Digital ESPE',
    estudiante: 'Leonel Alejandro Tipan Quinto',
    nrc: '30730',
    correo: 'latipan1@espe.edu.ec'
  });
});

// Endpoint 2: Consulta de Libro por Código
app.get('/book/:code', (req, res) => {
  const { code } = req.params;

  if (!isValidBookCode(code)) {
    return res.status(400).json({ mensaje: 'Código de libro inválido' });
  }

  return res.status(200).json({
    code,
    title: `Libro ${code}`,
    available: true
  });
});

// Endpoint 3: Cálculo de Multa por Retraso
app.get('/fine', (req, res) => {
  const { daysLate } = req.query;

  if (daysLate === undefined || daysLate === null || daysLate === '') {
    return res.status(400).json({ mensaje: 'El parámetro daysLate es obligatorio' });
  }

  const daysNumber = Number(daysLate);
  const fine = calculateFine(daysNumber);

  if (fine === null) {
    return res.status(400).json({ mensaje: 'Días de retraso inválidos' });
  }

  return res.status(200).json({
    daysLate: daysNumber,
    fine
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
  });
}

module.exports = app;
