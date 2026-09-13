export interface QuizQuestion {
  id: number;
  type: 'multiple-choice' | 'true-false';
  category: 'khatulistiwa' | 'cincin-api' | 'kepulauan' | 'mitigasi';
  categoryLabel: string;
  question: string;
  image?: string;
  options: string[];
  correctAnswer: number; // Index of correct option (0-3 for PG, 0-1 for True/False)
  explanation: string;
}

export const QUIZ_BANK: QuizQuestion[] = [
  // ==========================================
  // TOPIK 1: DILINTASI KHATULISTIWA (12 Soal)
  // ==========================================
  {
    id: 1,
    type: 'multiple-choice',
    category: 'khatulistiwa',
    categoryLabel: 'Dilintasi Khatulistiwa',
    question: 'Indonesia dilalui oleh garis khatulistiwa. Apa yang dimaksud dengan garis khatulistiwa?',
    image: '/slide-khatulistiwa.gif',
    options: [
      'Garis khayal lintang 0° yang membagi Bumi menjadi belahan utara dan selatan',
      'Garis bujur yang membagi waktu menjadi siang dan malam',
      'Garis batas kedalaman laut antara wilayah barat dan timur',
      'Garis batas lempeng tektonik yang rawan gempa bumi'
    ],
    correctAnswer: 0,
    explanation: 'Garis khatulistiwa (ekuator) adalah garis khayal lintang 0° yang membagi bola Bumi menjadi dua belahan sama besar, yaitu belahan utara dan selatan.'
  },
  {
    id: 2,
    type: 'multiple-choice',
    category: 'khatulistiwa',
    categoryLabel: 'Dilintasi Khatulistiwa',
    question: 'Salah satu kota di Indonesia yang tepat dilintasi oleh garis khatulistiwa dan memiliki tugu peringatannya adalah...',
    options: [
      'Kota Pontianak (Kalimantan Barat)',
      'Kota Surabaya (Jawa Timur)',
      'Kota Banda Aceh (Aceh)',
      'Kota Denpasar (Bali)'
    ],
    correctAnswer: 0,
    explanation: 'Kota Pontianak di Kalimantan Barat terkenal sebagai Kota Khatulistiwa karena dilintasi langsung garis lintang 0° dan memiliki Tugu Khatulistiwa yang ikonik.'
  },
  {
    id: 3,
    type: 'true-false',
    category: 'khatulistiwa',
    categoryLabel: 'Dilintasi Khatulistiwa',
    question: 'Karena berada di lintang khatulistiwa, Indonesia memiliki iklim tropis dengan dua musim utama, yaitu musim hujan dan kemarau.',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    explanation: 'Benar. Wilayah khatulistiwa menerima sinar matahari sepanjang tahun, menghasilkan iklim tropis dengan dua musim: musim hujan dan kemarau.'
  },
  {
    id: 4,
    type: 'multiple-choice',
    category: 'khatulistiwa',
    categoryLabel: 'Dilintasi Khatulistiwa',
    question: 'Apa pengaruh letak khatulistiwa terhadap sektor pertanian di Indonesia?',
    options: [
      'Pertanian hanya bisa panen satu kali dalam lima tahun',
      'Sinar matahari dan curah hujan sepanjang tahun mendukung tanaman tumbuh subur',
      'Tanah menjadi beku karena musim dingin yang sangat panjang',
      'Tanaman pangan tidak dapat tumbuh karena suhu udara terlalu dingin'
    ],
    correctAnswer: 1,
    explanation: 'Penyinaran matahari yang melimpah dan curah hujan yang cukup sepanjang tahun membuat lahan pertanian di Indonesia sangat subur dan produktif.'
  },
  {
    id: 5,
    type: 'true-false',
    category: 'khatulistiwa',
    categoryLabel: 'Dilintasi Khatulistiwa',
    question: 'Garis khatulistiwa menyebabkan Indonesia mengalami perubahan 4 musim (musim semi, panas, gugur, dan dingin).',
    options: ['Benar', 'Salah'],
    correctAnswer: 1,
    explanation: 'Salah. Daerah khatulistiwa beriklim tropis sehingga hanya memiliki 2 musim (hujan dan kemarau), bukan 4 musim seperti di daerah beriklim sedang/subtropis.'
  },
  {
    id: 6,
    type: 'multiple-choice',
    category: 'khatulistiwa',
    categoryLabel: 'Dilintasi Khatulistiwa',
    question: 'Bentuk adaptasi budaya masyarakat Indonesia terhadap iklim tropis khatulistiwa yang hangat dan lembap antara lain...',
    options: [
      'Membangun rumah igloo berbahan es tebal',
      'Mengenakan mantel bulu tebal setiap hari',
      'Membuat rumah panggung dengan banyak ventilasi udara',
      'Menghentikan seluruh aktivitas bercocok tanam'
    ],
    correctAnswer: 2,
    explanation: 'Rumah panggung tradisional dirancang dengan ventilasi luas dan jendela besar untuk memaksimalkan sirkulasi udara di iklim tropis yang lembap.'
  },
  {
    id: 7,
    type: 'multiple-choice',
    category: 'khatulistiwa',
    categoryLabel: 'Dilintasi Khatulistiwa',
    question: 'Fenomena kulminasi utama (hari tanpa bayangan) di daerah khatulistiwa terjadi ketika...',
    options: [
      'Bulan menutupi matahari secara total di malam hari',
      'Posisi matahari berada tepat di atas kepala (titik zenit)',
      'Bumi berada pada jarak terjauh dari matahari',
      'Terjadi pasang air laut tertinggi sepanjang tahun'
    ],
    correctAnswer: 1,
    explanation: 'Hari tanpa bayangan terjadi saat matahari tepat berada di titik zenit (tegak lurus di atas kepala pengamat), sehingga bayangan benda tegak lurus jatuh tepat di bawahnya.'
  },
  {
    id: 8,
    type: 'true-false',
    category: 'khatulistiwa',
    categoryLabel: 'Dilintasi Khatulistiwa',
    question: 'Keanekaragaman hayati (biodiversitas) di hutan hujan tropis khatulistiwa Indonesia merupakan salah satu yang terkaya di dunia.',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    explanation: 'Benar. Hutan hujan tropis Indonesia menampung ribuan spesies flora dan fauna endemik dunia berkat kelembapan dan kehangatan iklim khatulistiwa.'
  },
  {
    id: 9,
    type: 'multiple-choice',
    category: 'khatulistiwa',
    categoryLabel: 'Dilintasi Khatulistiwa',
    question: 'Provinsi di bawah ini yang dilalui garis khatulistiwa di Pulau Sumatra adalah...',
    options: [
      'Sumatera Barat dan Riau',
      'Daerah Istimewa Yogyakarta',
      'Nusa Tenggara Timur',
      'Banten'
    ],
    correctAnswer: 0,
    explanation: 'Garis khatulistiwa melintasi Pulau Sumatra di wilayah Sumatera Barat (Bonjol), Riau, dan Kepulauan Riau.'
  },
  {
    id: 10,
    type: 'true-false',
    category: 'khatulistiwa',
    categoryLabel: 'Dilintasi Khatulistiwa',
    question: 'Di wilayah khatulistiwa, durasi siang dan malam hampir sama sepanjang tahun, yaitu masing-masing sekitar 12 jam.',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    explanation: 'Benar. Di lintang 0°, panjang waktu siang dan malam relatif konstan masing-masing sekitar 12 jam sepanjang tahun.'
  },
  {
    id: 11,
    type: 'multiple-choice',
    category: 'khatulistiwa',
    categoryLabel: 'Dilintasi Khatulistiwa',
    question: 'Kain dan pakaian tradisional masyarakat di wilayah tropis khatulistiwa umumnya dibuat dari bahan...',
    options: [
      'Bulu wol tebal dan kedap udara',
      'Bahan serat katun dan sutra alami yang ringan dan menyerap keringat',
      'Kulit hewan kutub yang tebal',
      'Bahan sintetis tahan salju'
    ],
    correctAnswer: 1,
    explanation: 'Bahan katun dan kain alami yang ringan sangat cocok untuk iklim tropis karena memiliki sirkulasi udara baik dan menyerap keringat.'
  },
  {
    id: 12,
    type: 'true-false',
    category: 'khatulistiwa',
    categoryLabel: 'Dilintasi Khatulistiwa',
    question: 'Hutan bakau (mangrove) pesisir di daerah tropis berfungsi sebagai benteng alami pemecah ombak dan pelindung dari tsunami.',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    explanation: 'Benar. Akar lebat hutan mangrove berfungsi sebagai peredam alami energi gelombang laut badai dan gelombang tsunami.'
  },

  // ==========================================
  // TOPIK 2: JALUR CINCIN API PASIFIK (13 Soal)
  // ==========================================
  {
    id: 13,
    type: 'multiple-choice',
    category: 'cincin-api',
    categoryLabel: 'Jalur Cincin Api',
    question: 'Perhatikan gambar animasi gunung api aktif. Indonesia berada di jalur pertemuan lempeng tektonik dunia yang dikenal sebagai...',
    image: '/slide-cincin-api.gif',
    options: [
      'Cincin Api Pasifik (Ring of Fire)',
      'Segitiga Bermuda',
      'Garis Wallacea',
      'Punggungan Atlantik'
    ],
    correctAnswer: 0,
    explanation: 'Indonesia berada di kawasan Cincin Api Pasifik (Ring of Fire), jalur pertemuan lempeng tektonik aktif yang dipenuhi ratusan gunung api aktif dunia.'
  },
  {
    id: 14,
    type: 'multiple-choice',
    category: 'cincin-api',
    categoryLabel: 'Jalur Cincin Api',
    question: 'Tiga lempeng tektonik utama dunia yang bertemu dan bertumbukan di sekitar wilayah Indonesia adalah...',
    options: [
      'Lempeng Eurasia, Indo-Australia, dan Pasifik',
      'Lempeng Antartika, Afrika, dan Amerika',
      'Lempeng Karibia, Arab, dan Nazca',
      'Lempeng Filipina, Skotlandia, dan Greenland'
    ],
    correctAnswer: 0,
    explanation: 'Indonesia merupakan titik temu 3 lempeng litosfer raksasa dunia: Lempeng Eurasia di utara, Indo-Australia di selatan, dan Pasifik di timur.'
  },
  {
    id: 15,
    type: 'true-false',
    category: 'cincin-api',
    categoryLabel: 'Jalur Cincin Api',
    question: 'Gunung api yang tumbuh di kawasan Selat Sunda setelah letusan dahsyat tahun 1883 dinamakan Anak Krakatau.',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    explanation: 'Benar. Gunung Anak Krakatau muncul pada tahun 1927 di kaldera bekas letusan besar Krakatau 1883.'
  },
  {
    id: 16,
    type: 'multiple-choice',
    category: 'cincin-api',
    categoryLabel: 'Jalur Cincin Api',
    question: 'Manfaat positif dari banyaknya gunung api aktif di jalur Cincin Api bagi perekonomian Indonesia adalah...',
    options: [
      'Sering menimbulkan kabut gelap sepanjang tahun',
      'Abu vulkanik menyuburkan tanah dan menyimpan potensi energi panas bumi (geotermal)',
      'Membatasi transportasi jalan raya antarkota',
      'Menyebabkan air laut menjadi selalu mendidih'
    ],
    correctAnswer: 1,
    explanation: 'Materi vulkanik kaya unsur hara yang menyuburkan lahan pertanian, serta aktivitas magma menyediakan potensi energi terbarukan berupa panas bumi (geotermal).'
  },
  {
    id: 17,
    type: 'true-false',
    category: 'cincin-api',
    categoryLabel: 'Jalur Cincin Api',
    question: 'Pulau Kalimantan adalah wilayah yang paling banyak memiliki gunung api aktif meletus di Indonesia.',
    options: ['Benar', 'Salah'],
    correctAnswer: 1,
    explanation: 'Salah. Pulau Kalimantan berada di lempeng yang relatif stabil dan tidak memiliki gunung api aktif, berbeda dengan Sumatra, Jawa, Bali, NTB, NTT, Maluku, dan Sulawesi.'
  },
  {
    id: 18,
    type: 'multiple-choice',
    category: 'cincin-api',
    categoryLabel: 'Jalur Cincin Api',
    question: 'Gunung tertinggi di Pulau Jawa yang memiliki puncak Mahameru dan merupakan gunung api aktif adalah...',
    options: [
      'Gunung Semeru (Jawa Timur)',
      'Gunung Tangkuban Parahu (Jawa Barat)',
      'Gunung Sinabung (Sumatera Utara)',
      'Gunung Lokon (Sulawesi Utara)'
    ],
    correctAnswer: 0,
    explanation: 'Gunung Semeru dengan ketinggian 3.676 mdpl merupakan gunung tertinggi di Pulau Jawa dan termasuk gunung api stratovolcano yang aktif.'
  },
  {
    id: 19,
    type: 'true-false',
    category: 'cincin-api',
    categoryLabel: 'Jalur Cincin Api',
    question: 'Gempa bumi tektonik terjadi akibat pergeseran mendadak pada lempeng kerak bumi di sepanjang zona patahan atau sesar.',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    explanation: 'Benar. Gempa tektonik disebabkan oleh pelepasan energi akibat patahnya atau bergesernya lempeng tektonik bumi.'
  },
  {
    id: 20,
    type: 'multiple-choice',
    category: 'cincin-api',
    categoryLabel: 'Jalur Cincin Api',
    question: 'Danau kawah di Flores (Nusa Tenggara Timur) yang terkenal karena memiliki tiga warna air yang berbeda adalah...',
    options: [
      'Danau Kelimutu',
      'Danau Toba',
      'Danau Singkarak',
      'Danau Poso'
    ],
    correctAnswer: 0,
    explanation: 'Danau Kelimutu berada di puncak Gunung Kelimutu dan terkenal di dunia karena memiliki tiga danau kawah dengan warna yang bisa berubah-ubah.'
  },
  {
    id: 21,
    type: 'true-false',
    category: 'cincin-api',
    categoryLabel: 'Jalur Cincin Api',
    question: 'Gempa bumi di laut dangkal dengan kekuatan besar (magnitudo tinggi) berpotensi memicu gelombang tsunami.',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    explanation: 'Benar. Pergeseran vertikal lempeng di dasar laut yang dangkal dengan magnitudo besar dapat memindahkan volume air laut secara tiba-tiba dan memicu tsunami.'
  },
  {
    id: 22,
    type: 'multiple-choice',
    category: 'cincin-api',
    categoryLabel: 'Jalur Cincin Api',
    question: 'Alat pengukur dan pencatat getaran gelombang gempa bumi disebut...',
    options: [
      'Seismograf',
      'Termometer',
      'Barometer',
      'Anemometer'
    ],
    correctAnswer: 0,
    explanation: 'Seismograf adalah instrumen ilmiah yang digunakan untuk mendeteksi, mengukur, dan merekam gelombang getaran gempa bumi.'
  },
  {
    id: 23,
    type: 'multiple-choice',
    category: 'cincin-api',
    categoryLabel: 'Jalur Cincin Api',
    question: 'Salah satu gunung api paling aktif di Indonesia yang terletak di perbatasan DIY dan Jawa Tengah adalah...',
    options: [
      'Gunung Merapi',
      'Gunung Batur',
      'Gunung Tambora',
      'Gunung Kerinci'
    ],
    correctAnswer: 0,
    explanation: 'Gunung Merapi merupakan salah satu gunung api paling aktif di dunia dengan siklus letusan teratur yang menghasilkan kubah lava dan awan panas guguran (wedhus gembel).'
  },
  {
    id: 24,
    type: 'true-false',
    category: 'cincin-api',
    categoryLabel: 'Jalur Cincin Api',
    question: 'Letusan dahsyat Gunung Tambora di Sumbawa pada tahun 1815 menyebabkan fenomena global "tahun tanpa musim panas" (year without summer) di Eropa dan Amerika Utara.',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    explanation: 'Benar. Debu dan gas sulfur letusan Tambora 1815 menutupi stratosfer bumi, menurunkan suhu global dan menyebabkan gagal panen di belahan bumi utara.'
  },
  {
    id: 25,
    type: 'multiple-choice',
    category: 'cincin-api',
    categoryLabel: 'Jalur Cincin Api',
    question: 'Energi ramah lingkungan yang memanfaatkan uap panas dari aktivitas magma gunung api di dalam bumi disebut...',
    options: [
      'Energi Geotermal (Panas Bumi)',
      'Energi Fosil',
      'Energi Batubara',
      'Energi Angin'
    ],
    correctAnswer: 0,
    explanation: 'Geotermal adalah energi panas bumi yang dihasilkan dari uap air bertekanan tinggi akibat panas magma di bawah permukaan kerak bumi.'
  },

  // ==========================================
  // TOPIK 3: NEGERI KEPULAUAN / MARITIM (12 Soal)
  // ==========================================
  {
    id: 26,
    type: 'multiple-choice',
    category: 'kepulauan',
    categoryLabel: 'Negeri Kepulauan',
    question: 'Perhatikan animasi kepulauan Indonesia. Sebagai negara maritim dan kepulauan terbesar, Indonesia memiliki lebih dari...',
    image: '/slide-kepulauan.gif',
    options: [
      '17.000 pulau yang tersebar dari Sabang sampai Merauke',
      '100 pulau besar saja',
      '50 pulau berpenghuni',
      '1.000 pulau karang tanpa perairan'
    ],
    correctAnswer: 0,
    explanation: 'Indonesia memiliki lebih dari 17.000 pulau dengan garis pantai terpanjang kedua di dunia, menjadikannya negara kepulauan (*archipelagic state*) terbesar di dunia.'
  },
  {
    id: 27,
    type: 'multiple-choice',
    category: 'kepulauan',
    categoryLabel: 'Negeri Kepulauan',
    question: 'Dua samudra besar yang mengapit kepulauan Indonesia adalah...',
    options: [
      'Samudra Pasifik dan Samudra Hindia',
      'Samudra Atlantik dan Samudra Arktik',
      'Samudra Antartika dan Laut Kaspia',
      'Samudra Atlantik dan Samudra Hindia'
    ],
    correctAnswer: 0,
    explanation: 'Wilayah geografis Indonesia terletak di antara dua samudra besar dunia: Samudra Pasifik di sebelah timur laut dan Samudra Hindia di sebelah barat daya.'
  },
  {
    id: 28,
    type: 'true-false',
    category: 'kepulauan',
    categoryLabel: 'Negeri Kepulauan',
    question: 'Bentuk geografis yang terpisah antarpulau melahirkan keberagaman suku, bahasa daerah, dan adat istiadat yang kaya di Indonesia.',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    explanation: 'Benar. Isolasi alami antarpulau selama berabad-abad mendorong masing-masing kelompok masyarakat mengembangkan budaya, bahasa daerah, dan tradisi lokal yang unik.'
  },
  {
    id: 29,
    type: 'multiple-choice',
    category: 'kepulauan',
    categoryLabel: 'Negeri Kepulauan',
    question: 'Tantangan utama yang dihadapi Indonesia sebagai negara kepulauan dalam bidang ekonomi dan distribusi barang adalah...',
    options: [
      'Biaya logistik dan kebutuhan transportasi laut/udara antarpulau',
      'Tidak tersedianya sumber makanan laut',
      'Tidak memiliki jalur pelayaran internasional',
      'Ketiadaan pelabuhan kapal laut'
    ],
    correctAnswer: 0,
    explanation: 'Konektivitas antarpulau menuntut pembangunan kapal, pelabuhan, dan jalur tol laut agar harga barang dan logistik merata di seluruh pelosok pulau.'
  },
  {
    id: 30,
    type: 'true-false',
    category: 'kepulauan',
    categoryLabel: 'Negeri Kepulauan',
    question: 'Dua benua yang mengapit posisi silang kepulauan Indonesia adalah Benua Asia dan Benua Australia.',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    explanation: 'Benar. Indonesia berada di posisi silang strategis antara Benua Asia di barat laut dan Benua Australia di tenggara.'
  },
  {
    id: 31,
    type: 'multiple-choice',
    category: 'kepulauan',
    categoryLabel: 'Negeri Kepulauan',
    question: 'Kapal tradisional layar legendaris asal suku Bugis dan Makassar yang diakui UNESCO sebagai warisan budaya dunia kebaharian adalah...',
    options: [
      'Kapal Pinisi',
      'Kapal Feri',
      'Kapal Kano',
      'Perahu Rakit'
    ],
    correctAnswer: 0,
    explanation: 'Kapal Pinisi adalah mahakarya seni pembuatan perahu layar tradisional suku Bugis-Makassar yang telah mengarungi samudra dunia sejak ratusan tahun silam.'
  },
  {
    id: 32,
    type: 'true-false',
    category: 'kepulauan',
    categoryLabel: 'Negeri Kepulauan',
    question: 'Luas wilayah perairan laut Indonesia lebih sempit dibandingkan dengan luas wilayah daratannya.',
    options: ['Benar', 'Salah'],
    correctAnswer: 1,
    explanation: 'Salah. Sekitar 2/3 dari total wilayah kedaulatan Indonesia adalah perairan laut (kurang lebih 3,25 juta km² lautan).'
  },
  {
    id: 33,
    type: 'multiple-choice',
    category: 'kepulauan',
    categoryLabel: 'Negeri Kepulauan',
    question: 'Garis batas khayal biogeografi yang memisahkan fauna tipe Asia dengan fauna tipe peralihan di Indonesia disebut...',
    options: [
      'Garis Wallace',
      'Garis Khatulistiwa',
      'Garis Bujur Greenwich',
      'Garis Pantai'
    ],
    correctAnswer: 0,
    explanation: 'Garis Wallace (dipetakan Alfred Russel Wallace) membatasi fauna tipe Asiatis di barat dengan fauna tipe peralihan/Sulawesi-Nusa Tenggara di bagian tengah.'
  },
  {
    id: 34,
    type: 'true-false',
    category: 'kepulauan',
    categoryLabel: 'Negeri Kepulauan',
    question: 'Sebagai negara maritim, sektor perikanan tangkap dan budidaya laut merupakan potensi sumber pangan dan protein penting bagi bangsa Indonesia.',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    explanation: 'Benar. Laut nusantara yang luas menyediakan kekayaan ikan pelagis, udang, rumput laut, dan mutiara bernilai ekonomi tinggi.'
  },
  {
    id: 35,
    type: 'multiple-choice',
    category: 'kepulauan',
    categoryLabel: 'Negeri Kepulauan',
    question: 'Pulau dengan luas daratan terluas di antara pulau-pulau di wilayah Indonesia adalah...',
    options: [
      'Pulau Kalimantan (dan Papua)',
      'Pulau Madura',
      'Pulau Bali',
      'Pulau Belitung'
    ],
    correctAnswer: 0,
    explanation: 'Pulau Papua dan Pulau Kalimantan merupakan pulau-pulau terbesar di wilayah nusantara yang memiliki tutupan hutan hujan luas.'
  },
  {
    id: 36,
    type: 'true-false',
    category: 'kepulauan',
    categoryLabel: 'Negeri Kepulauan',
    question: 'Sebagian besar pemukiman dan pusat aktivitas ekonomi masyarakat di kepulauan Indonesia terkonsentrasi di kawasan pesisir pantai.',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    explanation: 'Benar. Kawasan pesisir menjadi pusat pemukiman dan perdagangan strategis karena dekat dengan pelabuhan dan sarana transportasi laut.'
  },
  {
    id: 37,
    type: 'multiple-choice',
    category: 'kepulauan',
    categoryLabel: 'Negeri Kepulauan',
    question: 'Deklarasi bersejarah pada 13 Desember 1957 yang menyatukan seluruh wilayah laut antarpulau menjadi satu kesatuan wilayah kedaulatan Indonesia adalah...',
    options: [
      'Deklarasi Djuanda',
      'Deklarasi Linggarjati',
      'Konferensi Meja Bundar',
      'Dekrit Presiden'
    ],
    correctAnswer: 0,
    explanation: 'Deklarasi Djuanda 1957 menegaskan bahwa laut di antara pulau-pulau nusantara adalah bagian integral dari kedaulatan Republik Indonesia.'
  },

  // ==========================================
  // TOPIK 4: MITIGASI BENCANA GEMPA (13 Soal)
  // ==========================================
  {
    id: 38,
    type: 'multiple-choice',
    category: 'mitigasi',
    categoryLabel: 'Mitigasi Gempa Bumi',
    question: 'Perhatikan gambar berikut. Saat terjadi guncangan gempa bumi keras di dalam ruangan, tindakan penyelamatan 3 langkah emas yang tepat adalah...',
    image: '/mitigasi-saat-1.jpg',
    options: [
      'Drop (Merunduk), Cover (Berlindung di bawah meja kokoh), Hold On (Berpegangan erat)',
      'Berlari panik mencari lift agar cepat turun',
      'Berdiri di dekat jendela kaca dan berteriak sekencang mungkin',
      'Menaiki atap gedung untuk meminta pertolongan'
    ],
    correctAnswer: 0,
    explanation: 'Prinsip perlindungan diri standar saat gempa adalah "Drop, Cover, and Hold On" (Merunduk, Lindungi Kepala/Berlindung di Bawah Meja, dan Berpegangan).'
  },
  {
    id: 39,
    type: 'multiple-choice',
    category: 'mitigasi',
    categoryLabel: 'Mitigasi Gempa Bumi',
    question: 'Perhatikan perlengkapan pada gambar. Benda ini harus disiapkan keluarga sebelum bencana terjadi dan mudah diraih saat darurat. Benda ini adalah...',
    image: '/mitigasi-sebelum-4.jpg',
    options: [
      'Tas Siaga Bencana (Emergency Kit)',
      'Koper pakaian liburan akhir tahun',
      'Kotak peralatan elektronik komputer',
      'Keranjang belanja supermarket'
    ],
    correctAnswer: 0,
    explanation: 'Tas Siaga Bencana (TSB) berisi dokumen penting, P3K, makanan tahan lama, air minum, senter, peluit, dan radio baterai untuk bertahan selama 72 jam pertama.'
  },
  {
    id: 40,
    type: 'true-false',
    category: 'mitigasi',
    categoryLabel: 'Mitigasi Gempa Bumi',
    question: 'Ketika gempa bumi terjadi di gedung bertingkat, kita dilarang menggunakan lift dan harus menggunakan tangga darurat untuk evakuasi.',
    image: '/mitigasi-saat-2.jpg',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    explanation: 'Benar. Gempa bumi dapat memutus aliran listrik dan merusak rel elevator, sehingga Anda berisiko tinggi terjebak di dalam lift jika menggunakannya.'
  },
  {
    id: 41,
    type: 'multiple-choice',
    category: 'mitigasi',
    categoryLabel: 'Mitigasi Gempa Bumi',
    question: 'Perhatikan gambar evakuasi ini. Apa yang harus dilakukan jika Anda berada di ruang terbuka saat terjadi gempa bumi?',
    image: '/mitigasi-saat-3.jpg',
    options: [
      'Menjauhi tiang listrik, baliho, pohon tua, dan dinding bangunan yang rawan roboh',
      'Berdiri tepat di bawah pohon besar yang rindang',
      'Mendekat ke dinding pagar tembok rumah',
      'Berlindung di bawah jembatan layang'
    ],
    correctAnswer: 0,
    explanation: 'Di luar ruangan, segera cari tempat lapang dan jauhi benda-benda tinggi yang dapat tumbang menimpa Anda seperti tiang listrik, papan reklame, dan bangunan.'
  },
  {
    id: 42,
    type: 'true-false',
    category: 'mitigasi',
    categoryLabel: 'Mitigasi Gempa Bumi',
    question: 'Jika setelah gempa bumi kuat air laut di pantai surut secara cepat dan tiba-tiba, itu merupakan pertanda bahaya tsunami sehingga harus segera lari ke tempat tinggi.',
    image: '/mitigasi-saat-4.jpg',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    explanation: 'Benar! Air laut surut drastis merupakan tanda hisapan tsunami akibat patahan bawah laut. Jangan mendekat memungut ikan, tetapi segera evakuasi ke tempat tinggi!'
  },
  {
    id: 43,
    type: 'multiple-choice',
    category: 'mitigasi',
    categoryLabel: 'Mitigasi Gempa Bumi',
    question: 'Langkah persiapan mitigasi sebelum gempa yang dilakukan terhadap lemari dan perabotan berat di rumah adalah...',
    image: '/mitigasi-sebelum-2.gif',
    options: [
      'Mengunci atau memaku lemari ke dinding agar tidak roboh menimpa orang saat berguncang',
      'Menumpuk barang pecah belah di rak paling atas lemari',
      'Meletakkan lemari tepat di depan pintu keluar utama',
      'Melumuri kaki lemari dengan minyak pelicin'
    ],
    correctAnswer: 0,
    explanation: 'Memasang pengait siku (bracket) pada lemari berat ke dinding mencegah perabot tumbang dan menghalangi jalur keluar saat gempa.'
  },
  {
    id: 44,
    type: 'multiple-choice',
    category: 'mitigasi',
    categoryLabel: 'Mitigasi Gempa Bumi',
    question: 'Perhatikan gambar berikut. Setelah guncangan gempa utama mereda, ke mana tujuan evakuasi yang aman bagi warga dan siswa sekolah?',
    image: '/mitigasi-setelah-1.jpg',
    options: [
      'Titik kumpul (*Assembly Point*) di area terbuka yang lapang dan aman',
      'Kembali ke dalam kamar tidur untuk tidur',
      'Masuk ke dalam basement gedung',
      'Bersembunyi di dalam kamar mandi'
    ],
    correctAnswer: 0,
    explanation: 'Titik kumpul di lapangan terbuka merupakan tempat paling aman untuk mendata korban dan menghindari risiko tertimpa reruntuhan gempa susulan.'
  },
  {
    id: 45,
    type: 'true-false',
    category: 'mitigasi',
    categoryLabel: 'Mitigasi Gempa Bumi',
    question: 'Setelah gempa terjadi, kita boleh menyalakan korek api atau kompor gas di dalam ruangan tanpa memeriksa ada tidaknya kebocoran gas terlebih dahulu.',
    options: ['Benar', 'Salah'],
    correctAnswer: 1,
    explanation: 'Salah. Jangan menyalakan api atau sakelar listrik sebelum memastikan tidak ada kebocoran gas pipa/tabung LPG yang berisiko memicu ledakan kebakaran.'
  },
  {
    id: 46,
    type: 'multiple-choice',
    category: 'mitigasi',
    categoryLabel: 'Mitigasi Gempa Bumi',
    question: 'Perhatikan gambar berikut. Fenomena getaran gempa susulan (*aftershocks*) yang terjadi setelah gempa utama memiliki karakteristik...',
    image: '/mitigasi-setelah-3.jpg',
    options: [
      'Dapat terjadi beberapa menit, jam, hingga hari setelah gempa utama dengan kekuatan fluktuatif',
      'Pasti berjarak waktu tepat 1 tahun setelah gempa',
      'Hanya bisa dirasakan oleh hewan burung di langit',
      'Tidak berbahaya sama sekali bagi bangunan yang sudah retak'
    ],
    correctAnswer: 0,
    explanation: 'Gempa susulan (*aftershocks*) dapat meruntuhkan bangunan yang sudah retak struktur akibat gempa pertama. Selalu waspada dan gunakan tenda luar jika rumah rusak.'
  },
  {
    id: 47,
    type: 'multiple-choice',
    category: 'mitigasi',
    categoryLabel: 'Mitigasi Gempa Bumi',
    question: 'Lembaga resmi pemerintah Indonesia yang bertugas memantau, mengukur, dan mengumumkan informasi gempa bumi dan peringatan dini tsunami adalah...',
    options: [
      'BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)',
      'Kementerian Keuangan',
      'Dinas Kebersihan dan Pertamanan',
      'Bursa Efek Indonesia'
    ],
    correctAnswer: 0,
    explanation: 'BMKG adalah instansi resmi negara yang menyiarkan data gempa bumi riil (pusat gempa/episentrum, magnitudo, kedalaman, dan potensi tsunami).'
  },
  {
    id: 48,
    type: 'true-false',
    category: 'mitigasi',
    categoryLabel: 'Mitigasi Gempa Bumi',
    question: 'Meneruskan pesan berantai dari media sosial yang belum jelas sumbernya tentang isu tanggal gempa besar adalah tindakan bijak dalam mitigasi bencana.',
    options: ['Benar', 'Salah'],
    correctAnswer: 1,
    explanation: 'Salah. Gempa bumi hingga kini belum dapat diprediksi hari dan jam terjadinya secara pasti oleh teknologi manapun. Jangan menyebarkan hoaks yang meresahkan!'
  },
  {
    id: 49,
    type: 'multiple-choice',
    category: 'mitigasi',
    categoryLabel: 'Mitigasi Gempa Bumi',
    question: 'Nomor panggilan darurat terpadu nasional di Indonesia yang dapat dihubungi untuk bantuan bencana adalah...',
    options: [
      '112',
      '007',
      '404',
      '999'
    ],
    correctAnswer: 0,
    explanation: 'Nomor telepon 112 adalah Layanan Panggilan Darurat Tunggal (*Emergency Call*) bebas pulsa di kota/kabupaten di Indonesia.'
  },
  {
    id: 50,
    type: 'true-false',
    category: 'mitigasi',
    categoryLabel: 'Mitigasi Gempa Bumi',
    question: 'Simulasi gempa bumi secara berkala di sekolah membuat siswa dan guru lebih tenang, tidak panik, dan terbiasa mengevakuasi diri dengan tertib.',
    image: '/mitigasi-sebelum-3.gif',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    explanation: 'Benar. Latihan simulasi rutin membentuk memori gerak refleks sehingga saat bencana sesungguhnya terjadi, murid dan guru siap bertindak cepat tanpa panik.'
  }
];

/**
 * Mengambil N soal acak dari Bank Soal tanpa duplikasi (Fisher-Yates Shuffle)
 */
export function getRandomQuizQuestions(count = 10): QuizQuestion[] {
  const shuffled = [...QUIZ_BANK];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
