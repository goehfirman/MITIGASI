const fs = require('fs');
let code = fs.readFileSync('lib/quiz-data.ts', 'utf8');

const volcanoImages = {
  'Sinabung': 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Gunung_Sinabung.jpg',
  'Kerinci': 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Gunung_Kerinci.jpg',
  'Anak Krakatau': 'https://tangselpos.id/storage/2024/09/gunung-anak-krakatau-masih-batuk-batuk-hari-ini-sudah-5-kali-erupsi-08092024-202824.jpg',
  'Tangkuban Parahu': 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Tangkuban_Perahu.jpg',
  'Merapi': 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Mount_Merapi.jpg',
  'Semeru': 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Mount_Semeru.jpg',
  'Ijen': 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Kawah_ijen.jpg',
  'Agung': 'https://upload.wikimedia.org/wikipedia/commons/c/cc/MountAgung.jpg',
  'Rinjani': 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Gunung_rinjani.jpg',
  'Tambora': 'https://upload.wikimedia.org/wikipedia/commons/7/78/Mount_Tambora_Volcano%2C_Sumbawa_Island%2C_Indonesia.jpg',
  'Kelimutu': 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Danau_Kelimutu.jpg',
  'Lokon': 'https://upload.wikimedia.org/wikipedia/commons/5/55/Gunung_Lokon.jpg',
  'Soputan': 'https://upload.wikimedia.org/wikipedia/commons/2/20/Soputan.jpg',
  'Dukono': 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Dukono.jpg',
  'Ibu': 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Gunung_Ibu.jpg',
  'Gamalama': 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Gunung_Gamalama.jpg'
};

const islandImages = {
  'SUMATRA': '/slide-kepulauan.gif',
  'JAWA': '/slide-kepulauan.gif',
  'KALIMANTAN': '/slide-kepulauan.gif',
  'SULAWESI': '/slide-kepulauan.gif',
  'PAPUA': '/slide-kepulauan.gif',
  'NUSA TENGGARA': '/slide-kepulauan.gif',
  'MALUKU': '/slide-kepulauan.gif'
};

const islandLabels = {
  'SUMATRA': 'Pulau Sumatra',
  'JAWA': 'Pulau Jawa',
  'KALIMANTAN': 'Pulau Kalimantan',
  'SULAWESI': 'Pulau Sulawesi',
  'PAPUA': 'Pulau Papua',
  'NUSA TENGGARA': 'Kepulauan Nusa Tenggara',
  'MALUKU': 'Kepulauan Maluku'
};

const startIdx = code.indexOf('export const QUIZ_BANK: QuizQuestion[] = [');
const endIdx = code.indexOf('];', startIdx) + 2;

let arrayText = code.substring(startIdx + 'export const QUIZ_BANK: QuizQuestion[] = '.length, endIdx);
let bank = eval(arrayText);

for (let q of bank) {
  if (q.type === 'map-click') {
    if (q.mapType === 'island') {
       q.image = islandImages[q.correctAnswer];
       let name = islandLabels[q.correctAnswer];
       q.question = 'Perhatikan peta letak geografis Indonesia. Tunjukkan letak ' + name + ' pada peta dengan mengklik titiknya!';
    } else {
       q.image = volcanoImages[q.correctAnswer];
       q.question = 'Perhatikan gambar! Gunung tersebut adalah Gunung ' + q.correctAnswer + '. Tunjukkan letak gunung tersebut pada peta!';
    }
  }
}

code = code.substring(0, startIdx + 'export const QUIZ_BANK: QuizQuestion[] = '.length) + JSON.stringify(bank, null, 2) + code.substring(endIdx);
fs.writeFileSync('lib/quiz-data.ts', code);
