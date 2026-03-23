"""Comprehensive health and travel knowledge base for the AI Health Companion.

This module provides rule-based fallback data when no OpenAI API key is
configured.  It covers water safety, food safety, vaccinations, common
travel ailments, first-aid basics, emergency guidance, and medication
advice for 50+ countries and all major travel health topics.
"""

from __future__ import annotations

# ---------------------------------------------------------------------------
# Water Safety by Country  (50+ countries)
# Rating scale: SAFE / MOSTLY_SAFE / CAUTION / UNSAFE
# ---------------------------------------------------------------------------

WATER_SAFETY: dict[str, dict] = {
    # Asia
    "thailand": {
        "rating": "CAUTION",
        "details": "Tap water is NOT safe to drink in most areas. Use bottled or filtered water. Ice in tourist restaurants is usually made from purified water, but street vendors may use tap water ice.",
        "tips": ["Buy sealed bottled water", "Avoid ice from street vendors", "Use bottled water for brushing teeth", "Boil water if no bottled water available"],
    },
    "india": {
        "rating": "UNSAFE",
        "details": "Tap water is NOT safe to drink anywhere in India. Even locals typically use filtered water. High risk of waterborne diseases including cholera and typhoid.",
        "tips": ["ONLY drink sealed bottled water", "Avoid ice everywhere", "Use bottled water for brushing teeth", "Avoid raw salads washed in tap water", "Carry water purification tablets"],
    },
    "japan": {
        "rating": "SAFE",
        "details": "Tap water is safe to drink throughout Japan. Water quality is excellent and strictly regulated.",
        "tips": ["Tap water is perfectly safe", "Free water at restaurants is safe", "Vending machine drinks are all safe"],
    },
    "china": {
        "rating": "UNSAFE",
        "details": "Tap water is NOT safe to drink. Always boil or use bottled water. Hotels usually provide complimentary bottled water or electric kettles.",
        "tips": ["Drink only boiled or bottled water", "Avoid ice in drinks", "Use bottled water for brushing teeth", "Hot tea in restaurants is safe (boiled water)"],
    },
    "vietnam": {
        "rating": "UNSAFE",
        "details": "Tap water is NOT safe to drink. Use bottled water. Ice in reputable restaurants is generally safe as it is made from purified water.",
        "tips": ["Buy sealed bottled water", "Be cautious with ice from street vendors", "Peel fruits yourself", "Avoid raw vegetables at street stalls"],
    },
    "indonesia": {
        "rating": "UNSAFE",
        "details": "Tap water is NOT safe to drink, including in Bali. Always use bottled water. Refill stations with purified water are common and affordable.",
        "tips": ["ONLY drink bottled or purified water", "Bali refill stations are safe and eco-friendly", "Avoid ice from unknown sources", "Use bottled water for brushing teeth"],
    },
    "bali": {
        "rating": "UNSAFE",
        "details": "Tap water is NOT safe to drink in Bali. Use bottled or refill station water. Most tourist restaurants use purified ice, but verify at street stalls.",
        "tips": ["Use water refill stations (safe and cheap)", "Bring a reusable bottle", "Ice in tourist restaurants is generally safe", "Avoid tap water for brushing teeth"],
    },
    "cambodia": {
        "rating": "UNSAFE",
        "details": "Tap water is NOT safe to drink. Bottled water is very cheap and widely available.",
        "tips": ["Buy sealed bottled water", "Avoid ice from street vendors", "Use bottled water for brushing teeth"],
    },
    "myanmar": {
        "rating": "UNSAFE",
        "details": "Tap water is NOT safe to drink anywhere in Myanmar.",
        "tips": ["Drink only sealed bottled water", "Avoid ice", "Carry water purification tablets in rural areas"],
    },
    "laos": {
        "rating": "UNSAFE",
        "details": "Tap water is NOT safe to drink. Bottled water is readily available.",
        "tips": ["Buy sealed bottled water", "Avoid ice in rural areas", "Boil water if necessary"],
    },
    "philippines": {
        "rating": "CAUTION",
        "details": "Tap water is generally NOT safe to drink. Bottled water is recommended. Some upscale hotels may have filtered water systems.",
        "tips": ["Use bottled or purified water", "Avoid ice from unknown sources", "Be extra cautious in rural areas"],
    },
    "malaysia": {
        "rating": "CAUTION",
        "details": "Tap water is treated but not always safe to drink directly. Boiling is recommended. Bottled water is cheap.",
        "tips": ["Boil tap water or use bottled", "Ice in restaurants is generally safe", "Water in KL is better quality than rural areas"],
    },
    "singapore": {
        "rating": "SAFE",
        "details": "Tap water is safe to drink. Singapore has one of the best water treatment systems in the world.",
        "tips": ["Tap water is perfectly safe", "No need for bottled water"],
    },
    "south korea": {
        "rating": "SAFE",
        "details": "Tap water is safe to drink throughout South Korea, though many locals prefer filtered water by habit.",
        "tips": ["Tap water is safe", "Filtered water dispensers are common in public places"],
    },
    "taiwan": {
        "rating": "CAUTION",
        "details": "Tap water is treated but locals typically boil it before drinking. Bottled water is readily available.",
        "tips": ["Boil tap water or drink bottled", "Water fountains in public places provide boiled water"],
    },
    "nepal": {
        "rating": "UNSAFE",
        "details": "Tap water is NOT safe to drink. Water purification is essential, especially during trekking.",
        "tips": ["Use water purification tablets or UV purifiers", "Bottled water is available but creates waste", "Consider a SteriPEN for trekking"],
    },
    "sri lanka": {
        "rating": "CAUTION",
        "details": "Tap water is not recommended for drinking. Use bottled water.",
        "tips": ["Buy sealed bottled water", "Avoid ice from unknown sources", "Boil water if no bottled water available"],
    },

    # Middle East
    "uae": {
        "rating": "MOSTLY_SAFE",
        "details": "Tap water is desalinated and technically safe, but most residents and visitors prefer bottled water due to taste.",
        "tips": ["Tap water is safe but tastes of desalination", "Bottled water is very cheap", "Hotel water is safe"],
    },
    "qatar": {
        "rating": "MOSTLY_SAFE",
        "details": "Tap water is treated and generally safe but bottled water is preferred.",
        "tips": ["Bottled water is recommended", "Stay extra hydrated in the heat"],
    },
    "turkey": {
        "rating": "CAUTION",
        "details": "Tap water is chlorinated but not recommended for drinking in most cities. Istanbul tap water is improving but bottled is safer.",
        "tips": ["Use bottled water for drinking", "Tap water is okay for cooking and brushing teeth in cities", "Be cautious in rural areas"],
    },
    "jordan": {
        "rating": "CAUTION",
        "details": "Tap water is treated but not recommended for tourists. Bottled water is best.",
        "tips": ["Drink bottled water", "Stay very hydrated, especially in Petra and Wadi Rum"],
    },
    "egypt": {
        "rating": "UNSAFE",
        "details": "Tap water is NOT safe to drink for tourists. Use bottled water at all times.",
        "tips": ["ONLY drink sealed bottled water", "Avoid ice in drinks", "Use bottled water for brushing teeth", "Be cautious with fresh juices diluted with water"],
    },

    # Africa
    "south africa": {
        "rating": "MOSTLY_SAFE",
        "details": "Tap water is safe to drink in major cities (Cape Town, Johannesburg). Be cautious in rural areas.",
        "tips": ["Safe in major cities", "Use bottled water in rural areas", "Check local advisories"],
    },
    "kenya": {
        "rating": "UNSAFE",
        "details": "Tap water is NOT safe to drink. Always use bottled or purified water.",
        "tips": ["Buy sealed bottled water", "Use purification tablets on safari", "Avoid ice from unknown sources"],
    },
    "tanzania": {
        "rating": "UNSAFE",
        "details": "Tap water is NOT safe to drink. Use bottled water or purification methods.",
        "tips": ["Drink only bottled water", "Carry purification tablets for Kilimanjaro treks", "Avoid ice"],
    },
    "morocco": {
        "rating": "CAUTION",
        "details": "Tap water is technically treated in cities but not recommended for tourists. Bottled water is cheap.",
        "tips": ["Use bottled water", "Avoid ice in drinks", "Mint tea is safe (boiled water)"],
    },
    "ethiopia": {
        "rating": "UNSAFE",
        "details": "Tap water is NOT safe to drink. Always use bottled or boiled water.",
        "tips": ["Drink only bottled or boiled water", "Coffee ceremony water is boiled and safe", "Carry purification in rural areas"],
    },
    "ghana": {
        "rating": "UNSAFE",
        "details": "Tap water is NOT safe to drink. Use sachet water (pure water) or bottled water.",
        "tips": ["Buy sealed sachet or bottled water", "Avoid ice", "Be cautious with street beverages"],
    },
    "nigeria": {
        "rating": "UNSAFE",
        "details": "Tap water is NOT safe to drink. Use bottled or sachet water.",
        "tips": ["Drink only sealed bottled/sachet water", "Avoid ice from unknown sources"],
    },

    # Europe
    "united kingdom": {
        "rating": "SAFE",
        "details": "Tap water is safe to drink throughout the UK.",
        "tips": ["Tap water is safe everywhere", "Free water is available at restaurants by law"],
    },
    "france": {
        "rating": "SAFE",
        "details": "Tap water is safe to drink. Look for 'eau potable' signs at public fountains.",
        "tips": ["Tap water is safe", "Ask for 'une carafe d'eau' for free tap water at restaurants"],
    },
    "germany": {
        "rating": "SAFE",
        "details": "Tap water is safe and high quality throughout Germany.",
        "tips": ["Tap water is excellent quality", "Restaurants may charge for water - ask for 'Leitungswasser' for tap"],
    },
    "italy": {
        "rating": "SAFE",
        "details": "Tap water is safe to drink. Public fountains ('nasoni' in Rome) provide free safe drinking water.",
        "tips": ["Tap water is safe", "Use public fountains (nasoni) in Rome", "Unless marked 'non potabile'"],
    },
    "spain": {
        "rating": "SAFE",
        "details": "Tap water is safe in most areas. Some islands and southern regions may have mineral-heavy water.",
        "tips": ["Tap water is safe in major cities", "Bottled may taste better in some coastal areas", "Barcelona tap water is safe but tastes of chlorine"],
    },
    "portugal": {
        "rating": "SAFE",
        "details": "Tap water is safe to drink throughout Portugal.",
        "tips": ["Tap water is safe", "Some prefer bottled water for taste in the Algarve"],
    },
    "greece": {
        "rating": "MOSTLY_SAFE",
        "details": "Tap water is safe in Athens and mainland cities. Some islands may have limited water quality.",
        "tips": ["Safe on mainland", "Use bottled water on smaller islands", "Check locally on islands"],
    },
    "netherlands": {
        "rating": "SAFE",
        "details": "Tap water is among the best in the world. No chlorine is added.",
        "tips": ["Tap water is excellent - no chlorine", "Completely safe to drink"],
    },
    "switzerland": {
        "rating": "SAFE",
        "details": "Tap water is exceptional quality. Public fountains are safe unless marked otherwise.",
        "tips": ["Some of the best tap water in the world", "Public fountains are safe to drink from"],
    },
    "sweden": {
        "rating": "SAFE",
        "details": "Tap water is excellent quality throughout Sweden.",
        "tips": ["Tap water is perfectly safe and high quality"],
    },
    "norway": {
        "rating": "SAFE",
        "details": "Tap water is excellent quality throughout Norway.",
        "tips": ["Tap water is perfectly safe and high quality"],
    },
    "iceland": {
        "rating": "SAFE",
        "details": "Tap water is some of the purest in the world. Hot water may smell of sulfur but is safe.",
        "tips": ["Tap water is incredibly pure", "Hot water may smell of sulfur - this is normal and safe", "Bring a reusable bottle"],
    },
    "czech republic": {
        "rating": "SAFE",
        "details": "Tap water is safe to drink in Prague and throughout the country.",
        "tips": ["Tap water is safe", "Restaurants may push bottled water - tap is fine"],
    },
    "poland": {
        "rating": "SAFE",
        "details": "Tap water is safe to drink in major cities.",
        "tips": ["Tap water is safe in cities", "Quality has improved significantly in recent years"],
    },
    "hungary": {
        "rating": "SAFE",
        "details": "Tap water is safe to drink in Budapest and major cities.",
        "tips": ["Tap water is safe", "Thermal bath water is NOT for drinking"],
    },
    "croatia": {
        "rating": "SAFE",
        "details": "Tap water is safe to drink throughout Croatia.",
        "tips": ["Tap water is safe and tastes good"],
    },
    "russia": {
        "rating": "CAUTION",
        "details": "Tap water is treated but not recommended for drinking in most cities. Boil or use bottled water.",
        "tips": ["Use bottled water", "Boil tap water before drinking", "Moscow water is improving but bottled is safer"],
    },

    # Americas
    "united states": {
        "rating": "SAFE",
        "details": "Tap water is safe in most areas. Check local advisories for specific regions.",
        "tips": ["Generally safe throughout the country", "Check local advisories in rural areas", "Flint, MI and some areas have had issues - check locally"],
    },
    "canada": {
        "rating": "SAFE",
        "details": "Tap water is safe and high quality throughout Canada.",
        "tips": ["Tap water is safe everywhere", "Excellent water quality"],
    },
    "mexico": {
        "rating": "UNSAFE",
        "details": "Tap water is NOT safe to drink for tourists. Use bottled water. Most hotels and restaurants use purified water.",
        "tips": ["ONLY drink bottled or purified water", "Avoid ice from unknown sources", "Resort ice is usually purified", "Use bottled water for brushing teeth"],
    },
    "brazil": {
        "rating": "CAUTION",
        "details": "Tap water is treated in major cities but not recommended for tourists. Use bottled water.",
        "tips": ["Use bottled water", "Avoid ice from unknown sources", "Safe in Sao Paulo hotels but bottled is safer"],
    },
    "colombia": {
        "rating": "CAUTION",
        "details": "Tap water is safe in Bogota (one of the best in Latin America) but use bottled water elsewhere.",
        "tips": ["Bogota tap water is safe", "Use bottled water in other cities", "Be cautious in rural areas"],
    },
    "peru": {
        "rating": "UNSAFE",
        "details": "Tap water is NOT safe to drink. Use bottled water. High altitude areas require extra hydration.",
        "tips": ["Drink only bottled water", "Increase water intake at altitude (Cusco, Machu Picchu)", "Avoid ice", "Carry purification tablets for trekking"],
    },
    "argentina": {
        "rating": "MOSTLY_SAFE",
        "details": "Tap water is safe in Buenos Aires and major cities. Use bottled in rural areas.",
        "tips": ["Safe in Buenos Aires", "Use bottled water in rural areas", "Check locally in smaller towns"],
    },
    "costa rica": {
        "rating": "MOSTLY_SAFE",
        "details": "Tap water is generally safe in San Jose and major tourist areas. Use bottled in rural regions.",
        "tips": ["Safe in major tourist areas", "Use bottled water in rural/remote areas", "Check locally at your accommodation"],
    },
    "cuba": {
        "rating": "UNSAFE",
        "details": "Tap water is NOT safe to drink. Always use bottled water.",
        "tips": ["Drink only bottled water", "Avoid ice", "Water shortages can affect quality even in hotels"],
    },

    # Oceania
    "australia": {
        "rating": "SAFE",
        "details": "Tap water is safe to drink throughout Australia.",
        "tips": ["Tap water is safe everywhere", "Stay hydrated in the Outback heat", "Carry extra water when hiking"],
    },
    "new zealand": {
        "rating": "SAFE",
        "details": "Tap water is safe to drink throughout New Zealand.",
        "tips": ["Tap water is safe and excellent quality", "Some backcountry water sources may need treatment"],
    },
    "fiji": {
        "rating": "CAUTION",
        "details": "Tap water is not recommended for tourists. Use bottled water.",
        "tips": ["Use bottled water", "Resort water is usually filtered", "Boil water if no bottled available"],
    },
}


