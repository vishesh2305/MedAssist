/**
 * Medicine name equivalents across countries.
 * Maps a generic/brand name to its known equivalents in other countries.
 *
 * Key: lowercase generic name
 * Value: { generic, brandNames: Record<countryCode, brandName[]> }
 */

export interface MedicineEquivalent {
  generic: string;
  category: string;
  brandNames: Record<string, string[]>;
}

export const medicineEquivalents: MedicineEquivalent[] = [
  // ── Pain Relief / Anti-inflammatory ─────────────
  {
    generic: 'paracetamol',
    category: 'pain_relief',
    brandNames: {
      US: ['Tylenol', 'Acetaminophen'],
      GB: ['Panadol', 'Calpol'],
      IN: ['Crocin', 'Dolo 650', 'Calpol'],
      DE: ['Ben-u-ron', 'Paracetamol ratiopharm'],
      FR: ['Doliprane', 'Efferalgan', 'Dafalgan'],
      JP: ['Calonal', 'Loxonin'],
      BR: ['Tylenol', 'Paracetamol Medley'],
      AU: ['Panadol', 'Panamax', 'Herron'],
      TH: ['Sara', 'Tylenol'],
      MX: ['Tempra', 'Tylenol'],
      ES: ['Gelocatil', 'Termalgin', 'Efferalgan'],
      IT: ['Tachipirina', 'Efferalgan'],
      KR: ['Tylenol', 'Gelufen'],
      ZA: ['Panado', 'Panadol'],
      AE: ['Panadol', 'Adol'],
      SA: ['Panadol', 'Adol', 'Fevadol'],
      PK: ['Panadol', 'Calpol'],
      PH: ['Biogesic', 'Tempra', 'Paracetamol'],
      NG: ['Panadol', 'Emzor Paracetamol'],
      EG: ['Panadol', 'Abimol', 'Cetal'],
      TR: ['Parol', 'Minoset'],
    },
  },
  {
    generic: 'ibuprofen',
    category: 'pain_relief',
    brandNames: {
      US: ['Advil', 'Motrin'],
      GB: ['Nurofen', 'Brufen'],
      IN: ['Brufen', 'Ibugesic'],
      DE: ['Ibuprofen AL', 'Nurofen', 'IBU-ratiopharm'],
      FR: ['Nurofen', 'Advil', 'Spedifen'],
      JP: ['Brufen', 'Eve'],
      BR: ['Advil', 'Alivium'],
      AU: ['Nurofen', 'Brufen'],
      TH: ['Brufen', 'Ibuprofen GPO'],
      ES: ['Nurofen', 'Espidifen', 'Dalsy'],
      IT: ['Moment', 'Brufen', 'Nurofen'],
      KR: ['Brufen', 'Advil'],
      ZA: ['Nurofen', 'Brufen'],
      AE: ['Brufen', 'Nurofen'],
      TR: ['Brufen', 'Advil'],
      MX: ['Advil', 'Motrin'],
    },
  },
  {
    generic: 'aspirin',
    category: 'pain_relief',
    brandNames: {
      US: ['Bayer', 'Ecotrin', 'Bufferin'],
      GB: ['Aspirin', 'Disprin'],
      IN: ['Disprin', 'Ecosprin'],
      DE: ['Aspirin', 'ASS ratiopharm'],
      FR: ['Aspegic', 'Aspro'],
      JP: ['Bufferin', 'Bayer Aspirin'],
      BR: ['Aspirina', 'AAS'],
      AU: ['Aspro', 'Disprin'],
      ES: ['Aspirina', 'Adiro'],
      IT: ['Aspirina', 'Cardioaspirin'],
      TR: ['Aspirin', 'Coraspin'],
    },
  },
  {
    generic: 'diclofenac',
    category: 'pain_relief',
    brandNames: {
      US: ['Voltaren', 'Cataflam'],
      GB: ['Voltarol', 'Voltaren'],
      IN: ['Voveran', 'Diclomol'],
      DE: ['Voltaren', 'Diclofenac ratiopharm'],
      FR: ['Voltarene'],
      JP: ['Voltaren'],
      BR: ['Voltaren', 'Cataflam'],
      AU: ['Voltaren'],
      TH: ['Voltaren', 'Diclofenac GPO'],
      ES: ['Voltaren'],
      IT: ['Voltaren', 'Dicloreum'],
      TR: ['Voltaren', 'Dikloron'],
    },
  },
  {
    generic: 'naproxen',
    category: 'pain_relief',
    brandNames: {
      US: ['Aleve', 'Naprosyn'],
      GB: ['Naproxen', 'Naprosyn'],
      IN: ['Naprosyn', 'Xenobid'],
      DE: ['Naproxen AL', 'Dolormin'],
      FR: ['Apranax', 'Naprosyne'],
      AU: ['Naprogesic', 'Naprosyn'],
      BR: ['Naprosyn', 'Flanax'],
      MX: ['Flanax'],
      ES: ['Antalgin', 'Naprosyn'],
    },
  },

  // ── Antibiotics ─────────────────────────────────
  {
    generic: 'amoxicillin',
    category: 'antibiotic',
    brandNames: {
      US: ['Amoxil', 'Trimox'],
      GB: ['Amoxil'],
      IN: ['Mox', 'Novamox', 'Amoxil'],
      DE: ['Amoxicillin AL', 'Amoxicillin ratiopharm'],
      FR: ['Clamoxyl', 'Amoxicilline'],
      JP: ['Sawacillin', 'Pasetocin'],
      BR: ['Amoxil', 'Amoxicilina'],
      AU: ['Amoxil', 'Alphamox'],
      TH: ['Amoxil'],
      ES: ['Clamoxyl'],
      IT: ['Zimox', 'Velamox'],
      PK: ['Amoxil'],
      EG: ['Amoxil', 'Emirox'],
      TR: ['Largopen', 'Amoklavin'],
    },
  },
  {
    generic: 'azithromycin',
    category: 'antibiotic',
    brandNames: {
      US: ['Zithromax', 'Z-Pack'],
      GB: ['Zithromax'],
      IN: ['Azithral', 'Zithromax', 'Azee'],
      DE: ['Zithromax', 'Azithromycin Hexal'],
      FR: ['Zithromax'],
      JP: ['Zithromax'],
      BR: ['Zitromax', 'Azitromicina'],
      AU: ['Zithromax', 'Azithromycin Sandoz'],
      TH: ['Zithromax'],
      ES: ['Zitromax'],
      IT: ['Zitromax'],
      TR: ['Zitromax', 'Azro'],
      EG: ['Zithromax', 'Azrolid'],
    },
  },
  {
    generic: 'ciprofloxacin',
    category: 'antibiotic',
    brandNames: {
      US: ['Cipro'],
      GB: ['Ciproxin'],
      IN: ['Ciplox', 'Cifran'],
      DE: ['Ciprobay', 'Ciprofloxacin Hexal'],
      FR: ['Ciflox'],
      JP: ['Ciproxan'],
      BR: ['Cipro', 'Ciprofloxacino'],
      AU: ['Ciproxin', 'Cipro'],
      TH: ['Ciprobay'],
      ES: ['Ciproxina', 'Baycip'],
      IT: ['Ciproxin'],
      TR: ['Cipro', 'Siprosan'],
    },
  },
  {
    generic: 'metronidazole',
    category: 'antibiotic',
    brandNames: {
      US: ['Flagyl'],
      GB: ['Flagyl', 'Metronidazole'],
      IN: ['Flagyl', 'Metrogyl'],
      DE: ['Flagyl', 'Clont'],
      FR: ['Flagyl'],
      JP: ['Flagyl'],
      BR: ['Flagyl', 'Metronidazol'],
      AU: ['Flagyl', 'Metronide'],
      ES: ['Flagyl'],
      IT: ['Flagyl', 'Deflamon'],
      TR: ['Flagyl', 'Flagil'],
    },
  },
  {
    generic: 'doxycycline',
    category: 'antibiotic',
    brandNames: {
      US: ['Vibramycin', 'Doryx'],
      GB: ['Vibramycin'],
      IN: ['Doxycap', 'Doxt'],
      DE: ['Doxycyclin AL'],
      FR: ['Vibramycine', 'Doxypalu'],
      JP: ['Vibramycin'],
      BR: ['Vibramicina'],
      AU: ['Vibramycin', 'Doryx'],
      TH: ['Vibramycin'],
      ES: ['Vibracina'],
      IT: ['Bassado'],
    },
  },

  // ── Antacids / GI ──────────────────────────────
  {
    generic: 'omeprazole',
    category: 'gastrointestinal',
    brandNames: {
      US: ['Prilosec'],
      GB: ['Losec', 'Omeprazole'],
      IN: ['Omez', 'Pan 40'],
      DE: ['Omeprazol AL', 'Antra'],
      FR: ['Mopral'],
      JP: ['Omepral', 'Omeprazole'],
      BR: ['Losec', 'Omeprazol'],
      AU: ['Losec', 'Omeprazole Sandoz'],
      TH: ['Losec', 'Miracid'],
      ES: ['Losec', 'Omeprazol Normon'],
      IT: ['Losec', 'Antra'],
      TR: ['Losec', 'Omeprol'],
      AE: ['Losec'],
      EG: ['Losec', 'Omepak'],
    },
  },
  {
    generic: 'pantoprazole',
    category: 'gastrointestinal',
    brandNames: {
      US: ['Protonix'],
      GB: ['Pantoprazole', 'Protium'],
      IN: ['Pan 40', 'Pantocid', 'Pan-D'],
      DE: ['Pantozol', 'Pantoprazol Hexal'],
      FR: ['Eupantol', 'Inipomp'],
      BR: ['Pantocal', 'Pantozol'],
      AU: ['Somac', 'Pantoprazole Sandoz'],
      ES: ['Pantecta', 'Pantoprazol Normon'],
      IT: ['Pantopan', 'Pantorc'],
      TR: ['Pantpas', 'Pantozol'],
    },
  },
  {
    generic: 'ranitidine',
    category: 'gastrointestinal',
    brandNames: {
      US: ['Zantac'],
      GB: ['Zantac'],
      IN: ['Rantac', 'Zinetac', 'Aciloc'],
      DE: ['Zantac', 'Ranitidin Hexal'],
      FR: ['Azantac', 'Raniplex'],
      BR: ['Antak', 'Label'],
      AU: ['Zantac'],
      TH: ['Zantac'],
      TR: ['Ulcuran', 'Ranitab'],
    },
  },
  {
    generic: 'loperamide',
    category: 'gastrointestinal',
    brandNames: {
      US: ['Imodium'],
      GB: ['Imodium'],
      IN: ['Lopamide', 'Eldoper'],
      DE: ['Imodium', 'Lopedium'],
      FR: ['Imodium'],
      JP: ['Lopemin'],
      BR: ['Imosec'],
      AU: ['Imodium', 'Gastro-Stop'],
      TH: ['Imodium'],
      ES: ['Fortasec', 'Imodium'],
      IT: ['Imodium', 'Dissenten'],
      TR: ['Imodium', 'Loperan'],
    },
  },
  {
    generic: 'ondansetron',
    category: 'gastrointestinal',
    brandNames: {
      US: ['Zofran'],
      GB: ['Zofran'],
      IN: ['Emeset', 'Ondem'],
      DE: ['Zofran', 'Ondansetron Hexal'],
      FR: ['Zophren'],
      JP: ['Zofran'],
      BR: ['Vonau', 'Zofran'],
      AU: ['Zofran', 'Ondansetron Sandoz'],
      ES: ['Zofran', 'Yatrox'],
      IT: ['Zofran'],
    },
  },

  // ── Allergy / Antihistamines ────────────────────
  {
    generic: 'cetirizine',
    category: 'antihistamine',
    brandNames: {
      US: ['Zyrtec'],
      GB: ['Piriteze', 'Benadryl One a Day'],
      IN: ['Cetzine', 'Alerid', 'Okacet'],
      DE: ['Cetirizin HEXAL', 'Zyrtec'],
      FR: ['Zyrtec', 'Virlix'],
      JP: ['Zyrtec'],
      BR: ['Zyrtec', 'Zetalerg'],
      AU: ['Zyrtec', 'Zilarex'],
      TH: ['Zyrtec', 'Cetirizine GPO'],
      ES: ['Zyrtec', 'Alerlisin'],
      IT: ['Zirtec', 'Formistin'],
      TR: ['Zyrtec', 'Hitrizin'],
      AE: ['Zyrtec'],
      EG: ['Zyrtec', 'Allercet'],
    },
  },
  {
    generic: 'loratadine',
    category: 'antihistamine',
    brandNames: {
      US: ['Claritin', 'Alavert'],
      GB: ['Clarityn'],
      IN: ['Lorfast', 'Alaspan'],
      DE: ['Lorano', 'Loratadin ratiopharm'],
      FR: ['Clarityne'],
      JP: ['Claritin'],
      BR: ['Claritin', 'Loratadina'],
      AU: ['Claratyne', 'Lorastyne'],
      TH: ['Clarityne'],
      ES: ['Clarityne'],
      IT: ['Clarityn', 'Fristamin'],
      TR: ['Claritine', 'Loratadin'],
    },
  },
  {
    generic: 'fexofenadine',
    category: 'antihistamine',
    brandNames: {
      US: ['Allegra'],
      GB: ['Telfast', 'Fexofenadine'],
      IN: ['Allegra', 'Fexova'],
      DE: ['Telfast', 'Fexofenadin Winthrop'],
      FR: ['Telfast'],
      JP: ['Allegra'],
      BR: ['Allegra'],
      AU: ['Telfast', 'Fexotabs'],
      TH: ['Telfast'],
      ES: ['Telfast'],
      IT: ['Telfast'],
    },
  },
  {
    generic: 'diphenhydramine',
    category: 'antihistamine',
    brandNames: {
      US: ['Benadryl'],
      GB: ['Nytol', 'Benadryl'],
      IN: ['Benadryl'],
      DE: ['Benadryl', 'Betadorm'],
      FR: ['Nautamine'],
      JP: ['Restamin', 'Drewell'],
      BR: ['Benadryl'],
      AU: ['Benadryl', 'Unisom'],
    },
  },

  // ── Blood Pressure / Cardiovascular ─────────────
  {
    generic: 'amlodipine',
    category: 'cardiovascular',
    brandNames: {
      US: ['Norvasc'],
      GB: ['Norvasc', 'Istin'],
      IN: ['Amlip', 'Amlogard', 'Amlopress'],
      DE: ['Norvasc', 'Amlodipin Hexal'],
      FR: ['Amlor'],
      JP: ['Norvasc', 'Amlodin'],
      BR: ['Norvasc', 'Anlodipino'],
      AU: ['Norvasc', 'Amlodipine Sandoz'],
      TH: ['Norvasc'],
      ES: ['Norvasc', 'Astudal'],
      IT: ['Norvasc'],
      TR: ['Norvasc', 'Amlodis'],
    },
  },
  {
    generic: 'atenolol',
    category: 'cardiovascular',
    brandNames: {
      US: ['Tenormin'],
      GB: ['Tenormin'],
      IN: ['Aten', 'Tenormin'],
      DE: ['Tenormin', 'Atenolol AL'],
      FR: ['Tenormine'],
      JP: ['Tenormin'],
      BR: ['Atenol', 'Ablok'],
      AU: ['Tenormin', 'Noten'],
      ES: ['Tenormin', 'Blokium'],
      IT: ['Tenormin', 'Atenol'],
    },
  },
  {
    generic: 'losartan',
    category: 'cardiovascular',
    brandNames: {
      US: ['Cozaar'],
      GB: ['Cozaar'],
      IN: ['Losar', 'Losacar', 'Covance'],
      DE: ['Lorzaar', 'Losartan Hexal'],
      FR: ['Cozaar'],
      JP: ['Nu-Lotan'],
      BR: ['Cozaar', 'Losartana'],
      AU: ['Cozaar'],
      ES: ['Cozaar'],
      IT: ['Lortaan', 'Losaprex'],
      TR: ['Cozaar', 'Loxibin'],
    },
  },
  {
    generic: 'metoprolol',
    category: 'cardiovascular',
    brandNames: {
      US: ['Lopressor', 'Toprol-XL'],
      GB: ['Lopresor', 'Betaloc'],
      IN: ['Betaloc', 'Metolar', 'Met XL'],
      DE: ['Beloc', 'Metoprolol Hexal'],
      FR: ['Lopressor', 'Seloken'],
      JP: ['Lopressor', 'Seloken'],
      BR: ['Seloken', 'Lopressor'],
      AU: ['Betaloc', 'Metoprolol Sandoz'],
      ES: ['Lopresor', 'Beloken'],
      IT: ['Lopresor', 'Seloken'],
    },
  },
  {
    generic: 'enalapril',
    category: 'cardiovascular',
    brandNames: {
      US: ['Vasotec'],
      GB: ['Innovace'],
      IN: ['Envas', 'Enapril'],
      DE: ['Xanef', 'Enalapril Hexal'],
      FR: ['Renitec'],
      JP: ['Renivace'],
      BR: ['Renitec', 'Enalapril'],
      AU: ['Renitec', 'Enalapril Sandoz'],
      ES: ['Renitec', 'Baripril'],
      IT: ['Enapren', 'Converten'],
    },
  },

  // ── Diabetes ────────────────────────────────────
  {
    generic: 'metformin',
    category: 'diabetes',
    brandNames: {
      US: ['Glucophage', 'Fortamet'],
      GB: ['Glucophage', 'Metformin'],
      IN: ['Glycomet', 'Glucophage', 'Obimet'],
      DE: ['Glucophage', 'Metformin Hexal'],
      FR: ['Glucophage', 'Stagid'],
      JP: ['Glycoran', 'Metgluco'],
      BR: ['Glifage', 'Glucoformin'],
      AU: ['Diabex', 'Diaformin'],
      TH: ['Glucophage'],
      ES: ['Dianben', 'Glucophage'],
      IT: ['Glucophage', 'Metforal'],
      TR: ['Glucophage', 'Gluformin'],
    },
  },
  {
    generic: 'glimepiride',
    category: 'diabetes',
    brandNames: {
      US: ['Amaryl'],
      GB: ['Amaryl'],
      IN: ['Amaryl', 'Glimisave'],
      DE: ['Amaryl', 'Glimepirid Hexal'],
      FR: ['Amarel'],
      JP: ['Amaryl'],
      BR: ['Amaryl', 'Glimepirida'],
      AU: ['Amaryl', 'Dimirel'],
      ES: ['Amaryl', 'Roname'],
      IT: ['Amaryl', 'Solosa'],
    },
  },
  {
    generic: 'insulin glargine',
    category: 'diabetes',
    brandNames: {
      US: ['Lantus', 'Basaglar', 'Toujeo'],
      GB: ['Lantus', 'Abasaglar'],
      IN: ['Lantus', 'Basalog', 'Glaritus'],
      DE: ['Lantus', 'Abasaglar'],
      FR: ['Lantus'],
      JP: ['Lantus'],
      BR: ['Lantus'],
      AU: ['Lantus'],
    },
  },

  // ── Respiratory / Asthma ────────────────────────
  {
    generic: 'salbutamol',
    category: 'respiratory',
    brandNames: {
      US: ['ProAir', 'Ventolin', 'Proventil'],
      GB: ['Ventolin', 'Salamol'],
      IN: ['Asthalin', 'Ventolin', 'Derihaler'],
      DE: ['Sultanol', 'Salbutamol ratiopharm'],
      FR: ['Ventoline'],
      JP: ['Sultanol', 'Salbutamol'],
      BR: ['Aerolin'],
      AU: ['Ventolin', 'Asmol'],
      TH: ['Ventolin'],
      ES: ['Ventolin', 'Salbulair'],
      IT: ['Ventolin', 'Broncovaleas'],
      TR: ['Ventolin'],
      EG: ['Ventolin', 'Farcolin'],
    },
  },
  {
    generic: 'montelukast',
    category: 'respiratory',
    brandNames: {
      US: ['Singulair'],
      GB: ['Singulair'],
      IN: ['Montair', 'Montek'],
      DE: ['Singulair', 'Montelukast Hexal'],
      FR: ['Singulair', 'Montelukast Teva'],
      JP: ['Singulair', 'Kipres'],
      BR: ['Singulair', 'Montelucaste'],
      AU: ['Singulair'],
      ES: ['Singulair'],
      IT: ['Singulair', 'Montegen'],
    },
  },
  {
    generic: 'fluticasone',
    category: 'respiratory',
    brandNames: {
      US: ['Flonase', 'Flovent'],
      GB: ['Flixotide', 'Flixonase'],
      IN: ['Flohale', 'Fluticone'],
      DE: ['Flutide'],
      FR: ['Flixotide', 'Flixonase'],
      JP: ['Flutide'],
      BR: ['Flixotide', 'Flutivate'],
      AU: ['Flixotide', 'Flixonase'],
    },
  },

  // ── Antidepressants / Mental Health ─────────────
  {
    generic: 'sertraline',
    category: 'mental_health',
    brandNames: {
      US: ['Zoloft'],
      GB: ['Lustral'],
      IN: ['Daxid', 'Serlift'],
      DE: ['Zoloft', 'Sertralin Hexal'],
      FR: ['Zoloft'],
      JP: ['Zoloft'],
      BR: ['Zoloft', 'Sertralina'],
      AU: ['Zoloft', 'Sertraline Sandoz'],
      ES: ['Besitran', 'Aremis'],
      IT: ['Zoloft'],
    },
  },
  {
    generic: 'fluoxetine',
    category: 'mental_health',
    brandNames: {
      US: ['Prozac', 'Sarafem'],
      GB: ['Prozac', 'Fluoxetine'],
      IN: ['Fludac', 'Flunil'],
      DE: ['Fluctin', 'Fluoxetin Hexal'],
      FR: ['Prozac'],
      JP: ['Prozac'],
      BR: ['Prozac', 'Fluoxetina'],
      AU: ['Prozac', 'Lovan'],
      ES: ['Prozac', 'Adofen'],
      IT: ['Prozac', 'Fluoxeren'],
    },
  },
  {
    generic: 'escitalopram',
    category: 'mental_health',
    brandNames: {
      US: ['Lexapro'],
      GB: ['Cipralex'],
      IN: ['Nexito', 'Stalopam', 'S-Citadep'],
      DE: ['Cipralex', 'Escitalopram Hexal'],
      FR: ['Seroplex'],
      JP: ['Lexapro'],
      BR: ['Lexapro', 'Exodus'],
      AU: ['Lexapro', 'Esipram'],
      ES: ['Cipralex', 'Esertia'],
      IT: ['Cipralex', 'Entact'],
    },
  },
  {
    generic: 'alprazolam',
    category: 'mental_health',
    brandNames: {
      US: ['Xanax'],
      GB: ['Xanax'],
      IN: ['Alprax', 'Restyl', 'Trika'],
      DE: ['Tafil', 'Xanax'],
      FR: ['Xanax'],
      JP: ['Solanax', 'Constan'],
      BR: ['Frontal'],
      AU: ['Xanax', 'Alprazolam Sandoz'],
      ES: ['Trankimazin'],
      IT: ['Xanax', 'Frontal'],
    },
  },

  // ── Cholesterol ─────────────────────────────────
  {
    generic: 'atorvastatin',
    category: 'cholesterol',
    brandNames: {
      US: ['Lipitor'],
      GB: ['Lipitor', 'Atorvastatin'],
      IN: ['Atorva', 'Tonact', 'Lipitor'],
      DE: ['Sortis', 'Atorvastatin Hexal'],
      FR: ['Tahor'],
      JP: ['Lipitor'],
      BR: ['Lipitor', 'Citalor'],
      AU: ['Lipitor', 'Atorvastatin Sandoz'],
      TH: ['Lipitor'],
      ES: ['Lipitor', 'Cardyl'],
      IT: ['Torvast', 'Totalip'],
      TR: ['Lipitor', 'Ator'],
    },
  },
  {
    generic: 'rosuvastatin',
    category: 'cholesterol',
    brandNames: {
      US: ['Crestor'],
      GB: ['Crestor'],
      IN: ['Rozavel', 'Rosuvas', 'Crestor'],
      DE: ['Crestor'],
      FR: ['Crestor'],
      JP: ['Crestor'],
      BR: ['Crestor', 'Rosuvastatina'],
      AU: ['Crestor'],
      ES: ['Crestor', 'Provisacor'],
      IT: ['Crestor', 'Provisacor'],
    },
  },

  // ── Thyroid ─────────────────────────────────────
  {
    generic: 'levothyroxine',
    category: 'thyroid',
    brandNames: {
      US: ['Synthroid', 'Levoxyl', 'Tirosint'],
      GB: ['Levothyroxine', 'Eltroxin'],
      IN: ['Thyronorm', 'Eltroxin', 'Thyrox'],
      DE: ['L-Thyroxin Hexal', 'Euthyrox'],
      FR: ['Levothyrox', 'L-Thyroxine'],
      JP: ['Thyradin-S', 'Levothyroxine'],
      BR: ['Puran T4', 'Euthyrox'],
      AU: ['Oroxine', 'Eutroxsig'],
      ES: ['Eutirox', 'Levothroid'],
      IT: ['Eutirox', 'Tirosint'],
      TR: ['Euthyrox', 'Tefor'],
    },
  },

  // ── Contraceptives ──────────────────────────────
  {
    generic: 'ethinylestradiol/levonorgestrel',
    category: 'contraceptive',
    brandNames: {
      US: ['Alesse', 'Aviane', 'Levlen'],
      GB: ['Microgynon', 'Rigevidon', 'Levest'],
      IN: ['Ovral-L', 'Femilon'],
      DE: ['Microgynon', 'Femigoa'],
      FR: ['Minidril', 'Leeloo'],
      JP: ['Triquilar'],
      BR: ['Ciclo 21', 'Level'],
      AU: ['Microgynon', 'Levlen ED'],
      ES: ['Microgynon', 'Ovoplex'],
      IT: ['Microgynon', 'Loette'],
    },
  },

  // ── Corticosteroids ─────────────────────────────
  {
    generic: 'prednisolone',
    category: 'corticosteroid',
    brandNames: {
      US: ['Prelone', 'Orapred'],
      GB: ['Prednisolone'],
      IN: ['Omnacortil', 'Wysolone'],
      DE: ['Prednisolon AL', 'Decortin H'],
      FR: ['Solupred'],
      JP: ['Predonine'],
      BR: ['Predsim', 'Prelone'],
      AU: ['Prednisolone', 'Solone'],
      ES: ['Estilsona'],
      IT: ['Deltacortene'],
    },
  },
  {
    generic: 'hydrocortisone',
    category: 'corticosteroid',
    brandNames: {
      US: ['Cortef', 'Cortizone'],
      GB: ['Hydrocortisone'],
      IN: ['Hisone', 'Hydrocortisone'],
      DE: ['Hydrocortison', 'Hydrogalen'],
      FR: ['Hydrocortisone'],
      AU: ['Hysone', 'Sigmacort'],
      ES: ['Hidroaltesona'],
      IT: ['Flebocortid'],
    },
  },

  // ── Antimalarials ───────────────────────────────
  {
    generic: 'chloroquine',
    category: 'antimalarial',
    brandNames: {
      US: ['Aralen'],
      GB: ['Avloclor', 'Nivaquine'],
      IN: ['Lariago', 'Resochin'],
      DE: ['Resochin'],
      FR: ['Nivaquine'],
      BR: ['Cloroquina'],
      AU: ['Chloroquine'],
      TH: ['Chloroquine GPO'],
    },
  },
  {
    generic: 'atovaquone/proguanil',
    category: 'antimalarial',
    brandNames: {
      US: ['Malarone'],
      GB: ['Malarone'],
      IN: ['Malarone'],
      DE: ['Malarone'],
      FR: ['Malarone'],
      AU: ['Malarone'],
      TH: ['Malarone'],
    },
  },
  {
    generic: 'mefloquine',
    category: 'antimalarial',
    brandNames: {
      US: ['Lariam'],
      GB: ['Lariam'],
      IN: ['Lariam', 'Mefloquine'],
      DE: ['Lariam'],
      FR: ['Lariam'],
      AU: ['Lariam'],
    },
  },

  // ── Vitamins / Supplements ──────────────────────
  {
    generic: 'vitamin D3',
    category: 'supplement',
    brandNames: {
      US: ['Nature Made D3', 'Drisdol'],
      GB: ['Fultium D3', 'Adcal D3'],
      IN: ['D-Rise', 'Calcirol', 'Uprise D3'],
      DE: ['Vigantol', 'Dekristol'],
      FR: ['ZymaD', 'Uvedose'],
      JP: ['Alfacalcidol'],
      BR: ['Depura', 'Addera D3'],
      AU: ['Ostelin D3'],
    },
  },

  // ── Motion Sickness / Nausea ────────────────────
  {
    generic: 'dimenhydrinate',
    category: 'antiemetic',
    brandNames: {
      US: ['Dramamine'],
      GB: ['Dramamine'],
      IN: ['Avomine', 'Gravinate'],
      DE: ['Vomex A'],
      FR: ['Nausicalm', 'Mercalm'],
      JP: ['Travelmin'],
      BR: ['Dramin'],
      AU: ['Travacalm', 'Dramamine'],
      TH: ['Dramamine'],
      ES: ['Biodramina'],
      IT: ['Xamamina', 'Valontan'],
      TR: ['Dramamine'],
    },
  },
  {
    generic: 'meclizine',
    category: 'antiemetic',
    brandNames: {
      US: ['Bonine', 'Dramamine Less Drowsy'],
      GB: ['Sea-Legs'],
      IN: ['Meclizine'],
      AU: ['Sea-Legs'],
    },
  },

  // ── Topical / Skin ──────────────────────────────
  {
    generic: 'clotrimazole',
    category: 'antifungal',
    brandNames: {
      US: ['Lotrimin', 'Mycelex'],
      GB: ['Canesten'],
      IN: ['Candid', 'Clotrimazole'],
      DE: ['Canesten', 'Clotrimazol AL'],
      FR: ['Mycohydralin'],
      JP: ['Empecid'],
      BR: ['Canesten', 'Clotrimazol'],
      AU: ['Canesten', 'Clonea'],
      TH: ['Canesten'],
      ES: ['Canesten'],
      IT: ['Canesten'],
    },
  },
  {
    generic: 'miconazole',
    category: 'antifungal',
    brandNames: {
      US: ['Monistat', 'Micatin'],
      GB: ['Daktarin'],
      IN: ['Daktarin', 'Micogel'],
      DE: ['Daktar', 'Miconazol'],
      FR: ['Daktarin', 'Gyno-Daktarin'],
      BR: ['Daktarin', 'Vodol'],
      AU: ['Daktarin', 'Resolve'],
      ES: ['Daktarin'],
      IT: ['Daktarin', 'Micotef'],
    },
  },

  // ── Eye Care ────────────────────────────────────
  {
    generic: 'artificial tears (carboxymethylcellulose)',
    category: 'eye_care',
    brandNames: {
      US: ['Refresh Tears', 'Systane'],
      GB: ['Celluvisc', 'Viscotears'],
      IN: ['Refresh Tears', 'Tears Naturale'],
      DE: ['Hylo-Comod', 'Artelac'],
      FR: ['Refresh', 'Celluvisc'],
      JP: ['Refresh', 'Santen'],
      BR: ['Fresh Tears', 'Lacrifilm'],
      AU: ['Refresh Tears', 'Systane'],
      TH: ['Refresh Tears'],
    },
  },

  // ── Oral Rehydration ────────────────────────────
  {
    generic: 'oral rehydration salts',
    category: 'rehydration',
    brandNames: {
      US: ['Pedialyte', 'DripDrop'],
      GB: ['Dioralyte', 'Electrolade'],
      IN: ['Electral', 'ORS'],
      DE: ['Elotrans', 'Oralpaedon'],
      FR: ['Adiaril', 'GES 45'],
      JP: ['OS-1'],
      BR: ['Pedialyte', 'SRO'],
      AU: ['Hydralyte', 'Gastrolyte'],
      TH: ['ORS'],
      ES: ['Sueroral'],
      IT: ['Dicodral'],
      PK: ['Nimkol ORS', 'Pedialyte'],
      EG: ['ORS', 'Rehydran'],
    },
  },

  // ── Antifungal Oral ─────────────────────────────
  {
    generic: 'fluconazole',
    category: 'antifungal',
    brandNames: {
      US: ['Diflucan'],
      GB: ['Diflucan', 'Fluconazole'],
      IN: ['Zocon', 'Flucos', 'Forcan'],
      DE: ['Diflucan', 'Fluconazol Hexal'],
      FR: ['Triflucan'],
      JP: ['Diflucan'],
      BR: ['Zoltec', 'Fluconazol'],
      AU: ['Diflucan'],
      ES: ['Diflucan', 'Fluconazol Normon'],
      IT: ['Diflucan'],
    },
  },

  // ── Blood Thinners ──────────────────────────────
  {
    generic: 'warfarin',
    category: 'anticoagulant',
    brandNames: {
      US: ['Coumadin', 'Jantoven'],
      GB: ['Warfarin'],
      IN: ['Warf', 'Acitrom'],
      DE: ['Coumadin', 'Marcumar'],
      FR: ['Coumadine', 'Previscan'],
      JP: ['Warfarin'],
      BR: ['Marevan', 'Coumadin'],
      AU: ['Coumadin', 'Marevan'],
      ES: ['Aldocumar', 'Sintrom'],
      IT: ['Coumadin'],
    },
  },
  {
    generic: 'clopidogrel',
    category: 'anticoagulant',
    brandNames: {
      US: ['Plavix'],
      GB: ['Plavix', 'Clopidogrel'],
      IN: ['Clopivas', 'Clopilet', 'Plavix'],
      DE: ['Plavix', 'Clopidogrel Hexal'],
      FR: ['Plavix'],
      JP: ['Plavix'],
      BR: ['Plavix', 'Clopidogrel'],
      AU: ['Plavix', 'Clopidogrel Sandoz'],
      ES: ['Plavix', 'Iscover'],
      IT: ['Plavix'],
    },
  },

  // ── Muscle Relaxants ────────────────────────────
  {
    generic: 'cyclobenzaprine',
    category: 'muscle_relaxant',
    brandNames: {
      US: ['Flexeril', 'Amrix'],
      GB: ['Cyclobenzaprine'],
      IN: ['Flexeril'],
      BR: ['Miosan'],
      AU: ['Flexeril'],
    },
  },
  {
    generic: 'tizanidine',
    category: 'muscle_relaxant',
    brandNames: {
      US: ['Zanaflex'],
      GB: ['Zanaflex'],
      IN: ['Tizan', 'Sirdalud'],
      DE: ['Sirdalud'],
      FR: ['Sirdalud'],
      JP: ['Ternelin'],
      BR: ['Sirdalud'],
      AU: ['Sirdalud'],
    },
  },
];

/**
 * Find medicine equivalents by name.
 * Searches both generic names and brand names.
 */
export function findMedicineEquivalent(
  medicineName: string,
  targetCountryCode?: string
): MedicineEquivalent[] {
  const searchTerm = medicineName.toLowerCase().trim();

  const results = medicineEquivalents.filter((med) => {
    // Match generic name
    if (med.generic.toLowerCase().includes(searchTerm)) return true;

    // Match any brand name
    for (const brands of Object.values(med.brandNames)) {
      if (brands.some((b) => b.toLowerCase().includes(searchTerm))) return true;
    }

    return false;
  });

  if (targetCountryCode) {
    const code = targetCountryCode.toUpperCase();
    return results.map((med) => ({
      ...med,
      brandNames: med.brandNames[code]
        ? { [code]: med.brandNames[code] }
        : med.brandNames,
    }));
  }

  return results;
}
