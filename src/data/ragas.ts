export interface RagaInfo {
  name: string;
  melakarta: number;
  aarohana: string;
  avarohana: string;
  meaning?: string;
  chakra?: string;
  parentMelakarta?: number;
  famousComposition?: string;
}

const melakartaNames: string[] = [
  "Kanakangi",
  "Ratnangi",
  "Ganamurthi",
  "Vanaspathi",
  "Manavati",
  "Tanarupi",
  "Senavati",
  "Hanumatodi",
  "Dhenuka",
  "Natakapriya",
  "Kokilapriya",
  "Rupavati",
  "Gayakapriya",
  "Vakulabharanam",
  "Mayamalavagowla",
  "Chakravakam",
  "Suryakantam",
  "Hatakambari",
  "Jhankaradhwani",
  "Natabhairavi",
  "Keeravani",
  "Kharaharapriya",
  "Gaurimanohari",
  "Varunapriya",
  "Mararanjani",
  "Charukesi",
  "Sarasangi",
  "Harikambhoji",
  "Dheerasankarabharanam",
  "Naganandini",
  "Yagapriya",
  "Ragavardhini",
  "Gangeyabhushani",
  "Vagadheeswari",
  "Sulini",
  "Chalanata",
  "Salagam",
  "Jalarnavam",
  "Jhalavarali",
  "Navaneetam",
  "Pavani",
  "Raghupriya",
  "Gavambhodi",
  "Bhavapriya",
  "Shubhapantuvarali",
  "Shadvidhamargini",
  "Suvarnangi",
  "Divyamani",
  "Dhavalambari",
  "Namanarayani",
  "Kamavardhini",
  "Ramapriya",
  "Gamanashrama",
  "Vishwambari",
  "Syamalangi",
  "Shanmukhapriya",
  "Simhendramadhyamam",
  "Hemavati",
  "Dharmavati",
  "Neetimati",
  "Kantamani",
  "Rishabhapriya",
  "Latangi",
  "Vachaspati",
  "Mechakalyani",
  "Chitrambari",
  "Sucharitra",
  "Jyotiswarupini",
  "Dhatuvardani",
  "Nasikabhooshani",
  "Kosalam",
  "Rasikapriya",
];

const swaraLabels: Record<string, string> = {
  R1: "R₁",
  R2: "R₂",
  R3: "R₃",
  G1: "G₁",
  G2: "G₂",
  G3: "G₃",
  M1: "M₁",
  M2: "M₂",
  D1: "D₁",
  D2: "D₂",
  D3: "D₃",
  N1: "N₁",
  N2: "N₂",
  N3: "N₃",
};

const rgMap: [string, string][] = [
  ["R1", "G1"],
  ["R1", "G2"],
  ["R1", "G3"],
  ["R2", "G2"],
  ["R2", "G3"],
  ["R3", "G3"],
];

const dnMap: [string, string][] = [
  ["D1", "N1"],
  ["D1", "N2"],
  ["D1", "N3"],
  ["D2", "N2"],
  ["D2", "N3"],
  ["D3", "N3"],
];

function generateMelakartaScale(melakartaNum: number): {
  aarohana: string;
  avarohana: string;
} {
  const idx = melakartaNum - 1;
  const chakra = Math.floor(idx / 6);
  const pos = idx % 6;
  const [r, g] = rgMap[chakra % 6];
  const m = chakra < 6 ? "M1" : "M2";
  const [d, n] = dnMap[pos];
  const aarohana = `S ${swaraLabels[r]} ${swaraLabels[g]} ${swaraLabels[m]} P ${swaraLabels[d]} ${swaraLabels[n]} Ṡ`;
  const avarohana = `Ṡ ${swaraLabels[n]} ${swaraLabels[d]} P ${swaraLabels[m]} ${swaraLabels[g]} ${swaraLabels[r]} S`;
  return { aarohana, avarohana };
}

const ragaData: Record<string, RagaInfo> = {};

const chakraNames: string[] = [
  "Indu",
  "Netra",
  "Agni",
  "Veda",
  "Bana",
  "Ruthu",
  "Rishi",
  "Vasu",
  "Brahma",
  "Disi",
  "Rudra",
  "Aditya",
];