# ---------------------------------------------------------------------------
# Food Safety by Region
# ---------------------------------------------------------------------------

FOOD_SAFETY_TIPS: dict[str, dict] = {
    "southeast_asia": {
        "region_name": "Southeast Asia",
        "countries": ["Thailand", "Vietnam", "Cambodia", "Laos", "Myanmar", "Indonesia", "Philippines", "Malaysia"],
        "general_tips": [
            "Eat at busy stalls - high turnover means fresher food",
            "Make sure food is cooked fresh in front of you",
            "Avoid raw or undercooked meat and seafood",
            "Peel fruits yourself - avoid pre-cut fruit from street vendors",
            "Carry antidiarrheal medication (loperamide) as backup",
            "Wash hands frequently or use hand sanitizer before eating",
        ],
        "safe_choices": [
            "Freshly cooked pad thai, pho, or fried rice from busy vendors",
            "Grilled meats cooked in front of you",
            "Packaged snacks and sealed beverages",
            "Fruit you peel yourself (bananas, oranges, mangoes)",
        ],
        "risky_choices": [
            "Raw salads and uncooked vegetables",
            "Shellfish from street vendors",
            "Pre-cut fruit sitting in the open",
            "Buffets that have been sitting out",
            "Raw or undercooked eggs",
        ],
    },
    "south_asia": {
        "region_name": "South Asia",
        "countries": ["India", "Nepal", "Sri Lanka", "Bangladesh", "Pakistan"],
        "general_tips": [
            "Follow the 'boil it, cook it, peel it, or forget it' rule strictly",
            "Eat at reputable restaurants or busy local spots",
            "Avoid raw vegetables and salads entirely",
            "Be cautious with dairy products - ensure they are pasteurized",
            "Street food can be amazing but choose wisely - go where locals queue",
            "Carry ORS packets for rehydration",
        ],
        "safe_choices": [
            "Freshly cooked dishes served hot",
            "Bread (naan, roti) cooked fresh in tandoor",
            "Packaged and branded snacks",
            "Hot chai (boiled milk and water)",
        ],
        "risky_choices": [
            "Raw salads and uncooked vegetables",
            "Unpasteurized dairy (lassi from street vendors)",
            "Ice cream from street carts",
            "Tap water or beverages with ice",
            "Chutneys sitting out at room temperature",
        ],
    },
    "east_asia": {
        "region_name": "East Asia",
        "countries": ["China", "Japan", "South Korea", "Taiwan", "Hong Kong"],
        "general_tips": [
            "Food safety standards are generally high, especially in Japan and South Korea",
            "In China, eat at busy restaurants and ensure food is served hot",
            "Raw fish (sushi/sashimi) is safe at reputable restaurants in Japan",
            "Street food in Taiwan and Hong Kong is generally safe and delicious",
        ],
        "safe_choices": [
            "Sushi from reputable restaurants (Japan)",
            "Hot pot and freshly stir-fried dishes",
            "Night market food in Taiwan (well-regulated)",
            "Korean BBQ (cooked at your table)",
        ],
        "risky_choices": [
            "Raw meat dishes if you have a sensitive stomach",
            "Exotic meats from unregulated markets",
            "Street food in remote rural areas of China",
        ],
    },
    "africa": {
        "region_name": "Africa",
        "countries": ["Kenya", "Tanzania", "South Africa", "Morocco", "Egypt", "Ethiopia", "Ghana", "Nigeria"],
        "general_tips": [
            "Eat freshly cooked food served hot",
            "Avoid raw vegetables unless at upscale restaurants",
            "Peel all fruits yourself",
            "Be cautious with street food - choose busy vendors",
            "Carry rehydration salts and antidiarrheal medication",
        ],
        "safe_choices": [
            "Freshly grilled meats (nyama choma, braai)",
            "Cooked stews and soups served hot",
            "Sealed bottled beverages",
            "Fresh fruit you peel yourself",
        ],
        "risky_choices": [
            "Raw salads",
            "Bushmeat",
            "Unpasteurized dairy",
            "Food from vendors with poor hygiene",
        ],
    },
    "latin_america": {
        "region_name": "Latin America",
        "countries": ["Mexico", "Brazil", "Peru", "Colombia", "Argentina", "Costa Rica", "Cuba"],
        "general_tips": [
            "Mexican street tacos from busy vendors are usually safe and delicious",
            "Ceviche is common but ensure the restaurant is reputable",
            "Avoid tap water, ice, and raw vegetables in some areas",
            "Be cautious with fresh juices - they may be diluted with tap water",
        ],
        "safe_choices": [
            "Tacos from busy stands (high turnover)",
            "Grilled meats and cooked dishes",
            "Fresh tortillas made in front of you",
            "Sealed beverages",
        ],
        "risky_choices": [
            "Fresh juices that may contain tap water or ice",
            "Raw shellfish from beach vendors",
            "Salads washed in tap water",
            "Pre-prepared foods sitting in the heat",
        ],
    },
    "middle_east": {
        "region_name": "Middle East",
        "countries": ["UAE", "Turkey", "Jordan", "Egypt", "Qatar", "Saudi Arabia"],
        "general_tips": [
            "Food safety standards are generally high in the Gulf states",
            "Turkish and Middle Eastern cuisine is usually well-cooked",
            "Be cautious with street food in Egypt",
            "Hummus and falafel are generally safe if served fresh",
        ],
        "safe_choices": [
            "Freshly grilled kebabs",
            "Fresh hummus and falafel",
            "Sealed beverages",
            "Food from hotel restaurants",
        ],
        "risky_choices": [
            "Street food in less touristy areas of Egypt",
            "Unpasteurized dairy products",
            "Food that has been sitting in the heat",
        ],
    },
    "europe": {
        "region_name": "Europe",
        "countries": ["UK", "France", "Germany", "Italy", "Spain", "Netherlands", "Greece"],
        "general_tips": [
            "Food safety standards are generally very high across Europe",
            "Tap water is safe in most Western European countries",
            "Street food is generally safe but use common sense",
            "Be aware of food allergies - labeling laws are strict in the EU",
        ],
        "safe_choices": [
            "Pretty much everything from restaurants and supermarkets",
            "Street food and market food",
            "Tap water in Western Europe",
        ],
        "risky_choices": [
            "Raw milk cheeses if you are immunocompromised or pregnant",
            "Wild mushrooms unless from a verified source",
        ],
    },
}


