export interface Country {
    id: string;
    name: string;
    code: string;
    regions: string[];
    flag: string;
    languages: string[];
}

export const COUNTRIES: Country[] = [
    { id: "", name: "SELECT TARGET MARKET", code: "intl", regions: ["Nationwide"], flag: "🌐", languages: ["Regardless"] },
    // ── AFRICA ──
    { id: "Mauritius", name: "Mauritius", code: "mu", regions: ["Islandwide", "Plaines Wilhems", "Port Louis", "North", "South", "East", "West"], flag: "🇲🇺", languages: ["English", "French", "Creole"] },
    { id: "South Africa", name: "South Africa", code: "za", regions: ["National", "Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Free State"], flag: "🇿🇦", languages: ["English", "Afrikaans", "Zulu", "Xhosa"] },
    { id: "Kenya", name: "Kenya", code: "ke", regions: ["National", "Nairobi", "Mombasa", "Central", "Coast", "Rift Valley"], flag: "🇰🇪", languages: ["English", "Swahili"] },
    { id: "Nigeria", name: "Nigeria", code: "ng", regions: ["National", "Lagos", "Abuja", "Rivers", "Kano", "Oyo"], flag: "🇳🇬", languages: ["English", "Yoruba", "Igbo", "Hausa", "Pidgin"] },
    { id: "Ghana", name: "Ghana", code: "gh", regions: ["National", "Greater Accra", "Ashanti", "Northern"], flag: "🇬🇭", languages: ["English", "Akan", "Ewe", "Ga"] },
    { id: "Tanzania", name: "Tanzania", code: "tz", regions: ["National", "Dar es Salaam", "Arusha", "Zanzibar"], flag: "🇹🇿", languages: ["Swahili", "English"] },
    { id: "Ethiopia", name: "Ethiopia", code: "et", regions: ["National", "Addis Ababa", "Oromia", "Amhara"], flag: "🇪🇹", languages: ["Amharic", "Oromo", "Somali"] },
    { id: "Egypt", name: "Egypt", code: "eg", regions: ["National", "Cairo", "Alexandria", "Giza", "Upper Egypt"], flag: "🇪🇬", languages: ["Arabic", "English", "French"] },
    { id: "Morocco", name: "Morocco", code: "ma", regions: ["National", "Casablanca", "Rabat", "Marrakech", "Fez"], flag: "🇲🇦", languages: ["Arabic", "Berber", "French", "Spanish"] },
    { id: "Rwanda", name: "Rwanda", code: "rw", regions: ["National", "Kigali", "Eastern", "Western"], flag: "🇷🇼", languages: ["Kinyarwanda", "English", "French", "Swahili"] },
    { id: "Senegal", name: "Senegal", code: "sn", regions: ["National", "Dakar", "Thiès", "Saint-Louis"], flag: "🇸🇳", languages: ["French", "Wolof"] },
    { id: "Ivory Coast", name: "Ivory Coast", code: "ci", regions: ["National", "Abidjan", "Yamoussoukro", "Bouaké"], flag: "🇨🇮", languages: ["French"] },
    { id: "Uganda", name: "Uganda", code: "ug", regions: ["National", "Kampala", "Central", "Western"], flag: "🇺🇬", languages: ["English", "Swahili", "Luganda"] },
    { id: "Madagascar", name: "Madagascar", code: "mg", regions: ["National", "Antananarivo", "Toamasina", "Mahajanga"], flag: "🇲🇬", languages: ["Malagasy", "French"] },
    { id: "Reunion", name: "Réunion", code: "re", regions: ["Islandwide", "Saint-Denis", "Saint-Pierre", "Saint-Paul"], flag: "🇷🇪", languages: ["French", "Reunion Creole"] },
    // ── EUROPE ──
    { id: "United Kingdom", name: "United Kingdom", code: "gb", regions: ["National", "London", "Manchester", "Birmingham", "Scotland", "Wales", "Northern Ireland"], flag: "🇬🇧", languages: ["English"] },
    { id: "France", name: "France", code: "fr", regions: ["National", "Île-de-France", "Lyon", "Marseille", "Toulouse", "Bordeaux", "Nice"], flag: "🇫🇷", languages: ["French"] },
    { id: "Germany", name: "Germany", code: "de", regions: ["National", "Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"], flag: "🇩🇪", languages: ["German", "English"] },
    { id: "Italy", name: "Italy", code: "it", regions: ["National", "Rome", "Milan", "Naples", "Turin", "Florence"], flag: "🇮🇹", languages: ["Italian", "English"] },
    { id: "Spain", name: "Spain", code: "es", regions: ["National", "Madrid", "Barcelona", "Valencia", "Seville", "Basque Country"], flag: "🇪🇸", languages: ["Spanish", "Catalan", "Galician", "Basque"] },
    { id: "Netherlands", name: "Netherlands", code: "nl", regions: ["National", "Amsterdam", "Rotterdam", "The Hague", "Utrecht"], flag: "🇳🇱", languages: ["Dutch", "English"] },
    { id: "Switzerland", name: "Switzerland", code: "ch", regions: ["National", "Zurich", "Geneva", "Basel", "Bern"], flag: "🇨🇭", languages: ["German", "French", "Italian", "Romansh", "English"] },
    { id: "Belgium", name: "Belgium", code: "be", regions: ["National", "Brussels", "Flanders", "Wallonia"], flag: "🇧🇪", languages: ["Dutch", "French", "German"] },
    { id: "Portugal", name: "Portugal", code: "pt", regions: ["National", "Lisbon", "Porto", "Algarve"], flag: "🇵🇹", languages: ["Portuguese"] },
    { id: "Sweden", name: "Sweden", code: "se", regions: ["National", "Stockholm", "Gothenburg", "Malmö"], flag: "🇸🇪", languages: ["Swedish", "English"] },
    { id: "Norway", name: "Norway", code: "no", regions: ["National", "Oslo", "Bergen", "Trondheim"], flag: "🇳🇴", languages: ["Norwegian", "English"] },
    { id: "Poland", name: "Poland", code: "pl", regions: ["National", "Warsaw", "Kraków", "Gdańsk", "Wrocław"], flag: "🇵🇱", languages: ["Polish", "English"] },
    { id: "Ireland", name: "Ireland", code: "ie", regions: ["National", "Dublin", "Cork", "Galway"], flag: "🇮🇪", languages: ["English", "Irish"] },
    { id: "Greece", name: "Greece", code: "gr", regions: ["National", "Athens", "Thessaloniki", "Crete"], flag: "🇬🇷", languages: ["Greek", "English"] },
    { id: "Turkey", name: "Turkey", code: "tr", regions: ["National", "Istanbul", "Ankara", "Izmir", "Antalya"], flag: "🇹🇷", languages: ["Turkish", "English"] },
    // ── MIDDLE EAST ──
    { id: "United Arab Emirates", name: "United Arab Emirates", code: "ae", regions: ["National", "Dubai", "Abu Dhabi", "Sharjah"], flag: "🇦🇪", languages: ["Arabic", "English"] },
    { id: "Saudi Arabia", name: "Saudi Arabia", code: "sa", regions: ["National", "Riyadh", "Jeddah", "Mecca", "NEOM"], flag: "🇸🇦", languages: ["Arabic", "English"] },
    { id: "Qatar", name: "Qatar", code: "qa", regions: ["National", "Doha", "Al Wakrah"], flag: "🇶🇦", languages: ["Arabic", "English"] },
    { id: "Israel", name: "Israel", code: "il", regions: ["National", "Tel Aviv", "Jerusalem", "Haifa"], flag: "🇮🇱", languages: ["Hebrew", "Arabic", "English"] },
    { id: "Jordan", name: "Jordan", code: "jo", regions: ["National", "Amman", "Aqaba", "Irbid"], flag: "🇯🇴", languages: ["Arabic", "English"] },
    // ── ASIA PACIFIC ──
    { id: "India", name: "India", code: "in", regions: ["National", "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune"], flag: "🇮🇳", languages: ["Hindi", "English", "Bengali", "Tamil", "Telugu", "Kannada", "Malayalam", "Gujarati", "Marathi", "Punjabi"] },
    { id: "China", name: "China", code: "cn", regions: ["National", "Beijing", "Shanghai", "Shenzhen", "Guangzhou", "Chengdu", "Hangzhou"], flag: "🇨🇳", languages: ["Mandarin", "Cantonese"] },
    { id: "Japan", name: "Japan", code: "jp", regions: ["National", "Tokyo", "Osaka", "Kyoto", "Nagoya", "Fukuoka"], flag: "🇯🇵", languages: ["Japanese", "English"] },
    { id: "South Korea", name: "South Korea", code: "kr", regions: ["National", "Seoul", "Busan", "Incheon", "Daegu"], flag: "🇰🇷", languages: ["Korean", "English"] },
    { id: "Singapore", name: "Singapore", code: "sg", regions: ["National", "Central", "East", "West"], flag: "🇸🇬", languages: ["English", "Mandarin", "Malay", "Tamil"] },
    { id: "Indonesia", name: "Indonesia", code: "id", regions: ["National", "Jakarta", "Bali", "Surabaya", "Bandung"], flag: "🇮🇩", languages: ["Bahasa", "English"] },
    { id: "Malaysia", name: "Malaysia", code: "my", regions: ["National", "Kuala Lumpur", "Penang", "Johor Bahru", "Sabah"], flag: "🇲🇾", languages: ["Malay", "English", "Mandarin", "Tamil"] },
    { id: "Thailand", name: "Thailand", code: "th", regions: ["National", "Bangkok", "Chiang Mai", "Phuket", "Pattaya"], flag: "🇹🇭", languages: ["Thai", "English"] },
    { id: "Philippines", name: "Philippines", code: "ph", regions: ["National", "Metro Manila", "Cebu", "Davao"], flag: "🇵🇭", languages: ["Filipino", "English"] },
    { id: "Vietnam", name: "Vietnam", code: "vn", regions: ["National", "Ho Chi Minh City", "Hanoi", "Da Nang"], flag: "🇻🇳", languages: ["Vietnamese", "English"] },
    { id: "Pakistan", name: "Pakistan", code: "pk", regions: ["National", "Karachi", "Lahore", "Islamabad", "Rawalpindi"], flag: "🇵🇰", languages: ["Urdu", "English", "Punjabi", "Sindhi"] },
    { id: "Bangladesh", name: "Bangladesh", code: "bd", regions: ["National", "Dhaka", "Chittagong", "Sylhet"], flag: "🇧🇩", languages: ["Bengali", "English"] },
    { id: "Sri Lanka", name: "Sri Lanka", code: "lk", regions: ["National", "Colombo", "Kandy", "Galle"], flag: "🇱🇰", languages: ["Sinhala", "Tamil", "English"] },
    // ── OCEANIA ──
    { id: "Australia", name: "Australia", code: "au", regions: ["National", "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"], flag: "🇦🇺", languages: ["English"] },
    { id: "New Zealand", name: "New Zealand", code: "nz", regions: ["National", "Auckland", "Wellington", "Christchurch"], flag: "🇳🇿", languages: ["English", "Maori"] },
    // ── AMERICAS ──
    { id: "United States", name: "United States", code: "us", regions: ["National", "New York", "California", "Texas", "Florida", "Illinois", "Midwest", "Southeast", "Pacific Northwest"], flag: "🇺🇸", languages: ["English", "Spanish"] },
    { id: "Canada", name: "Canada", code: "ca", regions: ["National", "Ontario", "Quebec", "British Columbia", "Alberta"], flag: "🇨🇦", languages: ["English", "French"] },
    { id: "Mexico", name: "Mexico", code: "mx", regions: ["National", "Mexico City", "Guadalajara", "Monterrey", "Cancún"], flag: "🇲🇽", languages: ["Spanish", "English"] },
    { id: "Brazil", name: "Brazil", code: "br", regions: ["National", "São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Manaus"], flag: "🇧🇷", languages: ["Portuguese", "English"] },
    { id: "Argentina", name: "Argentina", code: "ar", regions: ["National", "Buenos Aires", "Córdoba", "Rosario", "Mendoza"], flag: "🇦🇷", languages: ["Spanish", "English"] },
    { id: "Colombia", name: "Colombia", code: "co", regions: ["National", "Bogotá", "Medellín", "Cali", "Barranquilla"], flag: "🇨🇴", languages: ["Spanish", "English"] },
    { id: "Chile", name: "Chile", code: "cl", regions: ["National", "Santiago", "Valparaíso", "Concepción"], flag: "🇨🇱", languages: ["Spanish", "English"] },
    { id: "Peru", name: "Peru", code: "pe", regions: ["National", "Lima", "Cusco", "Arequipa"], flag: "🇵🇪", languages: ["Spanish", "Quechua"] },
    // ── CARIBBEAN & ISLANDS ──
    { id: "Jamaica", name: "Jamaica", code: "jm", regions: ["National", "Kingston", "Montego Bay"], flag: "🇯🇲", languages: ["English"] },
    { id: "Trinidad and Tobago", name: "Trinidad & Tobago", code: "tt", regions: ["National", "Port of Spain", "San Fernando"], flag: "🇹🇹", languages: ["English"] },
    { id: "Seychelles", name: "Seychelles", code: "sc", regions: ["Islandwide", "Mahé", "Praslin", "La Digue"], flag: "🇸🇨", languages: ["English", "French", "Seychellois Creole"] },
    { id: "Maldives", name: "Maldives", code: "mv", regions: ["National", "Malé", "Ari Atoll"], flag: "🇲🇻", languages: ["Dhivehi", "English"] },
];

