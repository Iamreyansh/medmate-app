/**
 * The mock catalogue.
 *
 * One list of medicines for the whole app. The home screen rails, the
 * search results and the filter counts all read from here, so a product
 * added to the catalogue shows up everywhere at once.
 *
 * Hand maintained: add a product here and it appears on the home
 * screen, in the search results and in the filter counts. Keep the ids
 * stable - the routes and the deep links use them.
 */

export type CatalogueProduct = {
  id: string;
  name: string;
  /** Pack size and composition. */
  sub: string;
  /** Selling price in rupees. */
  price: number;
  /** Maximum retail price. Never shown for prescription items. */
  mrp?: number;
  /** Discount percentage. Never shown for prescription items. */
  off?: number;
  /** Prescription item: price only, no strike-through, no discount. */
  rx: boolean;
  /** Manufacturer, used for the brand count on the search screen. */
  brand: string;
  /** The shop category the product belongs to. */
  category: string;
  /** Delivery window promised for the product. */
  eta: string;
};

export const catalogue: CatalogueProduct[] = [
  { id: 'aksobha-pack', name: 'Aksobha Long Herbal Hot & Cold Therapy Pack', sub: 'Pack of 2', price: 560, mrp: 660, off: 15, rx: false, brand: 'Aksobha', eta: '32–47 min', category: 'Cough & Cold' },
  { id: 'amrutanjan-cold-rub', name: 'Amrutanjan Cold Rub', sub: 'Jar of 30 gm Balm', price: 40, mrp: 47, off: 15, rx: false, brand: 'Amrutanjan', eta: '32–47 min', category: 'Ayurveda' },
  { id: 'amrutanjan-cup', name: 'Amrutanjan Comfy Snug Fit Period Cup Large', sub: 'Pack of 2', price: 349, mrp: 410, off: 15, rx: false, brand: 'Amrutanjan', eta: '32–47 min', category: 'Women’s health' },
  { id: 'amrutanjan-pads', name: 'Amrutanjan Comfy Snug Fit Sanitary Pads Regular', sub: 'Pack of 20', price: 179, mrp: 210, off: 15, rx: false, brand: 'Amrutanjan', eta: '32–47 min', category: 'Women’s health' },
  { id: 'DRS023755', name: 'Aristomol 650 Tablet', sub: 'Paracetamol (650mg) · Pain relief', price: 17, mrp: 20, off: 15, rx: false, brand: 'Aristomol', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'DRS023756', name: 'Aristomol 650mg Tablet', sub: 'Paracetamol (650mg) · Pain relief', price: 27, mrp: 32, off: 16, rx: false, brand: 'Aristomol', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'bakson-b33', name: 'Bakson B33 Cough Drop', sub: 'Bottle of 30 ml Drop', price: 144, mrp: 169, off: 15, rx: false, brand: 'Bakson', eta: '32–47 min', category: 'Ayurveda' },
  { id: 'beato-glucometer', name: 'Beato CURV Smartphone Glucometer', sub: 'Box of 1 Unit', price: 1049, mrp: 1235, off: 15, rx: false, brand: 'Beato', eta: '32–47 min', category: 'Devices' },
  { id: 'cetaphil-baby', name: 'Cetaphil Baby Gentle Wash with Organic Calendula', sub: 'Bottle of 200 ml', price: 449, mrp: 529, off: 15, rx: false, brand: 'Cetaphil', eta: '32–47 min', category: 'Skin Care' },
  { id: 'cetaphil-cream', name: 'Cetaphil Optimal Hydration Daily Cream', sub: 'Jar of 50 gm Cream', price: 1124, mrp: 1322, off: 15, rx: false, brand: 'Cetaphil', eta: '32–47 min', category: 'Skin Care' },
  { id: 'cetaphil-cream-deal', name: 'Cetaphil Optimal Hydration Daily Cream', sub: 'Jar of 50 gm Cream', price: 1124, mrp: 1322, off: 15, rx: false, brand: 'Cetaphil', eta: '32–47 min', category: 'Skin Care' },
  { id: 'chicco-roll-on', name: 'Chicco Anti-Mosquito Baby Fabric Roll-On', sub: 'Bottle of 50 ml', price: 299, mrp: 352, off: 15, rx: false, brand: 'Chicco', eta: '32–47 min', category: 'Baby & child care' },
  { id: 'chicco-breast-pad', name: 'Chicco Breast pad with Antibacterial Fabric', sub: 'Pack of 12', price: 249, mrp: 295, off: 16, rx: false, brand: 'Chicco', eta: '32–47 min', category: 'Women’s health' },
  { id: 'DR070502', name: 'Crocin Baby Paracetamol Paediatric Drops', sub: 'Bottle of 15 ml Drop · Paracetamol Oral Drops', price: 32, mrp: 38, off: 16, rx: false, brand: 'Crocin', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'dabur-baby-cream', name: 'Dabur Baby Cream', sub: 'Jar of 50 gm', price: 199, mrp: 235, off: 15, rx: false, brand: 'Dabur', eta: '32–47 min', category: 'Baby & child care' },
  { id: 'dettol-liquid', name: 'Dettol Antiseptic Disinfectant Liquid', sub: 'Bottle of 60 ml Liquid', price: 32, mrp: 38, off: 16, rx: false, brand: 'Dettol', eta: '32–47 min', category: 'First Aid' },
  { id: 'dettol-liquid-deal', name: 'Dettol Antiseptic Disinfectant Liquid', sub: 'Bottle of 60 ml Liquid', price: 32, mrp: 38, off: 16, rx: false, brand: 'Dettol', eta: '32–47 min', category: 'First Aid' },
  { id: 'dettol-everyday', name: 'Dettol Antiseptic Disinfectant Liquid', sub: 'Bottle of 60 ml Liquid', price: 32, mrp: 38, off: 16, rx: false, brand: 'Dettol', eta: '32–47 min', category: 'First Aid' },
  { id: 'digene-shots', name: 'Digene Insta On The Go Shots (10ml Each) No Added Sugar Orange', sub: 'Pack of 15 shots', price: 299, mrp: 352, off: 15, rx: false, brand: 'Digene', eta: '32–47 min', category: 'Stomach' },
  { id: 'digene-shots-2', name: 'Digene Insta On The Go Shots (10ml Each) No Added Sugar Orange', sub: 'Pack of 15 shots', price: 299, mrp: 352, off: 15, rx: false, brand: 'Digene', eta: '32–47 min', category: 'Stomach' },
  { id: 'ab72', name: 'Doliprane 500', sub: 'Paracetamol 500mg Tablets', price: 79, mrp: 93, off: 15, rx: false, brand: 'Doliprane', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'ab73', name: 'Doliprane 650', sub: 'Paracetamol 650mg', price: 86, mrp: 101, off: 15, rx: false, brand: 'Doliprane', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'p1', name: 'Dolo 650', sub: 'Paracetamol · 15 tablets', price: 31, mrp: 34, off: 9, rx: false, brand: 'Dolo', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'morepen-calcium', name: 'Dr Morepen Calcium + Advanced Tablet', sub: 'Strip of 15 tablets', price: 189, mrp: 225, off: 16, rx: false, brand: 'Dr Morepen', eta: '32–47 min', category: 'Vitamins & immunity' },
  { id: 'fem-pads', name: 'Fem Ultra Care Sanitary Pads XL+', sub: 'Pack of 30', price: 219, mrp: 260, off: 16, rx: false, brand: 'Fem', eta: '32–47 min', category: 'Women’s health' },
  { id: 'gytree-menopause', name: 'Gytree Total Menopause Support Cafe Mocha', sub: 'Box of 10 sachets', price: 449, mrp: 529, off: 15, rx: false, brand: 'Gytree', eta: '32–47 min', category: 'Women’s health' },
  { id: 'hansaplast', name: 'Hansaplast Antiseptic Washproof Bandage For Wound Protection Bandage', sub: 'Box of 20 plasters', price: 149, mrp: 175, off: 15, rx: false, brand: 'Hansaplast', eta: '32–47 min', category: 'First Aid' },
  { id: 'himalaya-soap', name: 'Himalaya Gentle Baby Soap (75gm Each)', sub: 'Pack of 2', price: 128, mrp: 150, off: 15, rx: false, brand: 'Himalaya', eta: '32–47 min', category: 'Baby & child care' },
  { id: 'himalaya-pants', name: 'Himalaya Total Care Baby Pants', sub: 'Packet of 76 diapers', price: 944, mrp: 1110, off: 15, rx: false, brand: 'Himalaya', eta: '32–47 min', category: 'Baby & child care' },
  { id: 'himalaya-pads-women', name: 'Himalaya Ultra Thin Pad with Super Soft Cover', sub: 'Pack of 20', price: 149, mrp: 175, off: 15, rx: false, brand: 'Himalaya', eta: '32–47 min', category: 'Women’s health' },
  { id: 'leeford-lumbo', name: 'Leeford Contoured Lumbo Sacral Belt Large', sub: 'Box of 1 Belt', price: 799, mrp: 940, off: 15, rx: false, brand: 'Leeford', eta: '32–47 min', category: 'Ortho & pain care' },
  { id: 'mamaearth-body-wash', name: 'Mamaearth Body Wash for Kids with Apple Extract', sub: 'Bottle of 200 ml', price: 259, mrp: 305, off: 15, rx: false, brand: 'Mamaearth', eta: '32–47 min', category: 'Skin Care' },
  { id: 'mamaearth-breathe', name: 'Mamaearth Natural Breathe Easy Vapour Roll-On for Babies', sub: 'Bottle of 40 ml Oil', price: 214, mrp: 252, off: 15, rx: false, brand: 'Mamaearth', eta: '32–47 min', category: 'Everyday essentials' },
  { id: 'moov-gel', name: 'Moov Cool Therapy Gel', sub: 'Tube of 10 gm Gel', price: 38, mrp: 44, off: 14, rx: false, brand: 'Moov', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'moov-gel-care', name: 'Moov Cool Therapy Gel', sub: 'Tube of 10 gm Gel', price: 38, mrp: 44, off: 14, rx: false, brand: 'Moov', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'moov-gel-deal', name: 'Moov Cool Therapy Gel', sub: 'Tube of 10 gm Gel', price: 38, mrp: 44, off: 14, rx: false, brand: 'Moov', eta: '32–47 min', category: 'Everyday essentials' },
  { id: 'omron-hem8712', name: 'Omron HEM8712 BP Monitor', sub: 'Box of 1 Unit', price: 1821, mrp: 2142, off: 15, rx: false, brand: 'Omron', eta: '32–47 min', category: 'Devices' },
  { id: 'tynor-lumbo', name: 'Tynor A 05 Lumbo Sacral Belt Large', sub: 'Box of 1 Belt', price: 740, mrp: 870, off: 15, rx: false, brand: 'Tynor', eta: '32–47 min', category: 'Ortho & pain care' },
  { id: 'tynor-grip', name: 'Tynor Tynogrip Training Gloves with Support', sub: 'Pair', price: 249, mrp: 295, off: 16, rx: false, brand: 'Tynor', eta: '32–47 min', category: 'Ortho & pain care' },
  { id: 'volini-spray', name: 'Volini Spray Spray for Sprain, Muscle and Joint Pain', sub: 'Bottle of 55 ml', price: 189, mrp: 225, off: 16, rx: false, brand: 'Volini', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'zandu-balm', name: 'Zandu Balm', sub: 'Bottle of 25 ml Balm', price: 99, mrp: 116, off: 15, rx: false, brand: 'Zandu', eta: '32–47 min', category: 'Ayurveda' },
  { id: 'zandu-balm-s', name: 'Zandu Balm', sub: 'Bottle of 25 ml Balm', price: 99, mrp: 116, off: 15, rx: false, brand: 'Zandu', eta: '32–47 min', category: 'Ayurveda' },
  { id: 'zandu-balm-everyday', name: 'Zandu Balm', sub: 'Bottle of 25 ml Balm', price: 99, mrp: 116, off: 15, rx: false, brand: 'Zandu', eta: '32–47 min', category: 'Ayurveda' },
  { id: 'DRS001717', name: 'Acceclowoc-P Tablet', sub: 'Aceclofenac (100mg) + Paracetamol (325mg) · Pain relief', price: 76, rx: true, brand: 'Acceclowoc-P', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'DRS002133', name: 'Aceclo Plus Tablet', sub: 'Aceclofenac (100mg) + Paracetamol (325mg) · Pain relief', price: 99, rx: true, brand: 'Aceclo', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'DRS002244', name: 'aceclo-MR Tablet', sub: 'Aceclofenac (100mg) + Paracetamol (325mg) + Chlorzoxazone (500mg) · Treatment of Muscular pain', price: 91, rx: true, brand: 'aceclo-MR', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'DRS012226', name: 'Alex P Paed Drop', sub: 'Chlorpheniramine Maleate (2mg/ml) + Paracetamol (125mg/ml) + Phenylephrine (2.5mg/ml) · Treatment of Common cold', price: 76, rx: true, brand: 'Alex', eta: '32–47 min', category: 'Cough & Cold' },
  { id: 'DRS013063', name: 'Alkem Cold Suspension', sub: 'Cetirizine (2.5mg/5ml) + Paracetamol (125mg/5ml) + Phenylephrine (2.5mg/5ml) · Treatment of Common cold', price: 45, rx: true, brand: 'Alkem', eta: '32–47 min', category: 'Cough & Cold' },
  { id: 'DRS023315', name: 'Arflur-MR Tablet', sub: 'Aceclofenac (100mg) + Paracetamol (325mg) + Chlorzoxazone (500mg) · Treatment of Muscular pain', price: 47, rx: true, brand: 'Arflur-MR', eta: '32–47 min', category: 'Cough & Cold' },
  { id: 'DRS045014', name: 'Brustan 400 mg/325 mg Tablet', sub: 'Ibuprofen (400mg) + Paracetamol (325mg) · Pain relief', price: 12, rx: true, brand: 'Brustan', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'DRS045714', name: 'Buta Proxyvon Capsule', sub: 'Diclofenac (50mg) + Paracetamol (325mg) · Pain relief', price: 77, rx: true, brand: 'Buta', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'DRS058819', name: 'Cetrizine Cold DS Syrup', sub: 'Cetirizine (2.5mg/5ml) + Paracetamol (250mg/5ml) + Phenylephrine (2.5mg/5ml) · Treatment of Common cold', price: 72, rx: true, brand: 'Cetrizine', eta: '32–47 min', category: 'Cough & Cold' },
  { id: 'DRS060091', name: 'Chymocad Tablet', sub: 'Aceclofenac (100mg) + Paracetamol (325mg) + Trypsin Chymotrypsin (50000AU) · Pain relief', price: 108, rx: true, brand: 'Chymocad', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'DRS060191', name: 'Chymonet AP Tablet', sub: 'Aceclofenac (100mg) + Paracetamol (325mg) + Trypsin Chymotrypsin (50000AU) · Pain relief', price: 87, rx: true, brand: 'Chymonet', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'DRS062858', name: 'Cip-Zox Tablet', sub: 'Chlorzoxazone (500mg) + Diclofenac (50mg) + Paracetamol (325mg) · Treatment of Pain due to muscle spasm', price: 78, rx: true, brand: 'Cip-Zox', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'DRS070104', name: 'Coldmine Drops', sub: 'Chlorpheniramine Maleate (1mg) + Paracetamol (125mg) + Phenylephrine (5mg) · Treatment of Common cold', price: 60, rx: true, brand: 'Coldmine', eta: '32–47 min', category: 'Cough & Cold' },
  { id: 'DRS076501', name: 'Cyclopam Tablet', sub: 'Dicyclomine (20mg) + Paracetamol (500mg) · Treatment of Abdominal pain', price: 53, rx: true, brand: 'Cyclopam', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'ab64', name: 'Diclofam - MR', sub: 'Diclofenac Potassium 50mg, Paracetamol 325mg & Chlorzoxazone 250mg', price: 78, rx: true, brand: 'Diclofam', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'DRS087673', name: 'Dicloran A Tablet', sub: 'Diclofenac (50mg) + Paracetamol (325mg) · Pain relief', price: 71, rx: true, brand: 'Dicloran', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'DRS385984', name: 'Diecold Plus Tablet', sub: 'Aceclofenac (100mg) + Paracetamol (325mg) + Cetirizine (10mg) + Phenylephrine (5mg) + Caffeine (25mg) · Treatment of Common cold', price: 51, rx: true, brand: 'Diecold', eta: '32–47 min', category: 'Cough & Cold' },
  { id: 'DRS109956', name: 'Etoford P 60 mg/325 mg Tablet', sub: 'Etoricoxib (60mg) + Paracetamol (325mg) · Pain relief', price: 88, rx: true, brand: 'Etoford', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'DRS110757', name: 'Etorvel-P 60mg/325mg Tablet', sub: 'Etoricoxib (60mg) + Paracetamol (325mg) · Pain relief', price: 88, rx: true, brand: 'Etorvel-P', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'DRS120861', name: 'Flexon Tablet', sub: 'Ibuprofen (400mg) + Paracetamol (325mg) · Pain relief', price: 30, rx: true, brand: 'Flexon', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'DRS131694', name: 'Glenpara Cold & Flu Tablet', sub: 'Caffeine (30mg) + Diphenhydramine (25mg) + Paracetamol (325mg) + Phenylephrine (5mg) · Treatment of Common cold', price: 37, rx: true, brand: 'Glenpara', eta: '32–47 min', category: 'Cough & Cold' },
  { id: 'DRS162525', name: 'Leemol DC Syrup', sub: 'Dicyclomine (20mg) + Paracetamol (325mg) · Treatment of Abdominal pain', price: 43, rx: true, brand: 'Leemol', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'DRS162530', name: 'Leemol Spas Suspension', sub: 'Mefenamic Acid (50mg/5ml) + Paracetamol (125mg/5ml) · Pain relief', price: 51, rx: true, brand: 'Leemol', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'DRS173601', name: 'Luhar-SP Tablet', sub: 'Aceclofenac (100mg) + Paracetamol (325mg) + Serratiopeptidase (15mg) · Pain relief', price: 96, rx: true, brand: 'Luhar-SP', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'DRS174872', name: 'Lupisulide P Tablet', sub: 'Nimesulide (100mg) + Paracetamol (325mg) · Pain relief', price: 58, rx: true, brand: 'Lupisulide', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'ab59', name: 'M-Cold Plus New', sub: 'Paracetamol 500mg, Phenylephrine Hydrochloride 5mg, Caffeine 30mg & Diphenhydramine Hydrochloride 25mg', price: 98, rx: true, brand: 'M-Cold', eta: '32–47 min', category: 'Cough & Cold' },
  { id: 'ab76', name: 'Maxofen New', sub: 'Aceclofenac 100mg & Paracetamol 325mg', price: 107, rx: true, brand: 'Maxofen', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'DRS182275', name: 'Mefipic Oral Suspension Mango', sub: 'Mefenamic Acid (100mg) + Paracetamol (250mg) · Pain relief', price: 43, rx: true, brand: 'Mefipic', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'DRS201520', name: 'Nedolide P 100mg/325mg Tablet', sub: 'Nimesulide (100mg) + Paracetamol (325mg) · Pain relief', price: 6, rx: true, brand: 'Nedolide', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'DRS207724', name: 'Nimucet MF Syrup', sub: 'Mefenamic Acid (50mg) + Paracetamol (125mg) · Pain relief', price: 49, rx: true, brand: 'Nimucet', eta: '32–47 min', category: 'Fever & Pain' },
  { id: 'DRS209209', name: 'Nobel Cold New Tablet', sub: 'Caffeine (30mg) + Diphenhydramine (25mg) + Paracetamol (500mg) + Phenylephrine (5mg) · Treatment of Common cold', price: 47, rx: true, brand: 'Nobel', eta: '32–47 min', category: 'Cough & Cold' },
  { id: 'DRS209210', name: 'Nobel Cold Oral Suspension Orange', sub: 'Chlorpheniramine Maleate (0.5mg/5ml) + Paracetamol (125mg/5ml) + Phenylephrine (5mg/5ml) + Sodium Citrate (60mg/5ml) + Menthol (1mg/5ml) · Treatment of Dry cough', price: 49, rx: true, brand: 'Nobel', eta: '32–47 min', category: 'Cough & Cold' },
  { id: 'ab57', name: 'Phensedyl Cough Tablets', sub: 'Paracetamol 500mg, Phenylephrine Hydrochloride 5mg, Caffeine 30mg & Diphenhydramine Hydrochloride 25mg', price: 84, rx: true, brand: 'Phensedyl', eta: '32–47 min', category: 'Cough & Cold' },
  { id: 'DRS338418', name: 'Zedex-P Syrup', sub: 'Chlorpheniramine Maleate (0.5mg/5ml) + Paracetamol (125mg/5ml) + Phenylephrine (5mg/5ml) + Sodium Citrate (60mg/5ml) + Menthol (1mg/5ml) · Treatment of Dry cough', price: 105, rx: true, brand: 'Zedex-P', eta: '32–47 min', category: 'Cough & Cold' },
];

/** Look a product up by id. */
export function findProduct(id: string): CatalogueProduct | undefined {
  return catalogue.find((product) => product.id === id);
}

/** Every distinct brand in the catalogue. */
export function brandCount(products: CatalogueProduct[] = catalogue): number {
  return new Set(products.map((product) => product.brand)).size;
}

/** The distinct categories, in catalogue order. */
export const categories: string[] = Array.from(new Set(catalogue.map((product) => product.category)));

/**
 * The initials shown on the art tile while a product photo is pending.
 */
export function initialsOf(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