# ---------------------------------------------------------------------------
# Vaccination Requirements by Destination
# ---------------------------------------------------------------------------

VACCINATION_INFO: dict[str, dict] = {
    "kenya": {
        "required": ["Yellow Fever (if coming from endemic area)"],
        "recommended": ["Hepatitis A", "Hepatitis B", "Typhoid", "Rabies", "Meningitis", "Polio (booster)"],
        "malaria": "High risk in most areas. Take antimalarial medication (Malarone, Doxycycline, or Mefloquine). Use DEET insect repellent and sleep under a mosquito net.",
        "notes": "Visit a travel clinic 6-8 weeks before departure.",
    },
    "tanzania": {
        "required": ["Yellow Fever (if coming from endemic area)"],
        "recommended": ["Hepatitis A", "Hepatitis B", "Typhoid", "Rabies", "Meningitis"],
        "malaria": "High risk. Antimalarial medication strongly recommended. Zanzibar also has risk.",
        "notes": "Yellow Fever certificate required if arriving from endemic country.",
    },
    "india": {
        "required": [],
        "recommended": ["Hepatitis A", "Hepatitis B", "Typhoid", "Japanese Encephalitis", "Rabies", "Cholera"],
        "malaria": "Risk varies by region. Antimalarials recommended for rural areas, especially during monsoon. Low risk in most cities.",
        "notes": "Typhoid is especially important. Consider cholera vaccine if visiting rural areas.",
    },
    "thailand": {
        "required": [],
        "recommended": ["Hepatitis A", "Hepatitis B", "Typhoid", "Japanese Encephalitis", "Rabies"],
        "malaria": "Low risk in tourist areas (Bangkok, Phuket, Chiang Mai). Risk in border areas with Myanmar/Cambodia. DEET repellent recommended everywhere for dengue prevention.",
        "notes": "Dengue fever is a bigger concern than malaria in tourist areas. Use insect repellent.",
    },
    "vietnam": {
        "required": [],
        "recommended": ["Hepatitis A", "Hepatitis B", "Typhoid", "Japanese Encephalitis", "Rabies", "Cholera"],
        "malaria": "Risk in rural highland areas. Low risk in major cities and tourist areas.",
        "notes": "Japanese Encephalitis vaccine recommended if visiting rural areas during rainy season.",
    },
    "indonesia": {
        "required": [],
        "recommended": ["Hepatitis A", "Hepatitis B", "Typhoid", "Japanese Encephalitis", "Rabies"],
        "malaria": "Risk in Papua and some eastern islands. Low risk in Bali and Java.",
        "notes": "Rabies is a concern due to stray dogs, especially in Bali. Dengue is widespread - use insect repellent.",
    },
    "bali": {
        "required": [],
        "recommended": ["Hepatitis A", "Hepatitis B", "Typhoid", "Rabies"],
        "malaria": "No malaria risk in Bali. Dengue fever is present - use insect repellent.",
        "notes": "Rabies from monkey/dog bites is a real risk. Avoid touching monkeys at temples. Get rabies vaccine if planning extended stay.",
    },
    "brazil": {
        "required": ["Yellow Fever (for certain states)"],
        "recommended": ["Hepatitis A", "Hepatitis B", "Typhoid", "Rabies"],
        "malaria": "Risk in Amazon region. No risk in Rio, Sao Paulo, or southern coastal areas.",
        "notes": "Yellow Fever vaccine required for Amazon region. Zika virus may be present.",
    },
    "peru": {
        "required": [],
        "recommended": ["Hepatitis A", "Hepatitis B", "Typhoid", "Yellow Fever", "Rabies"],
        "malaria": "Risk in Amazon basin (Iquitos). No risk in Lima, Cusco, or Machu Picchu.",
        "notes": "Yellow Fever recommended if visiting the Amazon. Altitude sickness is a concern in Cusco (3,400m).",
    },
    "mexico": {
        "required": [],
        "recommended": ["Hepatitis A", "Hepatitis B", "Typhoid", "Rabies"],
        "malaria": "Very low risk. Not needed for tourist areas.",
        "notes": "Dengue and Zika may be present in some areas. Use insect repellent.",
    },
    "egypt": {
        "required": [],
        "recommended": ["Hepatitis A", "Hepatitis B", "Typhoid", "Rabies"],
        "malaria": "No risk in tourist areas (Cairo, Luxor, Sharm el-Sheikh).",
        "notes": "Stay hydrated. Heat-related illness is common.",
    },
    "morocco": {
        "required": [],
        "recommended": ["Hepatitis A", "Hepatitis B", "Typhoid", "Rabies"],
        "malaria": "No malaria risk.",
        "notes": "Rabies vaccine recommended if you plan to be around animals.",
    },
    "south africa": {
        "required": [],
        "recommended": ["Hepatitis A", "Hepatitis B", "Typhoid", "Rabies"],
        "malaria": "Risk in Kruger Park and Limpopo province. No risk in Cape Town, Johannesburg.",
        "notes": "Antimalarials needed for safari in Kruger. Yellow Fever certificate required if arriving from endemic country.",
    },
    "cambodia": {
        "required": [],
        "recommended": ["Hepatitis A", "Hepatitis B", "Typhoid", "Japanese Encephalitis", "Rabies", "Cholera"],
        "malaria": "Risk in rural and forest areas. Low risk in Phnom Penh and Siem Reap.",
        "notes": "Dengue is a significant risk. Use insect repellent consistently.",
    },
    "nepal": {
        "required": [],
        "recommended": ["Hepatitis A", "Hepatitis B", "Typhoid", "Japanese Encephalitis", "Rabies", "Cholera"],
        "malaria": "Risk in lowland Terai region. No risk in Kathmandu or trekking areas above 1,500m.",
        "notes": "Altitude sickness is the biggest health risk for trekkers. Ascend gradually.",
    },
    "philippines": {
        "required": [],
        "recommended": ["Hepatitis A", "Hepatitis B", "Typhoid", "Japanese Encephalitis", "Rabies"],
        "malaria": "Risk in rural areas of some islands. No risk in Manila or Cebu.",
        "notes": "Dengue is widespread. Use insect repellent.",
    },
    "china": {
        "required": [],
        "recommended": ["Hepatitis A", "Hepatitis B", "Typhoid", "Japanese Encephalitis", "Rabies"],
        "malaria": "Very low risk in most tourist areas. Risk in Yunnan province border areas.",
        "notes": "Air pollution may affect respiratory health in major cities. Bring a face mask.",
    },
    "colombia": {
        "required": ["Yellow Fever (for certain jungle regions)"],
        "recommended": ["Hepatitis A", "Hepatitis B", "Typhoid", "Rabies"],
        "malaria": "Risk in rural areas below 1,700m. No risk in Bogota, Medellin, Cartagena.",
        "notes": "Yellow Fever vaccine recommended for jungle areas. Altitude sickness possible in Bogota (2,600m).",
    },
    "turkey": {
        "required": [],
        "recommended": ["Hepatitis A", "Hepatitis B", "Typhoid"],
        "malaria": "No risk in tourist areas.",
        "notes": "Standard travel vaccines are sufficient. Food and water hygiene precautions advised.",
    },
    "japan": {
        "required": [],
        "recommended": ["Hepatitis A", "Hepatitis B", "Japanese Encephalitis (rural areas)"],
        "malaria": "No malaria risk.",
        "notes": "Japan has excellent healthcare. No special vaccines needed for most visitors.",
    },
}