const famousByChakra: string[] = [
  "Sri Kanakangi Mala (Mutthuswami Dikshitar)",
  "Ratnangi (Koteeswara Iyer)",
  "Ganamurthi (Koteeswara Iyer)",
  "Sree Vanaspathi (Mutthuswami Dikshitar)",
  "Manavathi (Koteeswara Iyer)",
  "Tanarupi (Koteeswara Iyer)",
  "Senavathi (Koteeswara Iyer)",
  "Hanumatodi - Sree Sita Rama (Thyagaraja)",
  "Dhenuka (Koteeswara Iyer)",
  "Natakapriya (Koteeswara Iyer)",
  "Kokilapriya (Koteeswara Iyer)",
  "Rupavathi (Koteeswara Iyer)",
  "Gayakapriya (Koteeswara Iyer)",
  "Vakulabharanam (Koteeswara Iyer)",
  "Mayamalavagowla - Sree Gananatha (Mutthuswami Dikshitar)",
  "Chakravakam (Koteeswara Iyer)",
  "Suryakantam (Koteeswara Iyer)",
  "Hatakambari (Koteeswara Iyer)",
  "Jhankaradhwani (Koteeswara Iyer)",
  "Natabhairavi - Sree Saraswati Namustute (Mutthuswami Dikshitar)",
  "Keeravani - Sree Krishna (Mutthuswami Dikshitar)",
  "Kharaharapriya - Rama Nee Samanamevaru (Thyagaraja)",
  "Gaurimanohari (Koteeswara Iyer)",
  "Varunapriya (Koteeswara Iyer)",
  "Mararanjani (Koteeswara Iyer)",
  "Charukesi - Aadamodiche (Thyagaraja)",
  "Sarasangi (Koteeswara Iyer)",
  "Harikambhoji - Rara Sree Rama (Thyagaraja)",
  "Sankarabharanam - Endaro Mahanubhavulu (Thyagaraja)",
  "Naganandini (Koteeswara Iyer)",
  "Yagapriya (Koteeswara Iyer)",
  "Ragavardhini (Koteeswara Iyer)",
  "Gangeyabhushani (Koteeswara Iyer)",
  "Vagadheeswari (Koteeswara Iyer)",
  "Sulini (Koteeswara Iyer)",
  "Chalanata (Koteeswara Iyer)",
  "Salagam (Koteeswara Iyer)",
  "Jalarnavam (Koteeswara Iyer)",
  "Jhalavarali (Koteeswara Iyer)",
  "Navaneetam (Koteeswara Iyer)",
  "Pavani (Koteeswara Iyer)",
  "Raghupriya (Koteeswara Iyer)",
  "Gavambhodi (Koteeswara Iyer)",
  "Bhavapriya (Koteeswara Iyer)",
  "Shubhapantuvarali - Sree Kamalambika (Mutthuswami Dikshitar)",
  "Shadvidhamargini (Koteeswara Iyer)",
  "Suvarnangi (Koteeswara Iyer)",
  "Divyamani (Koteeswara Iyer)",
  "Dhavalambari (Koteeswara Iyer)",
  "Namanarayani (Koteeswara Iyer)",
  "Pantuvarali - Sree Saraswati (Mutthuswami Dikshitar)",
  "Ramapriya (Koteeswara Iyer)",
  "Gamanashrama (Koteeswara Iyer)",
  "Vishwambari (Koteeswara Iyer)",
  "Syamalangi (Koteeswara Iyer)",
  "Shanmukhapriya - Sree Subramanyaya (Mutthuswami Dikshitar)",
  "Simhendramadhyamam - Neekela Naerpo (Poochi Srinivasa Iyengar)",
  "Hemavati (Koteeswara Iyer)",
  "Dharmavati - Sree Dharmavati (Mutthuswami Dikshitar)",
  "Neetimati (Koteeswara Iyer)",
  "Kantamani (Koteeswara Iyer)",
  "Rishabhapriya (Koteeswara Iyer)",
  "Latangi (Koteeswara Iyer)",
  "Vachaspati - Bhanu Bhanu (M. Balamuralikrishna)",
  "Mechakalyani - Nidhi Chala Sukhama (Thyagaraja)",
  "Chitrambari (Koteeswara Iyer)",
  "Sucharitra (Koteeswara Iyer)",
  "Jyotiswarupini (Koteeswara Iyer)",
  "Dhatuvardani (Koteeswara Iyer)",
  "Nasikabhooshani (Koteeswara Iyer)",
  "Kosalam (Koteeswara Iyer)",
  "Rasikapriya - Nagumomo (Thyagaraja)",
];

