-- Update shipping zones to accommodate Jos, Plateau State business location
-- Drop existing zones and recreate with proper Jos/Plateau focus

-- First, remove existing shipping rates that reference old zones
delete from public.shipping_rates;

-- Remove existing zones
delete from public.shipping_zones;

-- Create new shipping zones focused on Jos, Plateau State business
insert into public.shipping_zones (name, description, countries, states, cities) values
-- Jos and Plateau State LGAs as primary zones
('Jos North LGA', 'Jos North Local Government Area - Business location', '{"Nigeria"}', '{"Plateau"}', '{"Jos", "Bukuru", "Gyel", "Vom"}'),
('Jos South LGA', 'Jos South Local Government Area', '{"Nigeria"}', '{"Plateau"}', '{"Bukuru", "Rayfield", "Angwan Rogo"}'),
('Jos East LGA', 'Jos East Local Government Area', '{"Nigeria"}', '{"Plateau"}', '{"Angware", "Dura", "Kuru"}'),
('Bassa LGA', 'Bassa Local Government Area', '{"Nigeria"}', '{"Plateau"}', '{"Bassa", "Miango", "Kwall"}'),
('Barkin Ladi LGA', 'Barkin Ladi Local Government Area', '{"Nigeria"}', '{"Plateau"}', '{"Barkin Ladi", "Gwol", "Foron"}'),
('Bokkos LGA', 'Bokkos Local Government Area', '{"Nigeria"}', '{"Plateau"}', '{"Bokkos", "Dimmuk", "Mushere"}'),
('Kanam LGA', 'Kanam Local Government Area', '{"Nigeria"}', '{"Plateau"}', '{"Kanam", "Dengi", "Garga"}'),
('Kanke LGA', 'Kanke Local Government Area', '{"Nigeria"}', '{"Plateau"}', '{"Kanke", "Chip", "Amper"}'),
('Langtang North LGA', 'Langtang North Local Government Area', '{"Nigeria"}', '{"Plateau"}', '{"Langtang", "Mabudi", "Yelwa"}'),
('Langtang South LGA', 'Langtang South Local Government Area', '{"Nigeria"}', '{"Plateau"}', '{"Mabudi", "Bwarat", "Nyelleng"}'),
('Mangu LGA', 'Mangu Local Government Area', '{"Nigeria"}', '{"Plateau"}', '{"Mangu", "Gindiri", "Ampang West"}'),
('Mikang LGA', 'Mikang Local Government Area', '{"Nigeria"}', '{"Plateau"}', '{"Mikang", "Bashar", "Piapung"}'),
('Pankshin LGA', 'Pankshin Local Government Area', '{"Nigeria"}', '{"Plateau"}', '{"Pankshin", "Chip", "Doemak"}'),
('Qua''an Pan LGA', 'Qua''an Pan Local Government Area', '{"Nigeria"}', '{"Plateau"}', '{"Baap", "Doka", "Kwalla"}'),
('Riyom LGA', 'Riyom Local Government Area', '{"Nigeria"}', '{"Plateau"}', '{"Riyom", "Tahoss", "Rim"}'),
('Shendam LGA', 'Shendam Local Government Area', '{"Nigeria"}', '{"Plateau"}', '{"Shendam", "Dorok", "Panyam"}'),
('Wase LGA', 'Wase Local Government Area', '{"Nigeria"}', '{"Plateau"}', '{"Wase", "Bashar", "Lamba"}'),