# ---------------------------------------------------------------------------
# Common Travel Health Issues
# ---------------------------------------------------------------------------

TRAVEL_HEALTH_TOPICS: dict[str, dict] = {
    "jet_lag": {
        "keywords": ["jet lag", "jetlag", "time zone", "can't sleep", "cant sleep", "insomnia travel", "sleep schedule"],
        "title": "Jet Lag Management",
        "response": (
            "Jet lag occurs when your body's internal clock is out of sync with your destination's time zone. "
            "Here are effective strategies to manage it:\n\n"
            "**Before Travel:**\n"
            "- Gradually shift your sleep schedule 1-2 hours toward destination time, 3-4 days before departure\n"
            "- Stay well hydrated\n\n"
            "**During Flight:**\n"
            "- Set your watch to destination time immediately\n"
            "- Sleep on the plane if it's nighttime at your destination\n"
            "- Stay hydrated - avoid excessive alcohol and caffeine\n"
            "- Move around the cabin regularly\n\n"
            "**After Arrival:**\n"
            "- Get sunlight exposure during daytime hours\n"
            "- Avoid napping longer than 20-30 minutes\n"
            "- Eat meals at local meal times\n"
            "- Exercise lightly during the day\n"
            "- Avoid screens 1 hour before bedtime\n"
            "- Melatonin (0.5-5mg) taken 30 minutes before desired bedtime can help (consult a pharmacist)\n\n"
            "**Timeline:** Most people adjust at a rate of about 1 time zone per day."
        ),
        "urgency": "LOW",
        "suggestions": ["Try melatonin supplements", "Get morning sunlight", "Stay hydrated"],
    },
    "altitude_sickness": {
        "keywords": ["altitude", "altitude sickness", "mountain sickness", "high altitude", "ams", "cusco", "la paz", "tibet", "kilimanjaro", "everest base camp", "acute mountain sickness"],
        "title": "Altitude Sickness (Acute Mountain Sickness)",
        "response": (
            "Altitude sickness can occur above 2,500m (8,200ft). It ranges from mild to life-threatening.\n\n"
            "**Symptoms (Mild AMS):**\n"
            "- Headache, nausea, dizziness\n"
            "- Fatigue, loss of appetite\n"
            "- Difficulty sleeping\n\n"
            "**Prevention:**\n"
            "- Ascend gradually - no more than 300-500m per day above 3,000m\n"
            "- Take rest days every 1,000m of elevation gain\n"
            "- Stay VERY well hydrated (3-4 liters/day)\n"
            "- Avoid alcohol and sleeping pills\n"
            "- Acetazolamide (Diamox) 125-250mg twice daily - start 1-2 days before ascent (prescription needed)\n"
            "- Eat high-carb meals\n\n"
            "**Treatment:**\n"
            "- Rest at current altitude until symptoms improve\n"
            "- Ibuprofen or paracetamol for headache\n"
            "- If symptoms worsen: DESCEND IMMEDIATELY (at least 500-1,000m)\n\n"
            "**EMERGENCY - Seek immediate help if:**\n"
            "- Severe headache not relieved by painkillers\n"
            "- Persistent vomiting\n"
            "- Loss of coordination (ataxia)\n"
            "- Confusion\n"
            "- Breathlessness at rest\n"
            "- Coughing up pink/frothy sputum (sign of HAPE)\n"
            "These indicate HACE or HAPE - life-threatening conditions requiring immediate descent and medical care."
        ),
        "urgency": "MEDIUM",
        "suggestions": ["Ascend gradually", "Stay hydrated", "Consider Diamox (consult doctor first)", "Descend if symptoms worsen"],
    },
    "travelers_diarrhea": {
        "keywords": ["diarrhea", "diarrhoea", "food poisoning", "stomach bug", "delhi belly", "montezumas revenge", "bali belly", "travelers diarrhea", "upset stomach", "loose stools", "stomach pain after eating"],
        "title": "Traveler's Diarrhea",
        "response": (
            "Traveler's diarrhea is the most common travel-related illness, affecting 30-70% of travelers to developing countries.\n\n"
            "**Immediate Treatment:**\n"
            "1. **Rehydrate** - This is the most important step\n"
            "   - Oral Rehydration Salts (ORS) - available at any pharmacy\n"
            "   - Or make your own: 1L clean water + 6 tsp sugar + 1/2 tsp salt\n"
            "   - Drink clear fluids frequently\n"
            "2. **Loperamide (Imodium)** - 4mg initially, then 2mg after each loose stool (max 16mg/day)\n"
            "   - Provides symptom relief but doesn't treat the cause\n"
            "   - Do NOT take if you have bloody stool or high fever\n"
            "3. **BRAT diet** - Bananas, Rice, Applesauce, Toast\n"
            "4. **Rest** - Let your body recover\n\n"
            "**When to see a doctor:**\n"
            "- Blood in stool\n"
            "- Fever above 38.5C / 101.3F\n"
            "- Symptoms lasting more than 3 days\n"
            "- Severe dehydration (dark urine, dizziness, rapid heartbeat)\n"
            "- Severe abdominal pain\n"
            "- Unable to keep fluids down\n\n"
            "**Prevention:**\n"
            "- Drink only bottled/purified water\n"
            "- Eat freshly cooked hot food\n"
            "- Peel fruits yourself\n"
            "- Wash hands frequently\n"
            "- Carry hand sanitizer"
        ),
        "urgency": "LOW",
        "suggestions": ["Get ORS from pharmacy", "Stay hydrated", "Try the BRAT diet", "See a doctor if symptoms persist over 3 days"],
    },
    "motion_sickness": {
        "keywords": ["motion sickness", "car sick", "seasick", "sea sick", "travel sickness", "nauseous in car", "boat sick", "dizzy on boat"],
        "title": "Motion Sickness",
        "response": (
            "Motion sickness occurs when your brain receives conflicting signals from your eyes, inner ear, and body.\n\n"
            "**Prevention (take BEFORE travel):**\n"
            "- **Dramamine / Dimenhydrinate** - Take 30-60 min before travel\n"
            "- **Meclizine (Bonine)** - Less drowsy option, take 1 hour before\n"
            "- **Scopolamine patch** - Apply behind ear 4 hours before (prescription in some countries)\n"
            "- **Ginger** - Natural remedy, ginger candy or ginger tea\n\n"
            "**During Travel:**\n"
            "- Sit in the front seat of a car, or over the wing in a plane\n"
            "- On a boat, stay in the middle and look at the horizon\n"
            "- Avoid reading or looking at screens\n"
            "- Get fresh air when possible\n"
            "- Take slow, deep breaths\n"
            "- Press the acupressure point on your inner wrist (P6 point)\n\n"
            "**If Already Sick:**\n"
            "- Focus on the horizon or a fixed point\n"
            "- Sip small amounts of clear fluid\n"
            "- Eat bland crackers\n"
            "- Close your eyes and lean head back"
        ),
        "urgency": "LOW",
        "suggestions": ["Buy Dramamine at pharmacy", "Try ginger candies", "Sit in front seat"],
    },
    "insect_bites": {
        "keywords": ["insect bite", "mosquito bite", "bug bite", "spider bite", "tick bite", "bee sting", "wasp sting", "bitten by insect", "mosquito", "dengue", "malaria prevention"],
        "title": "Insect Bites & Prevention",
        "response": (
            "Insect bites can range from minor irritations to transmitting serious diseases like malaria, dengue, and Zika.\n\n"
            "**Prevention (MOST IMPORTANT):**\n"
            "- Apply DEET-based repellent (20-50% concentration) to exposed skin\n"
            "- Picaridin 20% is an effective alternative to DEET\n"
            "- Wear long sleeves and pants at dawn and dusk\n"
            "- Sleep under a mosquito net (treated with permethrin if possible)\n"
            "- Use air conditioning when available\n"
            "- Treat clothing with permethrin spray\n\n"
            "**Treating Bites:**\n"
            "- Clean the bite with soap and water\n"
            "- Apply hydrocortisone cream (1%) for itching\n"
            "- Antihistamine tablets (cetirizine/loratadine) help reduce itching\n"
            "- Apply cold compress for swelling\n"
            "- Do NOT scratch - can lead to infection\n\n"
            "**When to See a Doctor:**\n"
            "- Signs of infection (increasing redness, warmth, pus, red streaks)\n"
            "- Fever developing after bites (could indicate malaria or dengue)\n"
            "- Severe allergic reaction (difficulty breathing, swelling of face/throat)\n"
            "- Bull's-eye rash around a tick bite (possible Lyme disease)\n"
            "- Multiple bee/wasp stings\n\n"
            "**Tick Removal:**\n"
            "- Use fine-tipped tweezers, grasp close to skin, pull straight up\n"
            "- Do NOT twist, burn, or apply petroleum jelly\n"
            "- Save the tick if possible for identification"
        ),
        "urgency": "LOW",
        "suggestions": ["Buy DEET repellent", "Get antihistamine from pharmacy", "See doctor if fever develops after bites"],
    },
    "sunburn": {
        "keywords": ["sunburn", "sun burn", "burnt skin", "sun exposure", "heat rash", "sun poisoning", "peeling skin sun", "sunstroke"],
        "title": "Sunburn & Sun Protection",
        "response": (
            "Sunburn can range from mild to severe and increases long-term skin cancer risk.\n\n"
            "**Prevention:**\n"
            "- Use SPF 30+ broad-spectrum sunscreen\n"
            "- Reapply every 2 hours and after swimming/sweating\n"
            "- Wear a wide-brimmed hat and UV-protective sunglasses\n"
            "- Seek shade during peak hours (10am-4pm)\n"
            "- UV is stronger at altitude, near water, and near the equator\n"
            "- Even on cloudy days, UV rays penetrate clouds\n\n"
            "**Treating Mild Sunburn:**\n"
            "- Cool compresses or cool (not cold) bath\n"
            "- Aloe vera gel\n"
            "- Moisturizer (avoid petroleum-based)\n"
            "- Ibuprofen for pain and inflammation\n"
            "- Drink extra water\n"
            "- Wear loose, soft clothing\n\n"
            "**When to See a Doctor:**\n"
            "- Blistering over a large area\n"
            "- Fever, chills, or nausea with sunburn\n"
            "- Severe pain not relieved by OTC painkillers\n"
            "- Signs of heat stroke: confusion, rapid pulse, hot dry skin\n"
            "- Sunburn in young children"
        ),
        "urgency": "LOW",
        "suggestions": ["Apply aloe vera gel", "Take ibuprofen for pain", "Stay out of sun until healed"],
    },
    "dehydration": {
        "keywords": ["dehydration", "dehydrated", "not drinking enough", "dark urine", "thirsty", "dry mouth", "heat exhaustion", "heat stroke", "overheating"],
        "title": "Dehydration & Heat-Related Illness",
        "response": (
            "Dehydration is extremely common in travelers, especially in hot climates. It can progress to heat exhaustion and heat stroke.\n\n"
            "**Signs of Dehydration:**\n"
            "- Dark yellow urine (should be pale straw color)\n"
            "- Dry mouth and lips\n"
            "- Headache and dizziness\n"
            "- Fatigue and weakness\n"
            "- Reduced urine output\n\n"
            "**Treatment:**\n"
            "- Drink water frequently - aim for 2-3L per day in hot climates\n"
            "- ORS (Oral Rehydration Salts) are best for moderate dehydration\n"
            "- Avoid excessive caffeine and alcohol (both dehydrate)\n"
            "- Eat water-rich foods (watermelon, cucumber, oranges)\n"
            "- Rest in shade or air conditioning\n\n"
            "**Heat Exhaustion (moderate):**\n"
            "- Heavy sweating, weakness, cold/clammy skin\n"
            "- Nausea, headache, dizziness\n"
            "- Treatment: Move to cool place, lie down, drink fluids, cool with wet cloths\n\n"
            "**HEAT STROKE (EMERGENCY):**\n"
            "- Body temperature above 40C / 104F\n"
            "- Hot, red, DRY skin (no sweating)\n"
            "- Confusion, altered consciousness\n"
            "- Rapid pulse\n"
            "- ACTION: Call emergency services IMMEDIATELY. Cool the person with any means available. This is life-threatening."
        ),
        "urgency": "MEDIUM",
        "suggestions": ["Drink water now", "Get ORS from pharmacy", "Rest in shade/AC", "CALL EMERGENCY if signs of heat stroke"],
    },
    "fever": {
        "keywords": ["fever", "high temperature", "child fever", "baby fever", "feeling hot", "chills and fever", "temperature"],
        "title": "Fever While Traveling",
        "response": (
            "Fever while traveling can have many causes, from minor infections to serious tropical diseases.\n\n"
            "**Immediate Steps:**\n"
            "1. Take your temperature if possible\n"
            "2. Take paracetamol (acetaminophen) or ibuprofen for comfort\n"
            "3. Stay hydrated - drink plenty of fluids\n"
            "4. Rest in a cool environment\n\n"
            "**When to See a Doctor URGENTLY:**\n"
            "- Fever above 39.5C / 103F\n"
            "- Fever in a child under 5 years old\n"
            "- Fever lasting more than 3 days\n"
            "- Fever after visiting a malaria-risk area (even weeks later)\n"
            "- Fever with rash\n"
            "- Fever with severe headache and stiff neck\n"
            "- Fever with difficulty breathing\n"
            "- Fever with confusion or drowsiness\n"
            "- Fever with blood in urine or stool\n\n"
            "**For Children:**\n"
            "- Use age-appropriate paracetamol dosing (check with pharmacist)\n"
            "- Do NOT give aspirin to children\n"
            "- Sponge with lukewarm (not cold) water\n"
            "- Keep the child hydrated with small frequent sips\n"
            "- Seek medical attention if the child is under 3 months old with any fever\n\n"
            "**IMPORTANT:** If you have visited a malaria-risk area, fever could be malaria. "
            "This is a medical emergency. See a doctor IMMEDIATELY for a malaria test."
        ),
        "urgency": "MEDIUM",
        "suggestions": ["Take paracetamol/ibuprofen", "Stay hydrated", "Monitor temperature", "See doctor if persistent or high"],
    },
    "allergic_reaction": {
        "keywords": ["allergic reaction", "allergy", "allergies", "hives", "rash", "swelling", "anaphylaxis", "epipen", "food allergy"],
        "title": "Allergic Reactions",
        "response": (
            "Allergic reactions while traveling can range from mild (hives) to life-threatening (anaphylaxis).\n\n"
            "**Mild Reaction (hives, itching, mild swelling):**\n"
            "- Take an antihistamine (cetirizine/loratadine/diphenhydramine)\n"
            "- Apply cool compress to affected area\n"
            "- Avoid the allergen if identified\n"
            "- Monitor for worsening symptoms\n\n"
            "**SEVERE REACTION / ANAPHYLAXIS (EMERGENCY):**\n"
            "Signs:\n"
            "- Difficulty breathing or wheezing\n"
            "- Swelling of throat, tongue, or lips\n"
            "- Dizziness or feeling faint\n"
            "- Rapid heartbeat\n"
            "- Nausea/vomiting with other symptoms\n\n"
            "Action:\n"
            "1. Use EpiPen if available (inject into outer thigh)\n"
            "2. Call emergency services IMMEDIATELY\n"
            "3. Lie down with legs elevated (unless breathing difficulty - sit up)\n"
            "4. Do NOT wait to see if it gets better\n\n"
            "**For Travelers with Known Allergies:**\n"
            "- Carry your EpiPen and antihistamines at ALL times\n"
            "- Get an allergy card translated into the local language\n"
            "- Inform restaurants of your allergies\n"
            "- Know the local emergency number"
        ),
        "urgency": "HIGH",
        "suggestions": ["Take antihistamine", "CALL EMERGENCY if breathing difficulty", "Use EpiPen if available"],
    },
}