melakartaNames.forEach((name, i) => {
  const num = i + 1;
  const chakraIdx = Math.floor(i / 6);
  const { aarohana, avarohana } = generateMelakartaScale(num);
  ragaData[name] = {
    name,
    melakarta: num,
    aarohana,
    avarohana,
    chakra: chakraNames[chakraIdx],
    famousComposition: famousByChakra[i],
  };
});

ragaData["Todi"] = ragaData["Hanumatodi"];
ragaData["Sankarabharanam"] = ragaData["Dheerasankarabharanam"];
ragaData["Kalyani"] = ragaData["Mechakalyani"];
ragaData["Pantuvarali"] = ragaData["Kamavardhini"];
ragaData["Charukeshi"] = ragaData["Charukesi"];

const janyaRagas: RagaInfo[] = [
  {
    name: "Bhairavi",
    melakarta: 0,
    parentMelakarta: 20,
    aarohana: "S G₂ R₂ G₂ M₁ P D₂ N₂ Ṡ",
    avarohana: "Ṡ N₂ D₁ P M₁ G₂ R₂ S",
    meaning: "The awe-inspiring goddess",
    famousComposition: "Balagopaala (Mutthuswami Dikshitar)",
  },
  {
    name: "Anandabhairavi",
    melakarta: 0,
    parentMelakarta: 20,
    aarohana: "S G₂ R₂ G₂ M₁ P D₂ P Ṡ",
    avarohana: "Ṡ N₂ D₂ P M₁ G₂ R₂ S",
    meaning: "The joyful Bhairavi",
    famousComposition: "Sree Parameswari (Mutthuswami Dikshitar)",
  },
  {
    name: "Varali",
    melakarta: 0,
    parentMelakarta: 39,
    aarohana: "S R₁ G₂ M₂ P D₁ N₂ Ṡ",
    avarohana: "Ṡ N₂ D₁ P M₂ G₂ R₁ S",
    meaning: "The fierce one",
    famousComposition: "Bhajana Seyada (Thyagaraja)",
  },
  {
    name: "Saveri",
    melakarta: 0,
    parentMelakarta: 15,
    aarohana: "S R₁ M₁ P D₁ S",
    avarohana: "S N₃ D₁ P M₁ G₁ R₁ S",
    famousComposition: "Intha Chalamu (Thyagaraja)",
  },
  {
    name: "Begada",
    melakarta: 0,
    parentMelakarta: 29,
    aarohana: "S G₃ R₂ G₃ M₁ P D₂ P Ṡ",
    avarohana: "Ṡ N₃ D₂ P M₁ G₃ R₂ S",
    famousComposition: "Nada Loludai (Thyagaraja)",
  },
  {
    name: "Bilahari",
    melakarta: 0,
    parentMelakarta: 29,
    aarohana: "S R₂ G₃ P D₂ Ṡ",
    avarohana: "Ṡ N₃ D₂ P M₁ G₃ R₂ S",
    famousComposition: "Dorasuke Ituvanti (Thyagaraja)",
  },
  {
    name: "Mohanam",
    melakarta: 0,
    parentMelakarta: 28,
    aarohana: "S R₂ G₃ P D₂ Ṡ",
    avarohana: "Ṡ D₂ P G₃ R₂ S",
    meaning: "The enchanting one",
    famousComposition: "Nannu Palimpa (Thyagaraja)",
  },
  {
    name: "Hamsadhvani",
    melakarta: 0,
    parentMelakarta: 29,
    aarohana: "S R₂ G₃ P N₃ Ṡ",
    avarohana: "Ṡ N₃ P G₃ R₂ S",
    meaning: "The call of the swan",
    famousComposition: "Vatapi Ganapatim (Mutthuswami Dikshitar)",
  },
  {
    name: "Abhogi",
    melakarta: 0,
    parentMelakarta: 22,
    aarohana: "S R₂ G₂ M₁ D₂ Ṡ",
    avarohana: "Ṡ D₂ M₁ G₂ R₂ S",
    famousComposition: "Sabhapathiki Unnade (Thyagaraja)",
  },
  {
    name: "Hindolam",
    melakarta: 0,
    parentMelakarta: 20,
    aarohana: "S G₂ M₁ D₁ N₂ Ṡ",
    avarohana: "Ṡ N₂ D₁ M₁ G₂ S",
    famousComposition: "Maa Ramanan (Papanasam Sivan)",
  },
  {
    name: "Madhyamavathi",
    melakarta: 0,
    parentMelakarta: 22,
    aarohana: "S R₂ M₁ P N₂ Ṡ",
    avarohana: "Ṡ N₂ P M₁ R₂ S",
    famousComposition: "Sree Subramanyaya Namaste (Mutthuswami Dikshitar)",
  },
  {
    name: "Sri Ranjani",
    melakarta: 0,
    parentMelakarta: 22,
    aarohana: "S R₂ G₂ M₁ D₂ N₂ Ṡ",
    avarohana: "Ṡ N₂ D₂ M₁ G₂ R₂ S",
    famousComposition: "Parama Pavana (Thyagaraja)",
  },
  {
    name: "Nata",
    melakarta: 0,
    parentMelakarta: 36,
    aarohana: "S R₃ G₃ M₁ P D₃ N₃ Ṡ",
    avarohana: "Ṡ N₃ D₃ P M₁ G₃ R₃ S",
    famousComposition: "Rara Sree Rama (Thyagaraja)",
  },
  {
    name: "Atana",
    melakarta: 0,
    parentMelakarta: 29,
    aarohana: "S R₂ M₁ P N₃ Ṡ",
    avarohana: "Ṡ N₃ D₂ P M₁ G₃ R₂ S",
    famousComposition: "Sree Raghuvara (Thyagaraja)",
  },
  {
    name: "Kambhoji",
    melakarta: 0,
    parentMelakarta: 28,
    aarohana: "S R₂ G₃ M₁ P D₂ Ṡ",
    avarohana: "Ṡ N₂ D₂ P M₁ G₃ R₂ S",
    famousComposition: "O Ranga Nayaka (Thyagaraja)",
  },
  {
    name: "Yadukulakambhoji",
    melakarta: 0,
    parentMelakarta: 28,
    aarohana: "S R₂ M₁ P D₂ Ṡ",
    avarohana: "Ṡ N₂ D₂ P M₁ G₃ R₂ S",
    famousComposition: "Sree Krishna (Mutthuswami Dikshitar)",
  },
  {
    name: "Kapi",
    melakarta: 0,
    parentMelakarta: 22,
    aarohana: "S R₂ G₂ M₁ P D₂ N₂ Ṡ",
    avarohana: "Ṡ N₂ D₂ P M₁ G₂ R₂ S",
    famousComposition: "Sree Saraswati (Mutthuswami Dikshitar)",
  },
  {
    name: "Sahana",
    melakarta: 0,
    parentMelakarta: 28,
    aarohana: "S R₂ G₃ M₁ P M₁ D₂ N₃ Ṡ",
    avarohana: "Ṡ N₃ D₂ P M₁ G₃ R₂ S",
    famousComposition: "Sreemathe Raghavendra (Thyagaraja)",
  },
  {
    name: "Gambeeranattai",
    melakarta: 0,
    parentMelakarta: 36,
    aarohana: "S R₃ G₃ P D₃ N₃ Ṡ",
    avarohana: "Ṡ N₃ D₃ P G₃ R₃ S",
    famousComposition: "Sree Veera Hanuman (Mutthuswami Dikshitar)",
  },
  {
    name: "Behag",
    melakarta: 0,
    parentMelakarta: 28,
    aarohana: "S G₃ R₂ G₃ M₁ P D₂ N₃ D₂ Ṡ",
    avarohana: "Ṡ N₃ D₂ P M₁ G₃ R₂ S",
  },
  {
    name: "Surati",
    melakarta: 0,
    parentMelakarta: 28,
    aarohana: "S R₂ M₁ P N₂ Ṡ",
    avarohana: "Ṡ N₂ D₂ P M₁ G₃ R₂ S",
    meaning: "A pleasing melody",
    famousComposition: "Sree Saraswati Namustute (Mutthuswami Dikshitar)",
  },
  {
    name: "Arabhi",
    melakarta: 0,
    parentMelakarta: 29,
    aarohana: "S R₂ M₁ P D₂ Ṡ",
    avarohana: "Ṡ N₃ D₂ P M₁ G₃ R₂ S",
    famousComposition: "Sree Raghuvaraprameya (Thyagaraja)",
  },
  {
    name: "Darbar",
    melakarta: 0,
    parentMelakarta: 22,
    aarohana: "S R₂ M₁ P D₂ N₂ Ṡ",
    avarohana: "Ṡ N₂ D₂ P M₁ G₂ R₂ S",
  },
  {
    name: "Neelambari",
    melakarta: 0,
    parentMelakarta: 29,
    aarohana: "S R₂ G₃ P D₂ Ṡ",
    avarohana: "Ṡ N₃ D₂ P M₁ G₃ R₂ S",
    meaning: "The blue-hued one",
  },
  {
    name: "Sindhubhairavi",
    melakarta: 0,
    parentMelakarta: 20,
    aarohana: "S R₂ G₂ M₁ P D₁ N₂ Ṡ",
    avarohana: "Ṡ N₂ D₁ P M₁ G₂ R₂ S",
  },
  {
    name: "Desh",
    melakarta: 0,
    parentMelakarta: 28,
    aarohana: "S R₂ M₁ P N₃ Ṡ",
    avarohana: "Ṡ N₂ D₂ P M₁ G₃ R₂ S",
  },
  {
    name: "Purnachandrika",
    melakarta: 0,
    parentMelakarta: 29,
    aarohana: "S G₃ P D₂ Ṡ",
    avarohana: "Ṡ D₂ P G₃ R₂ S",
    meaning: "Full moon",
  },
  {
    name: "Valaji",
    melakarta: 0,
    parentMelakarta: 28,
    aarohana: "S G₃ P N₃ Ṡ",
    avarohana: "Ṡ N₃ P G₃ S",
  },
  {
    name: "Navroj",
    melakarta: 0,
    parentMelakarta: 29,
    aarohana: "S R₂ G₃ M₁ P M₁ D₂ N₃ Ṡ",
    avarohana: "Ṡ N₃ D₂ P M₁ G₃ R₂ S",
  },
  {
    name: "Kedaram",
    melakarta: 0,
    parentMelakarta: 29,
    aarohana: "S M₁ G₃ M₁ P N₃ Ṡ",
    avarohana: "Ṡ N₃ P M₁ G₃ R₂ S",
  },
  {
    name: "Mukhari",
    melakarta: 0,
    parentMelakarta: 22,
    aarohana: "S R₂ M₁ P D₂ N₂ Ṡ",
    avarohana: "Ṡ N₂ D₂ P M₁ G₂ R₂ S",
  },
  {
    name: "Chenchurutti",
    melakarta: 0,
    parentMelakarta: 28,
    aarohana: "S R₂ G₃ M₁ P D₂ Ṡ",
    avarohana: "Ṡ N₃ D₂ P M₁ G₃ R₂ S",
  },
  {
    name: "Kurinji",
    melakarta: 0,
    parentMelakarta: 22,
    aarohana: "S R₂ G₂ M₁ N₂ D₂ Ṡ",
    avarohana: "Ṡ N₂ D₂ P M₁ G₂ R₂ S",
    meaning: "The hilly region",
    famousComposition: "Kumaraswaminam (Mutthuswami Dikshitar)",
  },
  {
    name: "Saraswathi",
    melakarta: 0,
    parentMelakarta: 29,
    aarohana: "S R₂ M₁ P D₂ Ṡ",
    avarohana: "Ṡ N₃ D₂ P M₁ G₃ R₂ S",
  },
  {
    name: "Vasantha",
    melakarta: 0,
    parentMelakarta: 29,
    aarohana: "S G₃ M₁ D₂ N₃ Ṡ",
    avarohana: "Ṡ N₃ D₂ M₁ G₃ R₂ S",
    meaning: "The spring season",
    famousComposition: "Sree Vasantha (Thyagaraja)",
  },
  {
    name: "Bhimpalas",
    melakarta: 0,
    parentMelakarta: 22,
    aarohana: "S G₂ R₂ G₂ M₁ P D₂ N₂ Ṡ",
    avarohana: "Ṡ N₂ D₂ P M₁ G₂ R₂ S",
  },
  {
    name: "Bowli",
    melakarta: 0,
    parentMelakarta: 20,
    aarohana: "S R₂ G₂ P D₂ Ṡ",
    avarohana: "Ṡ D₂ P G₂ R₂ S",
  },
  {
    name: "Huseni",
    melakarta: 0,
    parentMelakarta: 22,
    aarohana: "S R₂ G₂ M₁ P D₂ N₂ Ṡ",
    avarohana: "Ṡ N₂ D₂ P M₁ G₂ R₂ S",
  },
  {
    name: "Ranjani",
    melakarta: 0,
    parentMelakarta: 22,
    aarohana: "S R₂ G₂ M₁ P D₂ N₂ Ṡ",
    avarohana: "Ṡ D₂ N₂ P M₁ G₂ R₂ S",
    meaning: "The delight-giving one",
  },
  {
    name: "Punnagavarali",
    melakarta: 0,
    parentMelakarta: 20,
    aarohana: "S R₁ G₂ M₁ P D₁ N₂ Ṡ",
    avarohana: "Ṡ N₂ D₁ P M₁ G₂ R₁ S",
    famousComposition: "Sree Kamakshi (Mutthuswami Dikshitar)",
  },
  {
    name: "Lalita",
    melakarta: 0,
    parentMelakarta: 20,
    aarohana: "S R₂ G₂ M₁ P D₂ N₂ Ṡ",
    avarohana: "Ṡ D₂ N₂ P M₁ G₂ R₂ S",
  },
  {
    name: "Kokilavarali",
    melakarta: 0,
    parentMelakarta: 20,
    aarohana: "S G₂ R₂ G₂ M₁ D₂ N₂ Ṡ",
    avarohana: "Ṡ N₂ D₂ P M₁ G₂ R₂ S",
  },
  {
    name: "Ravichandrika",
    melakarta: 0,
    parentMelakarta: 28,
    aarohana: "S R₂ M₁ P N₃ Ṡ",
    avarohana: "Ṡ N₃ P M₁ G₃ R₂ S",
  },
  {
    name: "Reethigowla",
    melakarta: 0,
    parentMelakarta: 22,
    aarohana: "S G₂ R₂ G₂ M₁ P D₂ P Ṡ",
    avarohana: "Ṡ N₂ D₂ P M₁ G₂ R₂ S",
    famousComposition: "Raghuvamsa Sudha (Thyagaraja)",
  },
  {
    name: "Nagaswaravali",
    melakarta: 0,
    parentMelakarta: 28,
    aarohana: "S R₂ G₃ P D₂ Ṡ",
    avarohana: "Ṡ N₃ D₂ P M₁ G₃ R₂ S",
  },
  {
    name: "Sourashtram",
    melakarta: 0,
    parentMelakarta: 22,
    aarohana: "S R₂ M₁ P D₂ Ṡ",
    avarohana: "Ṡ N₂ D₂ P M₁ G₂ R₂ S",
  },
  {
    name: "Manirangu",
    melakarta: 0,
    parentMelakarta: 22,
    aarohana: "S R₂ M₁ P N₂ Ṡ",
    avarohana: "Ṡ N₂ P M₁ G₂ R₂ S",
  },
  {
    name: "Nalinakanti",
    melakarta: 0,
    parentMelakarta: 22,
    aarohana: "S R₂ G₂ M₁ P D₂ Ṡ",
    avarohana: "Ṡ D₂ P M₁ G₂ R₂ S",
  },
  {
    name: "Devagandhari",
    melakarta: 0,
    parentMelakarta: 29,
    aarohana: "S R₂ M₁ P N₃ Ṡ",
    avarohana: "Ṡ N₃ D₂ P M₁ G₃ R₂ S",
  },
  {
    name: "Salagabhairavi",
    melakarta: 0,
    parentMelakarta: 29,
    aarohana: "S R₂ G₃ M₁ P D₂ N₃ Ṡ",
    avarohana: "Ṡ N₃ D₂ P M₁ G₃ R₂ S",
  },
  {
    name: "Kannada",
    melakarta: 0,
    parentMelakarta: 28,
    aarohana: "S G₃ M₁ D₂ N₃ Ṡ",
    avarohana: "Ṡ N₃ D₂ P M₁ G₃ R₂ S",
  },
  {
    name: "Bahudari",
    melakarta: 0,
    parentMelakarta: 28,
    aarohana: "S R₂ G₃ M₁ P D₂ Ṡ",
    avarohana: "Ṡ N₃ D₂ P M₁ G₃ R₂ S",
  },
  {
    name: "Chandrakauns",
    melakarta: 0,
    parentMelakarta: 22,
    aarohana: "S G₂ M₁ D₂ N₂ Ṡ",
    avarohana: "Ṡ N₂ D₂ M₁ G₂ S",
  },
  {
    name: "Jog",
    melakarta: 0,
    parentMelakarta: 22,
    aarohana: "S R₂ G₂ M₁ D₂ N₂ Ṡ",
    avarohana: "Ṡ D₂ N₂ M₁ G₂ R₂ S",
  },
  {
    name: "Kadanakuthuhalam",
    melakarta: 0,
    parentMelakarta: 28,
    aarohana: "S R₂ G₃ M₁ P D₂ Ṡ",
    avarohana: "Ṡ N₂ D₂ P M₁ G₃ R₂ S",
  },
  {
    name: "Dwijavanthi",
    melakarta: 0,
    parentMelakarta: 28,
    aarohana: "S R₂ G₃ M₁ P D₂ N₃ Ṡ",
    avarohana: "Ṡ N₃ D₂ P M₁ G₃ R₂ S",
  },
  {
    name: "Paraju",
    melakarta: 0,
    parentMelakarta: 22,
    aarohana: "S R₂ G₂ M₁ P D₂ N₂ Ṡ",
    avarohana: "Ṡ N₂ D₂ P M₁ G₂ R₂ S",
  },
  {
    name: "Jhanjuti",
    melakarta: 0,
    parentMelakarta: 28,
    aarohana: "S R₂ G₃ M₁ P D₂ N₃ D₂ Ṡ",
    avarohana: "Ṡ N₃ D₂ P M₁ G₃ R₂ S",
  },
  {
    name: "Malayamarutham",
    melakarta: 0,
    parentMelakarta: 29,
    aarohana: "S R₂ G₃ P D₂ N₃ Ṡ",
    avarohana: "Ṡ N₃ D₂ P G₃ R₂ S",
    meaning: "The gentle mountain breeze",
  },
  {
    name: "Ghanta",
    melakarta: 0,
    parentMelakarta: 20,
    aarohana: "S R₂ G₂ M₁ P D₂ N₂ Ṡ",
    avarohana: "Ṡ N₂ D₂ P M₁ G₂ R₂ S",
  },
  {
    name: "Addana",
    melakarta: 0,
    parentMelakarta: 28,
    aarohana: "S M₁ G₃ M₁ P N₃ P Ṡ",
    avarohana: "Ṡ N₃ D₂ P M₁ G₃ R₂ S",
  },
];

