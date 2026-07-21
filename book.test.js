const request = require('supertest');
const app = require('./index');
const { calculateFine, isValidBookCode } = require('./book');

describe('Pruebas unitarias de book.js', () => {
  describe('calculateFine()', () => {
    test('cálculo correcto para días mayores a cero', () => {
      expect(calculateFine(5)).toBe(2.50);
      expect(calculateFine(10)).toBe(5.00);
    });

    test('cero días de retraso', () => {
      expect(calculateFine(0)).toBe(0);
    });

    test('número negativo de días', () => {
      expect(calculateFine(-5)).toBeNull();
      expect(calculateFine(-1)).toBeNull();
    });

    test('valor no numérico', () => {
      expect(calculateFine('abc')).toBeNull();
    });
  });

  describe('isValidBookCode()', () => {
    test('código válido', () => {
      expect(isValidBookCode('TIP101')).toBe(true);
      expect(isValidBookCode('CAS101')).toBe(true);
    });

    test('código inválido', () => {
      expect(isValidBookCode('INVALID')).toBe(false);
      expect(isValidBookCode('123AAA')).toBe(false);
      expect(isValidBookCode('TIP10')).toBe(false);
    });

    test('código vacío', () => {
      expect(isValidBookCode('')).toBe(false);
      expect(isValidBookCode(null)).toBe(false);
      expect(isValidBookCode(undefined)).toBe(false);
    });
  });
});

describe('Pruebas de integración para endpoints de la API', () => {
  describe('GET /', () => {
    test('debe responder con información de la biblioteca y del estudiante', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        mensaje: 'Biblioteca Digital ESPE',
        estudiante: 'Leonel Alejandro Tipan Quinto',
        nrc: '30730',
        correo: 'latipan1@espe.edu.ec'
      });
    });
  });

  describe('GET /book/:code', () => {
    test('debe retornar 200 y datos del libro si el código es válido', async () => {
      const response = await request(app).get('/book/TIP101');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        code: 'TIP101',
        title: 'Libro TIP101',
        available: true
      });
    });

    test('debe retornar 400 si el código es inválido', async () => {
      const response = await request(app).get('/book/INVALID');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('mensaje', 'Código de libro inválido');
    });
  });

  describe('GET /fine', () => {
    test('debe retornar 200 y la multa calculada para días válidos', async () => {
      const response = await request(app).get('/fine?daysLate=5');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        daysLate: 5,
        fine: 2.50
      });
    });

    test('debe retornar 400 si daysLate es negativo', async () => {
      const response = await request(app).get('/fine?daysLate=-5');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('mensaje', 'Días de retraso inválidos');
    });

    test('debe retornar 400 si daysLate no es enviado', async () => {
      const response = await request(app).get('/fine');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('mensaje', 'El parámetro daysLate es obligatorio');
    });
  });
});