# ---------------------------------------------------------------------------
# Finding a Doctor / Emergency Info
# ---------------------------------------------------------------------------

FIND_DOCTOR_ADVICE: dict = {
    "general": (
        "Here are steps to find medical help while traveling:\n\n"
        "1. **Hotel/Hostel Concierge** - Ask your accommodation first. They usually have a list of recommended English-speaking doctors.\n\n"
        "2. **Your Embassy/Consulate** - Most embassies maintain lists of approved local doctors who speak your language.\n"
        "   - Find your embassy: search '[your country] embassy in [destination]'\n\n"
        "3. **Travel Insurance Hotline** - If you have travel insurance, call the 24/7 assistance line. They can direct you to approved facilities and may arrange direct billing.\n\n"
        "4. **International Hospital Chains:**\n"
        "   - Bumrungrad International Hospital (Bangkok)\n"
        "   - Mount Elizabeth Hospital (Singapore)\n"
        "   - Raffles Hospital (Singapore)\n"
        "   - Apollo Hospitals (India)\n"
        "   - Gleneagles (Malaysia/Singapore)\n"
        "   - American Hospital (Dubai, Paris)\n\n"
        "5. **IAMAT** (International Association for Medical Assistance to Travellers) - iamat.org - maintains a global directory of English-speaking doctors.\n\n"
        "6. **Google Maps** - Search 'hospital near me' or 'English speaking doctor near me'\n\n"
        "7. **Local Emergency Numbers:**\n"
        "   - Know the local emergency number (often 112 in Europe, 911 in Americas)\n"
        "   - MedAssist can help you find the right number for your location"
    ),
    "by_country": {
        "japan": "In Japan, dial 119 for ambulance. Most major hospitals in Tokyo/Osaka have English-speaking staff. AMDA International Medical Information Center: 03-5285-8088. JNTO Tourist Hotline (English): 050-3816-2787.",
        "thailand": "In Thailand, dial 1669 for ambulance. Bumrungrad Hospital and Bangkok Hospital have excellent English-speaking staff. Tourist Police: 1155.",
        "india": "In India, dial 102 or 108 for ambulance. Apollo, Fortis, and Max hospitals have international patient departments with English-speaking staff.",
        "china": "In China, dial 120 for ambulance. International SOS clinics in major cities have English-speaking doctors. Beijing United Family Hospital and Shanghai United Family Hospital are popular with expats.",
        "south korea": "In South Korea, dial 119 for ambulance. International clinics at major hospitals (Samsung Medical Center, Asan Medical Center) have English-speaking staff. Medical tourism helpline: 1577-7129.",
        "vietnam": "In Vietnam, dial 115 for ambulance. FV Hospital (Ho Chi Minh City) and Vinmec (Hanoi) have English-speaking international departments.",
        "indonesia": "In Indonesia, dial 118 or 119 for ambulance. BIMC Hospital and Siloam Hospitals in Bali have English-speaking staff. For serious cases, medical evacuation to Singapore may be needed.",
        "mexico": "In Mexico, dial 911 for ambulance. Hospital ABC and Hospital Angeles chain have English-speaking staff. Most tourist areas have bilingual doctors.",
        "turkey": "In Turkey, dial 112 for ambulance. American Hospital Istanbul and Acibadem hospitals have English-speaking staff.",
        "egypt": "In Egypt, dial 123 for ambulance. As-Salam International Hospital (Cairo) has English-speaking staff. Consider medical evacuation insurance.",
        "kenya": "In Kenya, dial 999 or 112 for emergency. Nairobi Hospital and Aga Khan Hospital have good English-speaking care. AMREF Flying Doctors provides air evacuation services.",
        "brazil": "In Brazil, dial 192 for ambulance (SAMU). Hospital Albert Einstein and Hospital Sirio-Libanes in Sao Paulo have English-speaking staff.",
    },
}


