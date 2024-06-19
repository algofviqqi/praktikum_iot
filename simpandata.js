const mqtt = require('mqtt');
const mysql = require('mysql');

// Koneksi ke MQTT broker
const mqttClient = mqtt.connect('mqtt://usm.revolusi-it.com', {
  username: 'usm',
  password: 'usmjaya24'
});

// Koneksi ke database MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'iot'
});

db.connect((err) => {
  if (err) {
    console.error('Koneksi ke database gagal:', err);
    return;
  }
  console.log('Terhubung ke database MySQL');
});

// Subscribe ke topik test/test
mqttClient.on('connect', () => {
  console.log('Terhubung ke MQTT broker');
  mqttClient.subscribe('test/test', (err) => {
    if (err) {
      console.error('Gagal subscribe ke topik:', err);
    } else {
      console.log('Berhasil subscribe ke topik test/test');
    }
  });
});

// Menangani pesan yang diterima dari MQTT broker
mqttClient.on('message', (topic, message) => {
  const msg = message.toString();
  console.log(`Pesan diterima di topik ${topic}: ${msg}`);

  // Simpan pesan ke database
  const query = 'INSERT INTO record (topic, msg) VALUES (?, ?)';
  db.query(query, [topic, msg], (err, result) => {
    if (err) {
      console.error('Gagal menyimpan pesan ke database:', err);
    } else {
      console.log('Pesan berhasil disimpan ke database');
    }
  });
});

// Menangani kesalahan koneksi ke MQTT broker
mqttClient.on('error', (err) => {
  console.error('Kesalahan pada koneksi MQTT:', err);
});