janyaRagas.forEach((r) => {
  ragaData[r.name] = r;
});

export function getRagaInfo(name: string): RagaInfo | null {
  const trimmed = name.trim();
  const exact = ragaData[trimmed];
  if (exact) return exact;
  const match = Object.keys(ragaData).find(
    (k) => k.toUpperCase() === trimmed.toUpperCase(),
  );
  return match ? ragaData[match] : null;
}

export function searchRagas(query: string): RagaInfo[] {
  const q = query.toUpperCase();
  return Object.values(ragaData).filter((r) =>
    r.name.toUpperCase().includes(q),
  );
}

interface DummySong {
  id?: string;
  name: string;
  type: string;
  tala: string;
}

const dummySongsByRaga: Record<string, DummySong[]> = {
  Sankarabharanam: [
    { name: "Endaro Mahanubhavulu", type: "Divotional", tala: "Adi" },
    { name: "Swararaagasu Sudharasa", type: "Divotional", tala: "Adi" },
    { name: "Sree Raghuvaraprameya", type: "Divotional", tala: "Rupaka" },
  ],
  Kalyani: [
    { name: "Amma Ravamma", type: "Divotional", tala: "Adi" },
    { name: "Nidhi Chala Sukhama", type: "Divotional", tala: "Adi" },
  ],
  Kharaharapriya: [
    { name: "Rama Nee Samanamevaru", type: "Divotional", tala: "Khandachapu" },
    { name: "Chetulara Sree", type: "Divotional", tala: "Adi" },
  ],
  Todi: [
    { name: "Kaddanuvariki", type: "Divotional", tala: "Adi" },
    { name: "Dasara Nee Dasarada", type: "Divotional", tala: "Adi" },
  ],
  Bhairavi: [
    { name: "Balagopaala", type: "Divotional", tala: "Adi" },
    { name: "Sree Kamalambika", type: "Divotional", tala: "Rupaka" },
  ],
  Mohanam: [
    { name: "Nannu Palimpa", type: "Divotional", tala: "Adi" },
    { name: "Mohanama Raghava", type: "Divotional", tala: "Adi" },
  ],
  Hamsadhvani: [
    { name: "Vatapi Ganapatim", type: "Divotional", tala: "Adi" },
    { name: "Sree Vighneswara", type: "Divotional", tala: "Rupaka" },
  ],
  Hindolam: [
    { name: "Maa Ramanan", type: "Divotional", tala: "Adi" },
    { name: "Samaja Varagamana", type: "Divotional", tala: "Adi" },
  ],
  Madhyamavathi: [
    { name: "Sree Subramanyaya Namaste", type: "Divotional", tala: "Adi" },
  ],
  Abhogi: [{ name: "Sabhapathiki Unnade", type: "Divotional", tala: "Rupaka" }],
  Kambhoji: [
    { name: "O Ranga Nayaka", type: "Divotional", tala: "Adi" },
    { name: "Pavadisa", type: "Divotional", tala: "Adi" },
  ],
  Bilahari: [
    { name: "Dorasuke Ituvanti", type: "Divotional", tala: "Rupaka" },
    { name: "Venugana Loluni", type: "Divotional", tala: "Adi" },
  ],
  Atana: [{ name: "Sree Raghuvara", type: "Divotional", tala: "Adi" }],
  Begada: [{ name: "Nada Loludai", type: "Divotional", tala: "Adi" }],
  Saveri: [{ name: "Intha Chalamu", type: "Divotional", tala: "Adi" }],
  Nata: [{ name: "Rara Sree Rama", type: "Divotional", tala: "Adi" }],
  Keeravani: [{ name: "Sree Krishna", type: "Divotional", tala: "Adi" }],
  "Sri Ranjani": [{ name: "Parama Pavana", type: "Divotional", tala: "Adi" }],
  Varali: [{ name: "Bhajana Seyada", type: "Divotional", tala: "Adi" }],
  Anandabhairavi: [
    { name: "Sree Parameswari", type: "Divotional", tala: "Adi" },
    { name: "Neekela Naerpo", type: "Divotional", tala: "Rupaka" },
  ],
  Charukesi: [
    { name: "Aadamodiche", type: "Divotional", tala: "Adi" },
    { name: "Swararaga Sudha", type: "Divotional", tala: "Rupaka" },
  ],
};

const melakartaDummySongs: DummySong[] = [
  { name: "Bhajana Seyada", type: "Divotional", tala: "Adi" },
  { name: "Sree Gananatha", type: "Divotional", tala: "Rupaka" },
];

export function getDummySongs(ragaName: string): DummySong[] {
  const normalized = Object.keys(dummySongsByRaga).find(
    (k) => k.toUpperCase() === ragaName.toUpperCase(),
  );
  return normalized ? dummySongsByRaga[normalized] : melakartaDummySongs;
}