# ---------------------------------------------------------------------------
# First Aid Basics
# ---------------------------------------------------------------------------

FIRST_AID: dict[str, dict] = {
    "cuts_wounds": {
        "keywords": ["cut", "wound", "bleeding", "laceration", "scrape", "gash"],
        "response": (
            "**First Aid for Cuts and Wounds:**\n\n"
            "1. **Stop the bleeding** - Apply firm pressure with a clean cloth for 10-15 minutes\n"
            "2. **Clean the wound** - Rinse with clean water. Remove debris gently\n"
            "3. **Apply antiseptic** - Use antiseptic solution or cream\n"
            "4. **Cover** - Apply a sterile bandage or clean dressing\n"
            "5. **Change dressing** - Daily or when it gets wet/dirty\n\n"
            "**See a doctor if:**\n"
            "- Bleeding doesn't stop after 15 minutes of pressure\n"
            "- Wound is deep, long (>1cm), or gaping\n"
            "- You can see fat, muscle, or bone\n"
            "- Wound is from a dirty/rusty object (tetanus risk)\n"
            "- Signs of infection: increasing redness, warmth, swelling, pus\n"
            "- You haven't had a tetanus booster in 5+ years"
        ),
        "urgency": "LOW",
    },
    "burns": {
        "keywords": ["burn", "burned", "burnt", "scald", "scalded"],
        "response": (
            "**First Aid for Burns:**\n\n"
            "1. **Cool the burn** - Run cool (not cold/ice) water over it for at least 20 minutes\n"
            "2. **Remove jewelry/clothing** near the burn (unless stuck to skin)\n"
            "3. **Cover** with a clean, non-fluffy dressing or cling film\n"
            "4. **Pain relief** - Take paracetamol or ibuprofen\n"
            "5. **Do NOT** apply butter, toothpaste, or ice\n"
            "6. **Do NOT** break blisters\n\n"
            "**See a doctor if:**\n"
            "- Burn is larger than the person's hand\n"
            "- Burn is on face, hands, feet, genitals, or joints\n"
            "- Burn is deep (white/waxy appearance, no pain = deep burn)\n"
            "- Burn completely circles a limb\n"
            "- Chemical or electrical burn\n"
            "- Person is a child under 5 or elderly"
        ),
        "urgency": "MEDIUM",
    },
    "sprains": {
        "keywords": ["sprain", "twisted ankle", "swollen ankle", "twisted knee", "wrist sprain", "rolled ankle"],
        "response": (
            "**First Aid for Sprains (RICE method):**\n\n"
            "- **R**est - Stop activity and rest the injured area\n"
            "- **I**ce - Apply ice wrapped in a cloth for 15-20 min every 2-3 hours\n"
            "- **C**ompression - Wrap with an elastic bandage (not too tight)\n"
            "- **E**levation - Keep the injured area raised above heart level\n\n"
            "**Additional Tips:**\n"
            "- Take ibuprofen for pain and swelling\n"
            "- Avoid heat, alcohol, running, and massage for first 48 hours\n"
            "- Most sprains improve within 2-4 weeks\n\n"
            "**See a doctor if:**\n"
            "- You cannot bear weight on it at all\n"
            "- Severe pain or swelling\n"
            "- Deformity or numbness\n"
            "- No improvement after 3-5 days\n"
            "- You heard a pop or snap at the time of injury"
        ),
        "urgency": "LOW",
    },
    "choking": {
        "keywords": ["choking", "can't breathe food", "something stuck throat"],
        "response": (
            "**If someone is choking:**\n\n"
            "**Mild choking (can still cough/speak):**\n"
            "- Encourage them to cough forcefully\n"
            "- Do NOT slap their back (may lodge object further)\n\n"
            "**Severe choking (cannot cough/speak/breathe):**\n"
            "1. Call emergency services immediately\n"
            "2. **Back blows**: Stand behind, lean them forward, give 5 sharp blows between shoulder blades with heel of hand\n"
            "3. **Abdominal thrusts (Heimlich)**: Stand behind, place fist above navel, grasp with other hand, pull sharply inward and upward - repeat 5 times\n"
            "4. Alternate between 5 back blows and 5 abdominal thrusts\n"
            "5. If person becomes unconscious, start CPR\n\n"
            "**For infants (under 1 year):**\n"
            "- 5 back blows (face down on your forearm)\n"
            "- 5 chest thrusts (face up, 2 fingers on breastbone)\n"
            "- Do NOT do abdominal thrusts on infants"
        ),
        "urgency": "EMERGENCY",
    },
}


