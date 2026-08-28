<?php

namespace Database\Seeders;

use App\Models\Faq;
use App\Models\Product;
use App\Models\ProductLine;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class BoozClinicalPlatformSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 0. Ensure Roles, System Settings and Users exist
        $this->call([
            RoleSeeder::class,
            SystemSettingSeeder::class,
            UserSeeder::class,
        ]);

        // 1. Seed Product Lines (4 Líneas Oficiales del Mockup)
        $linesData = [
            [
                'id' => 1,
                'name' => 'Cuidado de la piel',
                'code' => '01',
                'description' => 'Soluciones para el cuidado, protección y recuperación de la piel en diferentes condiciones.',
                'badge_color' => 'blue',
                'image_path' => '/assets/img/product_1.png',
            ],
            [
                'id' => 2,
                'name' => 'Tratamiento tópico',
                'code' => '02',
                'description' => 'Tratamientos tópicos de alta potencia antiinflamatoria, antibacteriana y antimicótica.',
                'badge_color' => 'indigo',
                'image_path' => '/assets/img/product_2.png',
            ],
            [
                'id' => 3,
                'name' => 'Salud y bienestar',
                'code' => '03',
                'description' => 'Línea de suplementación nutricional, antiparasitarios y recuperación física integral.',
                'badge_color' => 'emerald',
                'image_path' => '/assets/img/product_3.png',
            ],
            [
                'id' => 4,
                'name' => 'Cuidado especializado',
                'code' => '04',
                'description' => 'Desarrollos biomédicos avanzados para afecciones complejas, pie diabético y regeneración dérmica.',
                'badge_color' => 'purple',
                'image_path' => '/assets/img/product_4.png',
            ],
        ];

        foreach ($linesData as $ld) {
            ProductLine::updateOrCreate(['id' => $ld['id']], $ld);
        }

        // 3. Seed 18 Real Products (Datos Oficiales de A.docx y Estuches INH)
        $products = [
            // Línea 01: Cuidado de la Piel
            [
                'product_line_id' => 1,
                'name' => 'Calamicis Loción',
                'slug' => 'calamicis-locion',
                'active_ingredients' => 'Calamina + Óxido de Zinc + Dióxido de Titanio + Mentol + Alcanfor',
                'presentation' => 'Envase de 200 mL',
                'description' => 'Loción dermoprotectora y refrescante de rápida acción contra irritaciones solares, picaduras y prurito dérmico.',
                'indications' => 'Alivio de quemaduras de sol, picazón por brotes (varicela, urticaria), picaduras de insectos e irritaciones por agentes externos.',
                'posology' => 'Agitar bien antes de usar. Aplicar suavemente sobre la zona afectada con algodón o gasa limpia 3 a 4 veces al día.',
                'contraindications' => 'Hipersensibilidad a alguno de los componentes. No aplicar en heridas abiertas profundas.',
                'price' => 7.50,
                'stock' => 100,
                'is_prescription_required' => false,
                'is_active' => true,
                'image_path' => '/assets/img/product_1.png',
            ],
            [
                'product_line_id' => 1,
                'name' => 'Beducis Crema Regeneradora',
                'slug' => 'beducis-crema-regeneradora',
                'active_ingredients' => 'D-Pantenol (Pro-Vitamina B5) al 5%',
                'presentation' => 'Tubo colapsible 30g',
                'description' => 'Crema reparadora intensiva que acelera el proceso natural de regeneración y cicatrización de la barrera cutánea.',
                'indications' => 'Piel agrietada, resequedad severa, rozaduras del pañal, quemaduras solares leves y cuidado post-tatuajes.',
                'posology' => 'Aplicar una capa delgada sobre la piel limpia y seca de 2 a 3 veces al día masajeando suavemente.',
                'contraindications' => 'Hipersensibilidad conocida a los componentes de la fórmula.',
                'price' => 6.80,
                'stock' => 80,
                'is_prescription_required' => false,
                'is_active' => true,
                'image_path' => '/assets/img/product_1.png',
            ],
            [
                'product_line_id' => 1,
                'name' => 'Hidramer Emulsión Hidro-Reparadora',
                'slug' => 'hidramer-emulsion',
                'active_ingredients' => 'Ácido Hialurónico + Urea + Complejo de Ceramidas',
                'presentation' => 'Frasco con bomba dosificadora 250 mL',
                'description' => 'Emulsión emoliente que restaura la película hidrolipídica y proporciona hidratación de larga duración.',
                'indications' => 'Xerosis cutánea, resequedad extrema, descamación y tirantez en pieles atópicas o maduras.',
                'posology' => 'Aplicar diariamente en todo el cuerpo tras la ducha y reaplicar en áreas de resequedad persistente.',
                'contraindications' => 'Evitar el contacto con mucosas oculares.',
                'price' => 11.00,
                'stock' => 60,
                'is_prescription_required' => false,
                'is_active' => true,
                'image_path' => '/assets/img/product_1.png',
            ],
            [
                'product_line_id' => 1,
                'name' => 'Centellacis Crema Cicatrizante',
                'slug' => 'centellacis-crema-cicatrizante',
                'active_ingredients' => 'Extracto Estandarizado de Centella Asiática 1%',
                'presentation' => 'Tubo colapsible 30g',
                'description' => 'Estimulante biosintético de colágeno para la recuperación de marcas dérmicas, cicatrices y estrías.',
                'indications' => 'Cicatrices queloides o hipertróficas recientes, marcas post-acné, estrías y quemaduras en fase de epitelización.',
                'posology' => 'Aplicar 2 veces al día en la zona afectada realizando un masaje circular firme hasta su total absorción.',
                'contraindications' => 'No usar en heridas exudativas o con infección activa sin control antibacteriano.',
                'price' => 9.50,
                'stock' => 45,
                'is_prescription_required' => false,
                'is_active' => true,
                'image_path' => '/assets/img/product_1.png',
            ],

            // Línea 02: Tratamiento Tópico
            [
                'product_line_id' => 2,
                'name' => 'Bacumer Crema Multifactorial',
                'slug' => 'bacumer-crema-multifactorial',
                'active_ingredients' => 'Metronidazol 2.5% - Fluconazol 2% - Dexametasona 1%',
                'presentation' => 'Tubo Colapsible de 20g (Reg. E.F. 240/6)',
                'description' => '⭐ Única en el mercado con enfoque terapéutico multifactorial para lesiones cutáneas complejas de etiología mixta.',
                'indications' => 'Rosácea (reduce pápulas, pústulas y eritema), dermatitis perioral, lesiones con inflamación severa y sospecha de infección fúngico-bacteriana.',
                'posology' => 'Aplicar de 1 a 3 veces por día de 1 a 5 cm de crema dependiendo de la extensión del área afectada.',
                'contraindications' => 'Hipersensibilidad a imidazoles o corticosteroides. Evitar la exposición al sol durante el tratamiento.',
                'price' => 9.80,
                'stock' => 120,
                'is_prescription_required' => true,
                'is_active' => true,
                'image_path' => '/assets/img/product_2.png',
            ],
            [
                'product_line_id' => 2,
                'name' => 'Amikacis Crema Antibiótica',
                'slug' => 'amikacis-crema-antibiotica',
                'active_ingredients' => 'Amikacina 50mg / 20g (0.050g)',
                'presentation' => 'Tubo Colapsible de 20g',
                'description' => 'Innovación exclusiva de Booz Laboratorio. Antibiótico aminoglucósido tópico de amplio espectro para cepas bacterianas resistentes.',
                'indications' => 'Infecciones bacterianas primarias y secundarias de la piel: foliculitis profunda, forunculosis, quistes infectados y úlceras dérmicas.',
                'posology' => 'Aplicar directamente sobre la lesión limpia 2 veces al día.',
                'contraindications' => 'Hipersensibilidad a los aminoglucósidos.',
                'price' => 8.90,
                'stock' => 90,
                'is_prescription_required' => true,
                'is_active' => true,
                'image_path' => '/assets/img/Foto_Muestra_Linea_12_Estuches_Dermatologicos.jpeg',
            ],
            [
                'product_line_id' => 2,
                'name' => 'Gentamicis Crema Dérmica',
                'slug' => 'gentamicis-crema-dermica',
                'active_ingredients' => 'Gentamicina 0.1% (Reg. E.F. 240/9)',
                'presentation' => 'Tubo Colapsible de 20g',
                'description' => 'Antibiótico bactericida tópico de alta eficacia frente a gérmenes Gram positivos y Gram negativos cutáneos.',
                'indications' => 'Foliculitis, forúnculos, impétigo contagioso, quemaduras infectadas, abrasiones y cortes infectados.',
                'posology' => 'Aplicar de 1 a 3 veces al día de 1 a 5 cm de crema cubriendo el área lesionada.',
                'contraindications' => 'Hipersensibilidad a gentamicina. Almacenar a temperatura inferior a 30°C.',
                'price' => 6.50,
                'stock' => 150,
                'is_prescription_required' => true,
                'is_active' => true,
                'image_path' => '/assets/img/Foto_Muestra_Linea_12_Estuches_Dermatologicos.jpeg',
            ],
            [
                'product_line_id' => 2,
                'name' => 'Betamer Crema Antiinflamatoria',
                'slug' => 'betamer-crema-antiinflamatoria',
                'active_ingredients' => 'Betametasona 0.1%',
                'presentation' => 'Tubo Colapsible de 20g',
                'description' => 'Corticosteroide de alta potencia formulado para el control rápido de dermatosis inflamatorias moderadas a severas.',
                'indications' => 'Psoriasis en placas inflamatorias, eccemas crónicos liquenificados, liquen plano y dermatitis atópica refractaria.',
                'posology' => 'Aplicar una pequeña cantidad 1 a 2 veces al día en capa fina. No sobrepasar 2 semanas continuas de tratamiento.',
                'contraindications' => 'Infecciones virales, fúngicas o bacterianas no tratadas.',
                'price' => 7.20,
                'stock' => 110,
                'is_prescription_required' => true,
                'is_active' => true,
                'image_path' => '/assets/img/Foto_Muestra_Tubo_Betamer_Crema_20g.jpeg',
            ],
            [
                'product_line_id' => 2,
                'name' => 'Betasalicis Crema Descamativa',
                'slug' => 'betasalicis-crema',
                'active_ingredients' => 'Betametasona 0.05% + Ácido Salicílico 2%',
                'presentation' => 'Tubo Colapsible de 20g',
                'description' => 'Acción dual: el ácido salicílico desprende las escamas hiperqueratósicas y la betametasona calma la inflamación.',
                'indications' => 'Psoriasis vulgar en placas gruesas, queratodermia palmoplantar, neurodermatitis y liquen crónico simple.',
                'posology' => 'Aplicar 1 a 2 veces al día frotando suavemente.',
                'contraindications' => 'Hipersensibilidad a salicilatos o esteroides tópicos.',
                'price' => 8.40,
                'stock' => 85,
                'is_prescription_required' => true,
                'is_active' => true,
                'image_path' => '/assets/img/Foto_Muestra_Linea_12_Estuches_Dermatologicos.jpeg',
            ],
            [
                'product_line_id' => 2,
                'name' => 'Betagemer Crema Combinada',
                'slug' => 'betagemer-crema-combinada',
                'active_ingredients' => 'Betametasona 0.05% + Gentamicina 0.1%',
                'presentation' => 'Tubo Colapsible de 20g',
                'description' => 'Combate la inflamación y la infección bacteriana de forma sinérgica en dermatosis sobreinfectadas.',
                'indications' => 'Dermatitis de contacto infectada, eccema numular infectado, quemaduras con sobreinfección.',
                'posology' => 'Aplicar 2 veces al día hasta remitir la inflamación y la infección.',
                'contraindications' => 'Tuberculosis cutánea o afecciones virales de piel.',
                'price' => 8.00,
                'stock' => 95,
                'is_prescription_required' => true,
                'is_active' => true,
                'image_path' => '/assets/img/Foto_Muestra_Linea_12_Estuches_Dermatologicos.jpeg',
            ],
            [
                'product_line_id' => 2,
                'name' => 'Quadrimer Crema Terapéutica',
                'slug' => 'quadrimer-crema-terapeutica',
                'active_ingredients' => 'Betametasona + Fluconazol + Gentamicina',
                'presentation' => 'Tubo Colapsible de 20g',
                'description' => 'Terapia integral multifactorial frente a lesiones alérgicas, fúngicas e infecciosas mixtas.',
                'indications' => 'Dermatofitosis inflamatorias, tiña crural y pedis complicada con bacterias, intertrigo severo.',
                'posology' => 'Aplicar 2 veces al día en la zona afectada.',
                'contraindications' => 'Hipersensibilidad a los activos de la mezcla.',
                'price' => 9.20,
                'stock' => 105,
                'is_prescription_required' => true,
                'is_active' => true,
                'image_path' => '/assets/img/Foto_Muestra_Linea_12_Estuches_Dermatologicos.jpeg',
            ],
            [
                'product_line_id' => 2,
                'name' => 'Micosmer Crema Dual',
                'slug' => 'micosmer-crema-dual',
                'active_ingredients' => 'Fluconazol 2% + Metronidazol 2.5%',
                'presentation' => 'Tubo Colapsible de 20g',
                'description' => '⭐ Única en el mercado con la combinación de Fluconazol y Metronidazol para infecciones mixtas fúngico-anaerobias.',
                'indications' => 'Infecciones bacterianas y micóticas cutáneas, candidiasis cutánea sobreinfectada, balanitis fúngica.',
                'posology' => 'Aplicar 2 a 3 veces al día en capa fina.',
                'contraindications' => 'Hipersensibilidad a derivados azólicos o nitroimidazoles.',
                'price' => 8.60,
                'stock' => 70,
                'is_prescription_required' => true,
                'is_active' => true,
                'image_path' => '/assets/img/Foto_Muestra_Linea_12_Estuches_Dermatologicos.jpeg',
            ],
            [
                'product_line_id' => 2,
                'name' => 'Labicis / Aciclomer Antiviral',
                'slug' => 'labicis-aciclomer-antiviral',
                'active_ingredients' => 'Aciclovir al 5%',
                'presentation' => 'Tubo Colapsible de 20g',
                'description' => 'Antiviral tópico que detiene la replicación del virus del herpes y acorta la duración del brote.',
                'indications' => 'Herpes simple labial recurrente (VHS-1), herpes genital primario y recurrente (VHS-2) y herpes zóster (culebrilla).',
                'posology' => 'Iniciar en los primeros pródromos. Aplicar 5 veces al día a intervalos de 4 horas durante 5 a 10 días.',
                'contraindications' => 'Hipersensibilidad al aciclovir o valaciclovir.',
                'price' => 7.80,
                'stock' => 130,
                'is_prescription_required' => true,
                'is_active' => true,
                'image_path' => '/assets/img/Foto_Muestra_Linea_12_Estuches_Dermatologicos.jpeg',
            ],

            // Línea 03: Salud y Bienestar
            [
                'product_line_id' => 3,
                'name' => 'Albemer Suspensión Oral',
                'slug' => 'albemer-suspension-oral',
                'active_ingredients' => 'Albendazol 400mg / 10 mL',
                'presentation' => 'Envase de Polipropileno 10 mL',
                'description' => 'Antiparasitario oral de amplio espectro en dosis única. Elimina formas adultas y larvarias.',
                'indications' => 'Tratamiento de infestaciones parasitarias por Ascaris lumbricoides, Enterobius vermicularis, Trichuris trichiura, Ancylostoma duodenale.',
                'posology' => 'Agitar antes de tomar. Dosis única de 10 mL (400 mg) tanto para adultos como para niños mayores de 2 años.',
                'contraindications' => 'Contraindicado en embarazo y lactancia. Hipersensibilidad al albendazol.',
                'price' => 4.50,
                'stock' => 200,
                'is_prescription_required' => false,
                'is_active' => true,
                'image_path' => '/assets/img/Foto_Muestra_Frasco_Albemer_Suspension_10ml.jpeg',
            ],
            [
                'product_line_id' => 3,
                'name' => 'Cevitmer Gotas Puras',
                'slug' => 'cevitmer-vitamina-c',
                'active_ingredients' => 'Ácido Ascórbico (Vitamina C) 100mg/mL',
                'presentation' => 'Frasco gotero de 30 mL',
                'description' => 'Vitamina C líquida de alta biodisponibilidad para refuerzo inmunológico, formación de colágeno y defensa antioxidante.',
                'indications' => 'Prevención y tratamiento de hipovitaminosis C, aumento de defensas inmunes, cicatrización y absorción de hierro.',
                'posology' => 'Lactantes: 5 a 10 gotas/día. Niños: 15 a 20 gotas/día. Adultos: 30 a 40 gotas/día diluidas en agua o jugo.',
                'contraindications' => 'Litiasis renal oxálica o hipersensibilidad al ácido ascórbico.',
                'price' => 5.50,
                'stock' => 150,
                'is_prescription_required' => false,
                'is_active' => true,
                'image_path' => '/assets/img/product_3.png',
            ],
            [
                'product_line_id' => 3,
                'name' => 'Booz Sport Gel Crioterapéutico',
                'slug' => 'booz-sport-gel',
                'active_ingredients' => 'Mentol + Salicilato de Metilo + Extracto de Árnica',
                'presentation' => 'Tubo de 60g',
                'description' => 'Gel muscular criogénico de absorción ultrarrápida para el alivio de la sobrecarga muscular y articular tras la actividad física.',
                'indications' => 'Fatiga muscular, esguinces menores, contracturas, dolor de espalda y recuperación deportiva.',
                'posology' => 'Aplicar sobre el músculo fatigado antes y después del ejercicio realizando masaje ascendente.',
                'contraindications' => 'No aplicar sobre heridas abiertas ni cerca de los ojos.',
                'price' => 6.20,
                'stock' => 80,
                'is_prescription_required' => false,
                'is_active' => true,
                'image_path' => '/assets/img/product_3.png',
            ],

            // Línea 04: Cuidado Especializado
            [
                'product_line_id' => 4,
                'name' => 'Bactrocis Crema Especializada (Pie Diabético)',
                'slug' => 'bactrocis-moxifloxacina',
                'active_ingredients' => 'Moxifloxacina 0.5%',
                'presentation' => 'Tubo Colapsible de 20g',
                'description' => '⭐ ÚNICA EN EL MERCADO. Producida en Venezuela por Booz Laboratorio VGME C.A. Formulada específicamente para el tratamiento de infecciones complejas de tejidos blandos y Pie Diabético. Crea una barrera bioprotectora (Biofilm) que propicia la regeneración tisular y disminuye el riesgo de amputación.',
                'indications' => 'Heridas de pie diabético con deficiencia vascular, úlceras neuropáticas complejas, infecciones por patógenos resistentes en tejidos blandos.',
                'posology' => 'Aplicar una capa de 1 a 2 mm sobre la herida desbridada y limpia cada 12 a 24 horas bajo supervisión médica.',
                'contraindications' => 'Hipersensibilidad a fluoroquinolonas.',
                'price' => 14.50,
                'stock' => 75,
                'is_prescription_required' => true,
                'is_active' => true,
                'image_path' => '/assets/img/product_4.png',
            ],
            [
                'product_line_id' => 4,
                'name' => 'Salicis Gel Facial Antiacné',
                'slug' => 'salicis-gel-antiacne',
                'active_ingredients' => 'Ácido Salicílico 2% + Niacinamida 1%',
                'presentation' => 'Tubo Colapsible de 20g',
                'description' => 'Gel dermatológico queratolítico purificante. Destapa los poros obstruidos, reduce las lesiones inflamatorias y equilibra el brillo.',
                'indications' => 'Acné vulgar, comedones abiertos (puntos negros), exceso de secreción sebácea y textura irregular.',
                'posology' => 'Aplicar por la noche sobre el cutis limpio evitando el contorno de ojos. Usar protector solar en el día.',
                'contraindications' => 'Pieles extremadamente irritadas o con eccema agudo.',
                'price' => 7.90,
                'stock' => 110,
                'is_prescription_required' => false,
                'is_active' => true,
                'image_path' => '/assets/img/Mascota_Lira_3D_Crema_Salicis_Fondo_Naranja.jpeg',
            ],
        ];

        foreach ($products as $p) {
            Product::updateOrCreate(['slug' => $p['slug']], $p);
        }

        // 4. Seed Testimonials (Médicos y Pacientes Reales del Mockup)
        $testimonials = [
            [
                'quote' => 'Excelente respaldo y eficacia comprobada en nuestros pacientes. Los tratamientos tópicos de BOOZ han demostrado un desempeño clínico superior en afecciones cutáneas de difícil manejo.',
                'author_name' => 'Dr. Alejandro Méndez',
                'author_role' => 'Dermatólogo - Clínica Integral',
                'avatar_path' => '/assets/img/avatar_doctor.png',
                'is_active' => true,
            ],
            [
                'quote' => 'Los productos de BOOZ han sido un gran apoyo en nuestro trabajo diario. Su calidad y respaldo científico marcan la diferencia en los resultados de recuperación dérmica.',
                'author_name' => 'Dra. Mariana López',
                'author_role' => 'Dermatóloga Especialista',
                'avatar_path' => '/assets/img/avatar_doctor.png',
                'is_active' => true,
            ],
            [
                'quote' => 'Confío plenamente en BOOZ porque sé que están comprometidos con la salud y el bienestar. El tratamiento para dermatitis de mi hijo funcionó en solo tres días.',
                'author_name' => 'Juan Pérez',
                'author_role' => 'Paciente',
                'avatar_path' => '/assets/img/avatar_patient.png',
                'is_active' => true,
            ],
        ];

        foreach ($testimonials as $t) {
            Testimonial::updateOrCreate(['author_name' => $t['author_name']], $t);
        }

        // 5. Seed FAQs (Del Mockup Oficial)
        $faqs = [
            [
                'question' => '¿Dónde puedo encontrar información de un producto?',
                'answer' => 'Toda la información técnica detallada, composición activa, indicaciones posológicas y precauciones se encuentra disponible en nuestro catálogo digital, o consultando directamente con Lira, nuestra asistente virtual interactiva.',
                'category' => 'general',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'question' => '¿Cómo puedo conocer las presentaciones disponibles?',
                'answer' => 'En la ficha de cada producto o en el catálogo puedes consultar las presentaciones (tubos colapsibles de 20g, frascos orales de 10mL, lociones de 200mL) junto con sus características de conservación.',
                'category' => 'productos',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'question' => '¿Dónde puedo comprar productos BOOZ?',
                'answer' => 'Nuestros productos se distribuyen a través de una sólida red de farmacias autorizadas, clínicas y aliados comerciales en toda Venezuela. También puedes pulsar el botón de WhatsApp en cada producto para conectarte directamente con nuestro equipo de atención.',
                'category' => 'compras',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'question' => '¿Cómo puedo realizar una consulta o reporte de farmacovigilancia?',
                'answer' => 'Puedes acceder a nuestra sección oficial "Reportar (Farmacovigilancia y Quejas)" en el pie de página o en el menú principal para registrar sospechas de reacciones adversas, lote y fecha de vencimiento según la normativa del Instituto Nacional de Higiene.',
                'category' => 'farmacovigilancia',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'question' => '¿Dónde puedo encontrar fichas técnicas para profesionales?',
                'answer' => 'Las fichas técnicas con composición cuali-cuantitativa completa y respaldo de farmacovigilancia pueden descargarse directamente desde la página individual de cada producto o solicitándolas a nuestro departamento médico.',
                'category' => 'profesionales',
                'order' => 5,
                'is_active' => true,
            ],
        ];

        foreach ($faqs as $f) {
            Faq::updateOrCreate(['question' => $f['question']], $f);
        }

        // 6. Seed Operational Data (Messages, Quotes, Pharmacovigilance Reports)
        $this->call([
            MessageSeeder::class,
            QuoteSeeder::class,
            PharmacovigilanceReportSeeder::class,
        ]);
    }
}
