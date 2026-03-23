/**
 * Embassy and consulate directory.
 * Key structure: `${nationalityCode}_${hostCountryCode}`
 *
 * Covers major nationalities in popular tourist/medical tourism destinations.
 */

export interface EmbassyInfo {
  nationality: string; // e.g. "United States"
  hostCountry: string; // e.g. "Thailand"
  type: 'embassy' | 'consulate' | 'consulate_general' | 'honorary_consulate';
  name: string;
  city: string;
  address: string;
  phone: string;
  emergencyPhone?: string;
  email?: string;
  website?: string;
}

export const embassyDirectory: Record<string, EmbassyInfo[]> = {
  // ── US Embassies ────────────────────────────────
  US_TH: [
    {
      nationality: 'United States', hostCountry: 'Thailand', type: 'embassy',
      name: 'U.S. Embassy Bangkok', city: 'Bangkok',
      address: '95 Wireless Road, Lumphini, Pathumwan, Bangkok 10330',
      phone: '+66-2-205-4000', emergencyPhone: '+66-2-205-4000',
      email: 'acsbkk@state.gov', website: 'https://th.usembassy.gov',
    },
    {
      nationality: 'United States', hostCountry: 'Thailand', type: 'consulate',
      name: 'U.S. Consulate General Chiang Mai', city: 'Chiang Mai',
      address: '387 Wichayanond Road, Chiang Mai 50300',
      phone: '+66-53-107-700', emergencyPhone: '+66-2-205-4000',
      website: 'https://th.usembassy.gov/embassy-consulate/chiang-mai/',
    },
  ],
  US_IN: [
    {
      nationality: 'United States', hostCountry: 'India', type: 'embassy',
      name: 'U.S. Embassy New Delhi', city: 'New Delhi',
      address: 'Shantipath, Chanakyapuri, New Delhi 110021',
      phone: '+91-11-2419-8000', emergencyPhone: '+91-11-2419-8000',
      email: 'acsnd@state.gov', website: 'https://in.usembassy.gov',
    },
    {
      nationality: 'United States', hostCountry: 'India', type: 'consulate_general',
      name: 'U.S. Consulate General Mumbai', city: 'Mumbai',
      address: 'C-49, G-Block, Bandra Kurla Complex, Mumbai 400051',
      phone: '+91-22-2672-4000', emergencyPhone: '+91-11-2419-8000',
      website: 'https://in.usembassy.gov/embassy-consulates/mumbai/',
    },
  ],
  US_MX: [
    {
      nationality: 'United States', hostCountry: 'Mexico', type: 'embassy',
      name: 'U.S. Embassy Mexico City', city: 'Mexico City',
      address: 'Paseo de la Reforma 305, Cuauhtémoc, 06500',
      phone: '+52-55-5080-2000', emergencyPhone: '+52-55-5080-2000',
      website: 'https://mx.usembassy.gov',
    },
  ],
  US_TR: [
    {
      nationality: 'United States', hostCountry: 'Turkey', type: 'embassy',
      name: 'U.S. Embassy Ankara', city: 'Ankara',
      address: '110 Atatürk Boulevard, Kavaklıdere, 06100 Ankara',
      phone: '+90-312-455-5555', emergencyPhone: '+90-312-455-5555',
      website: 'https://tr.usembassy.gov',
    },
  ],
  US_DE: [
    {
      nationality: 'United States', hostCountry: 'Germany', type: 'embassy',
      name: 'U.S. Embassy Berlin', city: 'Berlin',
      address: 'Pariser Platz 2, 10117 Berlin',
      phone: '+49-30-8305-0', emergencyPhone: '+49-30-8305-0',
      website: 'https://de.usembassy.gov',
    },
  ],
  US_JP: [
    {
      nationality: 'United States', hostCountry: 'Japan', type: 'embassy',
      name: 'U.S. Embassy Tokyo', city: 'Tokyo',
      address: '1-10-5 Akasaka, Minato-ku, Tokyo 107-8420',
      phone: '+81-3-3224-5000', emergencyPhone: '+81-3-3224-5000',
      website: 'https://jp.usembassy.gov',
    },
  ],
  US_KR: [
    {
      nationality: 'United States', hostCountry: 'South Korea', type: 'embassy',
      name: 'U.S. Embassy Seoul', city: 'Seoul',
      address: '188 Sejong-daero, Jongno-gu, Seoul 03141',
      phone: '+82-2-397-4114', emergencyPhone: '+82-2-397-4114',
      website: 'https://kr.usembassy.gov',
    },
  ],
  US_BR: [
    {
      nationality: 'United States', hostCountry: 'Brazil', type: 'embassy',
      name: 'U.S. Embassy Brasília', city: 'Brasília',
      address: 'SES - Av. das Nações, Quadra 801, Lote 03, 70403-900',
      phone: '+55-61-3312-7000', emergencyPhone: '+55-61-3312-7000',
      website: 'https://br.usembassy.gov',
    },
  ],
  US_AE: [
    {
      nationality: 'United States', hostCountry: 'UAE', type: 'embassy',
      name: 'U.S. Embassy Abu Dhabi', city: 'Abu Dhabi',
      address: 'Embassies District, Plot 38, Sector W59-02, Abu Dhabi',
      phone: '+971-2-414-2200', emergencyPhone: '+971-2-414-2200',
      website: 'https://ae.usembassy.gov',
    },
  ],
  US_SG: [
    {
      nationality: 'United States', hostCountry: 'Singapore', type: 'embassy',
      name: 'U.S. Embassy Singapore', city: 'Singapore',
      address: '27 Napier Road, Singapore 258508',
      phone: '+65-6476-9100', emergencyPhone: '+65-6476-9100',
      website: 'https://sg.usembassy.gov',
    },
  ],

  // ── UK Embassies ────────────────────────────────
  GB_TH: [
    {
      nationality: 'United Kingdom', hostCountry: 'Thailand', type: 'embassy',
      name: 'British Embassy Bangkok', city: 'Bangkok',
      address: '14 Wireless Road, Lumphini, Pathumwan, Bangkok 10330',
      phone: '+66-2-305-8333', emergencyPhone: '+44-20-7008-5000',
      website: 'https://www.gov.uk/world/organisations/british-embassy-bangkok',
    },
  ],
  GB_IN: [
    {
      nationality: 'United Kingdom', hostCountry: 'India', type: 'embassy',
      name: 'British High Commission New Delhi', city: 'New Delhi',
      address: 'Shantipath, Chanakyapuri, New Delhi 110021',
      phone: '+91-11-2419-2100', emergencyPhone: '+44-20-7008-5000',
      website: 'https://www.gov.uk/world/organisations/british-high-commission-new-delhi',
    },
  ],
  GB_ES: [
    {
      nationality: 'United Kingdom', hostCountry: 'Spain', type: 'embassy',
      name: 'British Embassy Madrid', city: 'Madrid',
      address: 'Torre Espacio, Paseo de la Castellana 259D, 28046 Madrid',
      phone: '+34-91-714-6300', emergencyPhone: '+44-20-7008-5000',
      website: 'https://www.gov.uk/world/organisations/british-embassy-madrid',
    },
  ],
  GB_AE: [
    {
      nationality: 'United Kingdom', hostCountry: 'UAE', type: 'embassy',
      name: 'British Embassy Abu Dhabi', city: 'Abu Dhabi',
      address: 'Khalid bin Al Waleed Street, Abu Dhabi',
      phone: '+971-2-610-1100', emergencyPhone: '+44-20-7008-5000',
      website: 'https://www.gov.uk/world/organisations/british-embassy-abu-dhabi',
    },
  ],
  GB_AU: [
    {
      nationality: 'United Kingdom', hostCountry: 'Australia', type: 'embassy',
      name: 'British High Commission Canberra', city: 'Canberra',
      address: 'Commonwealth Avenue, Yarralumla, ACT 2600',
      phone: '+61-2-6270-6666', emergencyPhone: '+44-20-7008-5000',
      website: 'https://www.gov.uk/world/organisations/british-high-commission-canberra',
    },
  ],
  GB_TR: [
    {
      nationality: 'United Kingdom', hostCountry: 'Turkey', type: 'embassy',
      name: 'British Embassy Ankara', city: 'Ankara',
      address: 'Şehit Ersan Caddesi 46/A, Çankaya, 06680 Ankara',
      phone: '+90-312-455-3344', emergencyPhone: '+44-20-7008-5000',
      website: 'https://www.gov.uk/world/organisations/british-embassy-ankara',
    },
  ],

  // ── Indian Embassies ────────────────────────────
  IN_TH: [
    {
      nationality: 'India', hostCountry: 'Thailand', type: 'embassy',
      name: 'Embassy of India Bangkok', city: 'Bangkok',
      address: '46 Soi Prasarnmit (Sukhumvit 23), Bangkok 10110',
      phone: '+66-2-258-0300', emergencyPhone: '+66-81-846-4903',
      website: 'https://www.indianembassy.in.th',
    },
  ],
  IN_AE: [
    {
      nationality: 'India', hostCountry: 'UAE', type: 'embassy',
      name: 'Embassy of India Abu Dhabi', city: 'Abu Dhabi',
      address: 'Plot No. 10, Sector W-59/02, Diplomatic Area, Abu Dhabi',
      phone: '+971-2-449-2700', emergencyPhone: '+971-50-948-1143',
      website: 'https://www.indembassyuae.gov.in',
    },
    {
      nationality: 'India', hostCountry: 'UAE', type: 'consulate_general',
      name: 'Consulate General of India Dubai', city: 'Dubai',
      address: 'Al Hamriya Consular Complex, Dubai',
      phone: '+971-4-397-1222', emergencyPhone: '+971-50-948-5423',
      website: 'https://www.cgidubai.gov.in',
    },
  ],
  IN_US: [
    {
      nationality: 'India', hostCountry: 'United States', type: 'embassy',
      name: 'Embassy of India Washington DC', city: 'Washington DC',
      address: '2107 Massachusetts Avenue NW, Washington, DC 20008',
      phone: '+1-202-939-7000', emergencyPhone: '+1-202-258-3535',
      website: 'https://www.indianembassyusa.gov.in',
    },
  ],
  IN_GB: [
    {
      nationality: 'India', hostCountry: 'United Kingdom', type: 'embassy',
      name: 'High Commission of India London', city: 'London',
      address: 'India House, Aldwych, London WC2B 4NA',
      phone: '+44-20-7836-8484', emergencyPhone: '+44-7766-507-591',
      website: 'https://www.hcilondon.gov.in',
    },
  ],
  IN_SG: [
    {
      nationality: 'India', hostCountry: 'Singapore', type: 'embassy',
      name: 'High Commission of India Singapore', city: 'Singapore',
      address: '31 Grange Road, Singapore 239702',
      phone: '+65-6737-6777', emergencyPhone: '+65-8126-4957',
      website: 'https://www.hcisingapore.gov.in',
    },
  ],
  IN_MY: [
    {
      nationality: 'India', hostCountry: 'Malaysia', type: 'embassy',
      name: 'High Commission of India Kuala Lumpur', city: 'Kuala Lumpur',
      address: 'No. 2, Jalan Taman Duta, Off Jalan Duta, 50480 Kuala Lumpur',
      phone: '+60-3-2093-3510', emergencyPhone: '+60-12-396-8577',
      website: 'https://www.hcikl.gov.in',
    },
  ],
  IN_SA: [
    {
      nationality: 'India', hostCountry: 'Saudi Arabia', type: 'embassy',
      name: 'Embassy of India Riyadh', city: 'Riyadh',
      address: 'B-1, Diplomatic Quarter, Riyadh 11693',
      phone: '+966-11-488-4144', emergencyPhone: '+966-54-094-1234',
      website: 'https://www.eoiriyadh.gov.in',
    },
  ],

  // ── German Embassies ────────────────────────────
  DE_TH: [
    {
      nationality: 'Germany', hostCountry: 'Thailand', type: 'embassy',
      name: 'German Embassy Bangkok', city: 'Bangkok',
      address: '9 South Sathorn Road, Bangkok 10120',
      phone: '+66-2-287-9000', emergencyPhone: '+66-2-287-9000',
      website: 'https://bangkok.diplo.de',
    },
  ],
  DE_TR: [
    {
      nationality: 'Germany', hostCountry: 'Turkey', type: 'embassy',
      name: 'German Embassy Ankara', city: 'Ankara',
      address: 'Atatürk Bulvarı 114, 06680 Kavaklidere, Ankara',
      phone: '+90-312-455-5100', emergencyPhone: '+90-312-455-5100',
      website: 'https://ankara.diplo.de',
    },
  ],
  DE_ES: [
    {
      nationality: 'Germany', hostCountry: 'Spain', type: 'embassy',
      name: 'German Embassy Madrid', city: 'Madrid',
      address: 'Calle de Fortuny 8, 28010 Madrid',
      phone: '+34-91-557-9000', emergencyPhone: '+34-91-557-9000',
      website: 'https://madrid.diplo.de',
    },
  ],
  DE_IN: [
    {
      nationality: 'Germany', hostCountry: 'India', type: 'embassy',
      name: 'German Embassy New Delhi', city: 'New Delhi',
      address: 'No. 6/50G, Shantipath, Chanakyapuri, New Delhi 110021',
      phone: '+91-11-4419-9199', emergencyPhone: '+91-11-4419-9199',
      website: 'https://india.diplo.de',
    },
  ],

  // ── Australian Embassies ────────────────────────
  AU_TH: [
    {
      nationality: 'Australia', hostCountry: 'Thailand', type: 'embassy',
      name: 'Australian Embassy Bangkok', city: 'Bangkok',
      address: '181 Wireless Road, Lumphini, Bangkok 10330',
      phone: '+66-2-344-6300', emergencyPhone: '+61-2-6261-3305',
      website: 'https://thailand.embassy.gov.au',
    },
  ],
  AU_ID: [
    {
      nationality: 'Australia', hostCountry: 'Indonesia', type: 'embassy',
      name: 'Australian Embassy Jakarta', city: 'Jakarta',
      address: 'Jl. Patra Kuningan Raya Kav. 1-4, Jakarta 12950',
      phone: '+62-21-2550-5555', emergencyPhone: '+61-2-6261-3305',
      website: 'https://indonesia.embassy.gov.au',
    },
    {
      nationality: 'Australia', hostCountry: 'Indonesia', type: 'consulate',
      name: 'Australian Consulate-General Bali', city: 'Bali',
      address: 'Jl. Tantular 32, Renon, Denpasar, Bali 80234',
      phone: '+62-361-241-118', emergencyPhone: '+61-2-6261-3305',
      website: 'https://indonesia.embassy.gov.au/bali',
    },
  ],
  AU_IN: [
    {
      nationality: 'Australia', hostCountry: 'India', type: 'embassy',
      name: 'Australian High Commission New Delhi', city: 'New Delhi',
      address: '1/50G Shantipath, Chanakyapuri, New Delhi 110021',
      phone: '+91-11-4139-9900', emergencyPhone: '+61-2-6261-3305',
      website: 'https://india.highcommission.gov.au',
    },
  ],
  AU_VN: [
    {
      nationality: 'Australia', hostCountry: 'Vietnam', type: 'embassy',
      name: 'Australian Embassy Hanoi', city: 'Hanoi',
      address: '8 Dao Tan Street, Ba Dinh District, Hanoi',
      phone: '+84-24-3774-0100', emergencyPhone: '+61-2-6261-3305',
      website: 'https://vietnam.embassy.gov.au',
    },
  ],

  // ── Canadian Embassies ──────────────────────────
  CA_TH: [
    {
      nationality: 'Canada', hostCountry: 'Thailand', type: 'embassy',
      name: 'Embassy of Canada Bangkok', city: 'Bangkok',
      address: '15th Floor, Abdulrahim Place, 990 Rama IV Road, Bangkok 10500',
      phone: '+66-2-646-4300', emergencyPhone: '+1-613-996-8885',
      website: 'https://www.canada.ca/canada-and-thailand',
    },
  ],
  CA_MX: [
    {
      nationality: 'Canada', hostCountry: 'Mexico', type: 'embassy',
      name: 'Embassy of Canada Mexico City', city: 'Mexico City',
      address: 'Schiller 529, Col. Polanco, 11580 Mexico City',
      phone: '+52-55-5724-7900', emergencyPhone: '+1-613-996-8885',
      website: 'https://www.canada.ca/canada-and-mexico',
    },
  ],
  CA_IN: [
    {
      nationality: 'Canada', hostCountry: 'India', type: 'embassy',
      name: 'High Commission of Canada New Delhi', city: 'New Delhi',
      address: '7/8 Shantipath, Chanakyapuri, New Delhi 110021',
      phone: '+91-11-4178-2000', emergencyPhone: '+1-613-996-8885',
      website: 'https://www.canada.ca/canada-and-india',
    },
  ],

  // ── French Embassies ────────────────────────────
  FR_TH: [
    {
      nationality: 'France', hostCountry: 'Thailand', type: 'embassy',
      name: 'French Embassy Bangkok', city: 'Bangkok',
      address: '35 Charoen Krung Road Soi 36, Bangkok 10500',
      phone: '+66-2-657-5100', emergencyPhone: '+66-2-657-5100',
      website: 'https://th.ambafrance.org',
    },
  ],
  FR_MA: [
    {
      nationality: 'France', hostCountry: 'Morocco', type: 'embassy',
      name: 'French Embassy Rabat', city: 'Rabat',
      address: '3 Rue Sahnoun, Agdal, Rabat',
      phone: '+212-537-689-700', emergencyPhone: '+212-537-689-700',
      website: 'https://ma.ambafrance.org',
    },
  ],
  FR_TR: [
    {
      nationality: 'France', hostCountry: 'Turkey', type: 'embassy',
      name: 'French Embassy Ankara', city: 'Ankara',
      address: 'Paris Caddesi 70, 06540 Kavaklidere, Ankara',
      phone: '+90-312-455-4545', emergencyPhone: '+90-312-455-4545',
      website: 'https://tr.ambafrance.org',
    },
  ],

  // ── Japanese Embassies ──────────────────────────
  JP_TH: [
    {
      nationality: 'Japan', hostCountry: 'Thailand', type: 'embassy',
      name: 'Embassy of Japan Bangkok', city: 'Bangkok',
      address: '177 Witthayu Road, Lumphini, Pathumwan, Bangkok 10330',
      phone: '+66-2-207-8500', emergencyPhone: '+66-2-207-8500',
      website: 'https://www.th.emb-japan.go.jp',
    },
  ],
  JP_US: [
    {
      nationality: 'Japan', hostCountry: 'United States', type: 'embassy',
      name: 'Embassy of Japan Washington DC', city: 'Washington DC',
      address: '2520 Massachusetts Avenue NW, Washington, DC 20008',
      phone: '+1-202-238-6700', emergencyPhone: '+1-202-238-6700',
      website: 'https://www.us.emb-japan.go.jp',
    },
  ],

  // ── Chinese Embassies ───────────────────────────
  CN_TH: [
    {
      nationality: 'China', hostCountry: 'Thailand', type: 'embassy',
      name: 'Embassy of China Bangkok', city: 'Bangkok',
      address: '57 Ratchadaphisek Road, Bangkok 10310',
      phone: '+66-2-245-7044', emergencyPhone: '+66-2-245-7044',
      website: 'http://www.chinaembassy.or.th',
    },
  ],
  CN_US: [
    {
      nationality: 'China', hostCountry: 'United States', type: 'embassy',
      name: 'Embassy of China Washington DC', city: 'Washington DC',
      address: '3505 International Place NW, Washington, DC 20008',
      phone: '+1-202-495-2266', emergencyPhone: '+1-202-495-2266',
      website: 'http://www.china-embassy.org',
    },
  ],
  CN_JP: [
    {
      nationality: 'China', hostCountry: 'Japan', type: 'embassy',
      name: 'Embassy of China Tokyo', city: 'Tokyo',
      address: '3-4-33 Moto-Azabu, Minato-ku, Tokyo 106-0046',
      phone: '+81-3-3403-3388', emergencyPhone: '+81-3-3403-3388',
      website: 'http://www.china-embassy.or.jp',
    },
  ],
  CN_KR: [
    {
      nationality: 'China', hostCountry: 'South Korea', type: 'embassy',
      name: 'Embassy of China Seoul', city: 'Seoul',
      address: '54 Hyoja-ro, Jongno-gu, Seoul',
      phone: '+82-2-738-1038', emergencyPhone: '+82-2-738-1038',
      website: 'http://kr.china-embassy.gov.cn',
    },
  ],
  CN_AU: [
    {
      nationality: 'China', hostCountry: 'Australia', type: 'embassy',
      name: 'Embassy of China Canberra', city: 'Canberra',
      address: '15 Coronation Drive, Yarralumla, ACT 2600',
      phone: '+61-2-6228-3999', emergencyPhone: '+61-2-6228-3999',
      website: 'http://au.china-embassy.gov.cn',
    },
  ],

  // ── Korean Embassies ────────────────────────────
  KR_TH: [
    {
      nationality: 'South Korea', hostCountry: 'Thailand', type: 'embassy',
      name: 'Embassy of Korea Bangkok', city: 'Bangkok',
      address: '23 Thiam-Ruamit Road, Ratchadapisek, Huaykwang, Bangkok 10310',
      phone: '+66-2-247-7537', emergencyPhone: '+66-2-247-7537',
      website: 'https://overseas.mofa.go.kr/th-en',
    },
  ],
  KR_US: [
    {
      nationality: 'South Korea', hostCountry: 'United States', type: 'embassy',
      name: 'Embassy of Korea Washington DC', city: 'Washington DC',
      address: '2450 Massachusetts Avenue NW, Washington, DC 20008',
      phone: '+1-202-939-5600', emergencyPhone: '+1-202-939-5600',
      website: 'https://overseas.mofa.go.kr/us-en',
    },
  ],

  // ── Brazilian Embassies ─────────────────────────
  BR_US: [
    {
      nationality: 'Brazil', hostCountry: 'United States', type: 'embassy',
      name: 'Embassy of Brazil Washington DC', city: 'Washington DC',
      address: '3006 Massachusetts Avenue NW, Washington, DC 20008',
      phone: '+1-202-238-2700', emergencyPhone: '+1-202-238-2700',
      website: 'https://www.gov.br/mre/en/embassies-and-consulates/washington',
    },
  ],
  BR_PT: [
    {
      nationality: 'Brazil', hostCountry: 'Portugal', type: 'embassy',
      name: 'Embassy of Brazil Lisbon', city: 'Lisbon',
      address: 'Estrada das Laranjeiras 144, 1649-021 Lisbon',
      phone: '+351-21-724-8510', emergencyPhone: '+351-21-724-8510',
      website: 'https://www.gov.br/mre/en/embassies-and-consulates/lisbon',
    },
  ],

  // ── Nigerian Embassies ──────────────────────────
  NG_US: [
    {
      nationality: 'Nigeria', hostCountry: 'United States', type: 'embassy',
      name: 'Embassy of Nigeria Washington DC', city: 'Washington DC',
      address: '3519 International Court NW, Washington, DC 20008',
      phone: '+1-202-986-8400', emergencyPhone: '+1-202-986-8400',
      website: 'http://www.nigeriaembassyusa.org',
    },
  ],
  NG_GB: [
    {
      nationality: 'Nigeria', hostCountry: 'United Kingdom', type: 'embassy',
      name: 'Nigeria High Commission London', city: 'London',
      address: '9 Northumberland Avenue, London WC2N 5BX',
      phone: '+44-20-7839-1244', emergencyPhone: '+44-20-7839-1244',
      website: 'http://www.nigeriahc.org.uk',
    },
  ],

  // ── Pakistani Embassies ─────────────────────────
  PK_AE: [
    {
      nationality: 'Pakistan', hostCountry: 'UAE', type: 'embassy',
      name: 'Embassy of Pakistan Abu Dhabi', city: 'Abu Dhabi',
      address: 'Plot No. 2, Sector W-59, Diplomatic Area, Abu Dhabi',
      phone: '+971-2-444-7800', emergencyPhone: '+971-50-689-0006',
      website: 'https://www.pakemb.ae',
    },
  ],
  PK_SA: [
    {
      nationality: 'Pakistan', hostCountry: 'Saudi Arabia', type: 'embassy',
      name: 'Embassy of Pakistan Riyadh', city: 'Riyadh',
      address: 'Diplomatic Quarter, Riyadh',
      phone: '+966-11-482-1917', emergencyPhone: '+966-11-482-1917',
    },
  ],
  PK_GB: [
    {
      nationality: 'Pakistan', hostCountry: 'United Kingdom', type: 'embassy',
      name: 'Pakistan High Commission London', city: 'London',
      address: '35-36 Lowndes Square, London SW1X 9JN',
      phone: '+44-20-7664-9200', emergencyPhone: '+44-7831-576-768',
      website: 'http://www.phclondon.org',
    },
  ],

  // ── Filipino Embassies ──────────────────────────
  PH_AE: [
    {
      nationality: 'Philippines', hostCountry: 'UAE', type: 'embassy',
      name: 'Philippine Embassy Abu Dhabi', city: 'Abu Dhabi',
      address: 'Zone 2, Sector 2-28, Plot C-58, Abu Dhabi',
      phone: '+971-2-449-2700', emergencyPhone: '+971-56-680-8888',
      website: 'https://abudhabi.philembassy.ph',
    },
  ],
  PH_SA: [
    {
      nationality: 'Philippines', hostCountry: 'Saudi Arabia', type: 'embassy',
      name: 'Philippine Embassy Riyadh', city: 'Riyadh',
      address: 'Diplomatic Quarter, Riyadh 11693',
      phone: '+966-11-482-5676', emergencyPhone: '+966-54-901-3866',
      website: 'https://riyadhpe.dfa.gov.ph',
    },
  ],
  PH_SG: [
    {
      nationality: 'Philippines', hostCountry: 'Singapore', type: 'embassy',
      name: 'Philippine Embassy Singapore', city: 'Singapore',
      address: '20 Nassim Road, Singapore 258395',
      phone: '+65-6737-3977', emergencyPhone: '+65-9-190-4359',
      website: 'https://singaporepe.dfa.gov.ph',
    },
  ],
};

/**
 * Find embassies by nationality code and host country code.
 */
export function findEmbassies(
  nationalityCode: string,
  hostCountryCode: string
): EmbassyInfo[] {
  const key = `${nationalityCode.toUpperCase()}_${hostCountryCode.toUpperCase()}`;
  return embassyDirectory[key] || [];
}

/**
 * Find all embassies for a given nationality.
 */
export function findAllEmbassiesByNationality(nationalityCode: string): EmbassyInfo[] {
  const prefix = nationalityCode.toUpperCase() + '_';
  const results: EmbassyInfo[] = [];

  for (const [key, embassies] of Object.entries(embassyDirectory)) {
    if (key.startsWith(prefix)) {
      results.push(...embassies);
    }
  }

  return results;
}

/**
 * Find all embassies in a given host country.
 */
export function findAllEmbassiesInCountry(hostCountryCode: string): EmbassyInfo[] {
  const suffix = '_' + hostCountryCode.toUpperCase();
  const results: EmbassyInfo[] = [];

  for (const [key, embassies] of Object.entries(embassyDirectory)) {
    if (key.endsWith(suffix)) {
      results.push(...embassies);
    }
  }

  return results;
}