# ---------------------------------------------------------------------------
# ER vs Clinic Decision Guide
# ---------------------------------------------------------------------------

ER_VS_CLINIC: dict = {
    "go_to_er": {
        "title": "GO TO EMERGENCY ROOM (ER) IMMEDIATELY",
        "conditions": [
            "Chest pain or pressure",
            "Difficulty breathing or shortness of breath",
            "Sudden severe headache (worst of your life)",
            "Signs of stroke: face drooping, arm weakness, speech difficulty",
            "Severe bleeding that won't stop",
            "Broken bones (visible deformity)",
            "Head injury with loss of consciousness",
            "Seizures",
            "Severe allergic reaction (anaphylaxis)",
            "Severe abdominal pain",
            "High fever with stiff neck",
            "Poisoning or overdose",
            "Severe burns",
            "Suicidal thoughts",
            "Pregnancy complications with bleeding or severe pain",
            "Any condition where the person is unconscious or unresponsive",
        ],
    },
    "go_to_clinic": {
        "title": "Visit a Clinic or Doctor's Office",
        "conditions": [
            "Fever without other severe symptoms",
            "Ear pain or sore throat",
            "Mild to moderate diarrhea (lasting 1-2 days)",
            "Urinary tract symptoms (burning, frequency)",
            "Minor cuts needing stitches",
            "Rashes without fever or breathing problems",
            "Sprained ankle or minor joint pain",
            "Mild allergic reactions (hives, itching)",
            "Eye infections (pink eye)",
            "Mild sunburn",
            "Insect bites without severe reaction",
            "Cold and flu symptoms",
            "Minor back pain",
            "Prescription refills needed",
        ],
    },
    "see_pharmacist": {
        "title": "Visit a Pharmacy First",
        "conditions": [
            "Common cold symptoms",
            "Mild headache",
            "Motion sickness",
            "Mild sunburn",
            "Minor insect bites (no fever)",
            "Jet lag",
            "Minor skin irritation",
            "Constipation or mild stomach upset",
            "Athlete's foot or minor fungal issues",
            "Oral rehydration salts needed",
            "Antihistamines for mild allergies",
        ],
    },
}


# ---------------------------------------------------------------------------
# Common Medication Advice
# ---------------------------------------------------------------------------