export const MARITAL_STATUSES = [
    { id: "Regardless", name: "Regardless" },
    { id: "Single", name: "Single" },
    { id: "Married", name: "Married" },
    { id: "In a Relationship", name: "In a Relationship" },
];

export const AGE_GROUPS = [
    { id: "Any", name: "Any Age" },
    { id: "18-24", name: "18 - 24 (Gen Z)" },
    { id: "25-34", name: "25 - 34 (Millennials)" },
    { id: "35-44", name: "35 - 44" },
    { id: "45-54", name: "45 - 54" },
    { id: "55-64", name: "55 - 64" },
    { id: "65+", name: "65+" },
];

export const REVENUE_GROUPS = [
    { id: "Regardless", name: "Regardless" },
    { id: "Low Income", name: "Low Income" },
    { id: "Middle Income", name: "Middle Income" },
    { id: "Upper Middle Income", name: "Upper Middle Income" },
    { id: "High Earners", name: "High Earners" },
    { id: "HNWI", name: "HNWI ($1M+ Net)" },
];

export const EDUCATION_LEVELS = [
    { id: "Regardless", name: "Regardless" },
    { id: "Secondary School", name: "Secondary School" },
    { id: "Vocational Training", name: "Vocational Training" },
    { id: "Bachelor's Degree", name: "Bachelor's Degree" },
    { id: "Master's Degree", name: "Master's Degree" },
    { id: "Doctorate / PhD", name: "Doctorate / PhD" },
];

export const EMPLOYMENT_STATUSES = [
    { id: "Regardless", name: "Regardless" },
    { id: "Unemployed", name: "Unemployed" },
    { id: "Full-Time Employee", name: "Full-Time Employee" },
    { id: "Part-Time Employee", name: "Part-Time Employee" },
    { id: "Self-Employed / Freelance", name: "Self-Employed / Freelance" },
    { id: "Business Owner / SME", name: "Business Owner / SME" },
    { id: "Retired", name: "Retired" },
    { id: "Student", name: "Student" },
];

export const URBANIZATION_LEVELS = [
    { id: "Regardless", name: "Regardless" },
    { id: "Urban", name: "Urban" },
    { id: "Suburban", name: "Suburban" },
    { id: "Rural", name: "Rural" },
];