-- Other Nigerian states without LGA breakdown
('Lagos State', 'Lagos State - Major commercial hub', '{"Nigeria"}', '{"Lagos"}', '{"Lagos", "Ikeja", "Victoria Island", "Lekki", "Surulere", "Yaba"}'),
('Abuja FCT', 'Federal Capital Territory', '{"Nigeria"}', '{"FCT"}', '{"Abuja", "Gwagwalada", "Kuje", "Kwali", "Bwari", "Abaji"}'),
('Rivers State', 'Rivers State', '{"Nigeria"}', '{"Rivers"}', '{"Port Harcourt", "Obio-Akpor", "Okrika", "Eleme"}'),
('Kano State', 'Kano State', '{"Nigeria"}', '{"Kano"}', '{"Kano", "Fagge", "Dala", "Gwale"}'),
('Oyo State', 'Oyo State', '{"Nigeria"}', '{"Oyo"}', '{"Ibadan", "Ogbomoso", "Oyo", "Iseyin"}'),
('Kaduna State', 'Kaduna State', '{"Nigeria"}', '{"Kaduna"}', '{"Kaduna", "Zaria", "Kafanchan", "Kagoro"}'),
('Delta State', 'Delta State', '{"Nigeria"}', '{"Delta"}', '{"Warri", "Asaba", "Sapele", "Ughelli"}'),
('Edo State', 'Edo State', '{"Nigeria"}', '{"Edo"}', '{"Benin City", "Auchi", "Ekpoma", "Uromi"}'),
('Anambra State', 'Anambra State', '{"Nigeria"}', '{"Anambra"}', '{"Awka", "Onitsha", "Nnewi", "Ekwulobia"}'),
('Enugu State', 'Enugu State', '{"Nigeria"}', '{"Enugu"}', '{"Enugu", "Nsukka", "Oji River", "Agbani"}'),
('Imo State', 'Imo State', '{"Nigeria"}', '{"Imo"}', '{"Owerri", "Orlu", "Okigwe", "Mbaise"}'),
('Abia State', 'Abia State', '{"Nigeria"}', '{"Abia"}', '{"Umuahia", "Aba", "Arochukwu", "Ohafia"}'),
('Cross River State', 'Cross River State', '{"Nigeria"}', '{"Cross River"}', '{"Calabar", "Ogoja", "Ikom", "Obudu"}'),
('Akwa Ibom State', 'Akwa Ibom State', '{"Nigeria"}', '{"Akwa Ibom"}', '{"Uyo", "Ikot Ekpene", "Eket", "Abak"}'),
('Bayelsa State', 'Bayelsa State', '{"Nigeria"}', '{"Bayelsa"}', '{"Yenagoa", "Sagbama", "Brass", "Ekeremor"}'),
('Benue State', 'Benue State', '{"Nigeria"}', '{"Benue"}', '{"Makurdi", "Gboko", "Otukpo", "Katsina-Ala"}'),
('Borno State', 'Borno State', '{"Nigeria"}', '{"Borno"}', '{"Maiduguri", "Biu", "Dikwa", "Gubio"}'),
('Adamawa State', 'Adamawa State', '{"Nigeria"}', '{"Adamawa"}', '{"Yola", "Mubi", "Numan", "Ganye"}'),
('Bauchi State', 'Bauchi State', '{"Nigeria"}', '{"Bauchi"}', '{"Bauchi", "Azare", "Misau", "Jama''are"}'),
('Gombe State', 'Gombe State', '{"Nigeria"}', '{"Gombe"}', '{"Gombe", "Billiri", "Kaltungo", "Dukku"}'),
('Jigawa State', 'Jigawa State', '{"Nigeria"}', '{"Jigawa"}', '{"Dutse", "Hadejia", "Gumel", "Kazaure"}'),
('Kebbi State', 'Kebbi State', '{"Nigeria"}', '{"Kebbi"}', '{"Birnin Kebbi", "Argungu", "Yauri", "Zuru"}'),
('Kogi State', 'Kogi State', '{"Nigeria"}', '{"Kogi"}', '{"Lokoja", "Okene", "Idah", "Kabba"}'),
('Kwara State', 'Kwara State', '{"Nigeria"}', '{"Kwara"}', '{"Ilorin", "Offa", "Omu-Aran", "Lafiagi"}'),
('Nasarawa State', 'Nasarawa State', '{"Nigeria"}', '{"Nasarawa"}', '{"Lafia", "Keffi", "Akwanga", "Nasarawa"}'),
('Niger State', 'Niger State', '{"Nigeria"}', '{"Niger"}', '{"Minna", "Bida", "Kontagora", "Suleja"}'),
('Ondo State', 'Ondo State', '{"Nigeria"}', '{"Ondo"}', '{"Akure", "Ondo", "Owo", "Ikare"}'),
('Osun State', 'Osun State', '{"Nigeria"}', '{"Osun"}', '{"Osogbo", "Ile-Ife", "Ilesa", "Ede"}'),
('Ogun State', 'Ogun State', '{"Nigeria"}', '{"Ogun"}', '{"Abeokuta", "Ijebu Ode", "Sagamu", "Ota"}'),
('Ekiti State', 'Ekiti State', '{"Nigeria"}', '{"Ekiti"}', '{"Ado Ekiti", "Ikere", "Oye", "Efon"}'),
('Sokoto State', 'Sokoto State', '{"Nigeria"}', '{"Sokoto"}', '{"Sokoto", "Tambuwal", "Gwadabawa", "Illela"}'),
('Taraba State', 'Taraba State', '{"Nigeria"}', '{"Taraba"}', '{"Jalingo", "Wukari", "Bali", "Gembu"}'),
('Yobe State', 'Yobe State', '{"Nigeria"}', '{"Yobe"}', '{"Damaturu", "Potiskum", "Gashua", "Nguru"}'),
('Zamfara State', 'Zamfara State', '{"Nigeria"}', '{"Zamfara"}', '{"Gusau", "Kaura Namoda", "Talata Mafara", "Anka"}')
on conflict do nothing;