MEDICATION_ADVICE: dict[str, dict] = {
    "paracetamol": {
        "keywords": ["paracetamol", "acetaminophen", "tylenol", "panadol"],
        "info": (
            "**Paracetamol (Acetaminophen / Tylenol / Panadol)**\n"
            "- For: Pain, fever\n"
            "- Adult dose: 500-1000mg every 4-6 hours (max 4g/day)\n"
            "- Safe in pregnancy\n"
            "- WARNING: Do NOT exceed maximum dose - liver damage risk\n"
            "- Do NOT combine with alcohol\n"
            "- Available over-the-counter worldwide"
        ),
    },
    "ibuprofen": {
        "keywords": ["ibuprofen", "advil", "nurofen", "motrin"],
        "info": (
            "**Ibuprofen (Advil / Nurofen / Motrin)**\n"
            "- For: Pain, fever, inflammation\n"
            "- Adult dose: 200-400mg every 4-6 hours (max 1200mg/day OTC)\n"
            "- Take with food to reduce stomach irritation\n"
            "- Avoid if: stomach ulcers, kidney problems, asthma triggered by NSAIDs\n"
            "- Avoid in last trimester of pregnancy\n"
            "- Available over-the-counter worldwide"
        ),
    },
    "loperamide": {
        "keywords": ["loperamide", "imodium", "diarrhea medicine", "anti diarrheal"],
        "info": (
            "**Loperamide (Imodium)**\n"
            "- For: Diarrhea symptom relief\n"
            "- Adult dose: 4mg initially, then 2mg after each loose stool (max 16mg/day)\n"
            "- Do NOT use if: bloody stool, high fever, suspected bacterial dysentery\n"
            "- Best used for travel convenience (flights, long bus rides)\n"
            "- Does NOT treat the underlying cause\n"
            "- Available over-the-counter in most countries"
        ),
    },
    "antihistamine": {
        "keywords": ["antihistamine", "cetirizine", "loratadine", "benadryl", "zyrtec", "claritin", "allergy medicine"],
        "info": (
            "**Antihistamines**\n"
            "- Non-drowsy: Cetirizine (Zyrtec), Loratadine (Claritin) - 1 tablet daily\n"
            "- Drowsy (stronger): Diphenhydramine (Benadryl) - 25-50mg every 6 hours\n"
            "- For: Allergic reactions, hives, itching, insect bites, hay fever\n"
            "- Diphenhydramine causes drowsiness - do not drive\n"
            "- Available over-the-counter worldwide"
        ),
    },
    "oral_rehydration": {
        "keywords": ["ors", "oral rehydration", "rehydration salts", "electrolytes", "electrolyte"],
        "info": (
            "**Oral Rehydration Salts (ORS)**\n"
            "- For: Dehydration from diarrhea, vomiting, heat, or excessive sweating\n"
            "- Available at every pharmacy worldwide - extremely cheap\n"
            "- Dissolve 1 packet in 1 liter of clean water\n"
            "- Sip frequently throughout the day\n"
            "- DIY recipe: 1L clean water + 6 teaspoons sugar + 1/2 teaspoon salt\n"
            "- One of the most important items in your travel medical kit"
        ),
    },
    "antimalarial": {
        "keywords": ["antimalarial", "malaria pills", "malarone", "doxycycline", "mefloquine", "malaria prevention"],
        "info": (
            "**Antimalarial Medications (PRESCRIPTION REQUIRED)**\n"
            "- **Atovaquone-proguanil (Malarone)**: Start 1-2 days before, daily during, 7 days after. Fewest side effects.\n"
            "- **Doxycycline**: Start 1-2 days before, daily during, 4 weeks after. Cheap but causes sun sensitivity.\n"
            "- **Mefloquine (Lariam)**: Weekly. Start 2 weeks before. Can cause vivid dreams/psychiatric effects.\n"
            "- Must be prescribed by a doctor BEFORE travel\n"
            "- Visit a travel clinic 4-6 weeks before departure\n"
            "- Always use insect repellent and nets IN ADDITION to medication"
        ),
    },
    "travel_kit": {
        "keywords": ["travel medical kit", "first aid kit", "what to pack", "medicine to bring", "travel pharmacy"],
        "info": (
            "**Essential Travel Medical Kit:**\n"
            "- Paracetamol AND Ibuprofen\n"
            "- Loperamide (Imodium) for diarrhea\n"
            "- Oral Rehydration Salts (ORS) - 5-10 packets\n"
            "- Antihistamines (cetirizine + diphenhydramine)\n"
            "- Antiseptic cream and wipes\n"
            "- Adhesive bandages (plasters) in various sizes\n"
            "- Sterile gauze and medical tape\n"
            "- Tweezers (for splinters/ticks)\n"
            "- Thermometer\n"
            "- Insect repellent (DEET 20-50%)\n"
            "- Sunscreen SPF 30+\n"
            "- Motion sickness tablets\n"
            "- Personal prescription medications (with doctor's note)\n"
            "- Hand sanitizer\n"
            "- Blister plasters (if hiking)\n"
            "- Hydrocortisone cream 1% (for bites/rashes)"
        ),
    },
}


# ---------------------------------------------------------------------------
# Emergency Numbers by Country
# ---------------------------------------------------------------------------

EMERGENCY_NUMBERS: dict[str, dict] = {
    "thailand": {"police": "191", "ambulance": "1669", "tourist_police": "1155", "fire": "199"},
    "india": {"police": "100", "ambulance": "102/108", "fire": "101", "universal": "112"},
    "japan": {"police": "110", "ambulance": "119", "fire": "119"},
    "china": {"police": "110", "ambulance": "120", "fire": "119"},
    "vietnam": {"police": "113", "ambulance": "115", "fire": "114"},
    "indonesia": {"police": "110", "ambulance": "118/119", "fire": "113"},
    "south korea": {"police": "112", "ambulance": "119", "fire": "119"},
    "singapore": {"police": "999", "ambulance": "995", "fire": "995"},
    "malaysia": {"police": "999", "ambulance": "999", "fire": "994"},
    "philippines": {"police": "117", "ambulance": "911", "fire": "911"},
    "cambodia": {"police": "117", "ambulance": "119", "fire": "118"},
    "nepal": {"police": "100", "ambulance": "102", "fire": "101"},
    "myanmar": {"police": "199", "ambulance": "192", "fire": "191"},
    "sri lanka": {"police": "119", "ambulance": "110", "fire": "111"},
    "united states": {"universal": "911"},
    "canada": {"universal": "911"},
    "mexico": {"universal": "911"},
    "brazil": {"police": "190", "ambulance": "192", "fire": "193"},
    "colombia": {"universal": "123"},
    "peru": {"police": "105", "ambulance": "116", "fire": "116"},
    "argentina": {"police": "101", "ambulance": "107", "fire": "100"},
    "costa rica": {"universal": "911"},
    "united kingdom": {"universal": "999/112"},
    "france": {"police": "17", "ambulance": "15", "fire": "18", "universal": "112"},
    "germany": {"police": "110", "ambulance": "112", "fire": "112"},
    "italy": {"police": "113", "ambulance": "118", "fire": "115", "universal": "112"},
    "spain": {"universal": "112"},
    "netherlands": {"universal": "112"},
    "switzerland": {"police": "117", "ambulance": "144", "fire": "118", "universal": "112"},
    "greece": {"universal": "112"},
    "turkey": {"police": "155", "ambulance": "112", "fire": "110"},
    "uae": {"police": "999", "ambulance": "998", "fire": "997"},
    "egypt": {"police": "122", "ambulance": "123", "fire": "180"},
    "south africa": {"universal": "10111", "ambulance": "10177"},
    "kenya": {"police": "999", "ambulance": "999", "fire": "999"},
    "tanzania": {"police": "112", "ambulance": "114", "fire": "114"},
    "morocco": {"police": "19", "ambulance": "15", "fire": "15"},
    "australia": {"universal": "000"},
    "new zealand": {"universal": "111"},
    "qatar": {"universal": "999"},
    "jordan": {"police": "911", "ambulance": "911", "fire": "911"},
    "russia": {"universal": "112", "police": "102", "ambulance": "103", "fire": "101"},
}


# ---------------------------------------------------------------------------
# Medical Disclaimer (appended to every response)
# ---------------------------------------------------------------------------

MEDICAL_DISCLAIMER = (
    "\n\n---\n"
    "**Medical Disclaimer:** This information is for general guidance only and is NOT a substitute "
    "for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified "
    "healthcare provider with any questions about a medical condition. If you think you may have a "
    "medical emergency, call your local emergency number immediately."
)
