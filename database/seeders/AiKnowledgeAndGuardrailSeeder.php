<?php

namespace Database\Seeders;

use App\Models\AiGuardrail;
use App\Models\AiKnowledgeDocument;
use Illuminate\Database\Seeder;

class AiKnowledgeAndGuardrailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Documentos de la Base de Conocimiento y Entrenamiento
        $documents = [
            [
                'title' => 'Vademécum Maestro & Fórmulas de los 18 Productos Oficiales de Booz Laboratorio',
                'slug' => 'vademecum-maestro-18-productos-booz-laboratorio',
                'category' => 'vademecum',
                'file_name' => 'Vademecum_Oficial_Booz_Laboratorio_18_Farmacos.txt',
                'file_path' => '/assets/docs/Vademecum_Oficial_Booz_Laboratorio_18_Farmacos.txt',
                'is_active' => true,
                'order' => 1,
                'content' => <<<EOT
================================================================================
BOOZ LABORATORIO VGME, C.A. - VADEMÉCUM CLÍNICO MAESTRO (18 PRODUCTOS)
RIF: J-40906185-0 • Planta: Valle de Guanape, Estado Anzoátegui, Venezuela
================================================================================

LÍNEA 01: CUIDADO DE LA PIEL (DERMOCOSMÉTICA Y PROTECCIÓN CUTÁNEA)
1. CALAMICIS (Frasco 200ml)
   - Principio Activo: Calamina 8% + Óxido de Zinc 8%.
   - Acción: Antipruriginoso, astringente y protector dérmico calmante.
   - Indicaciones: Alivio de dermatitis por contacto, picaduras de insectos, quemaduras solares leves y prurito cutáneo general.
   - Venta: Venta Libre.

2. BEDUCIS (Tubo 30g / 50g)
   - Principio Activo: D-Pantenol (Provitamina B5) 5%.
   - Acción: Regenerador tisular, hidratante profundo y estimulante de la epitelización.
   - Indicaciones: Prevención y tratamiento de rozaduras en lactantes, grietas en la piel y dermatitis del pañal.
   - Venta: Venta Libre.

3. HIDRAMER (Frasco dosificador 250ml)
   - Principio Activo: Urea al 10% + Ácido Hialurónico + Vitamina E.
   - Acción: Emoliente hidro-retenedor y humectante intensivo.
   - Indicaciones: Piel seca, xerosis senil, descamación e ictiosis leve.
   - Venta: Venta Libre.

4. CENTELLACIS (Gel dérmico 40g)
   - Principio Activo: Extracto estandarizado de Centella Asiática 1% + Alantoína.
   - Acción: Estimulante fibroblástico y bio-reparador de colágeno dérmico.
   - Indicaciones: Cicatrices queloides incipientes, marcas post-quirúrgicas y estrías dérmicas.
   - Venta: Venta Libre.

LÍNEA 02: TRATAMIENTO TÓPICO (FÓRMULAS ESPECIALIZADAS, ANTIBIÓTICOS Y CORTICOIDES)
5. BACTROCIS (Tubo colapsible 20g)
   - Principio Activo: Moxifloxacina Clorhidrato al 0.5% en base hidrofílica bioactiva.
   - Innovación: Tecnología de biofilm bioprotector para heridas complejas y úlceras en pie diabético.
   - Indicaciones: Infecciones complicadas de piel y tejidos blandos por patógenos resistentes (Staphylococcus aureus, Pseudomonas aeruginosa).
   - Venta: Venta bajo estricto Récipe Médico.

6. BACUMER (Tubo 20g / 40g) - REGISTRO E.F. 240/6
   - Principio Activo: Metronidazol 1% + Fluconazol 1% + Dexametasona 0.05%.
   - Acción: Triple acción antimicrobiana, antifúngica y antiinflamatoria dérmica.
   - Indicaciones: Dermatomicosis inflamadas complicadas con sobreinfección bacteriana o mixta.
   - Venta: Venta bajo estricto Récipe Médico.

7. AMIKACIS (Crema tópica 30g)
   - Principio Activo: Amikacina Sulfato 5%.
   - Acción: Aminoglucósido bactericida de amplio espectro para cepas gramnegativas resistentes.
   - Indicaciones: Piodermitis, quemaduras infectadas y foliculitis bacteriana rebelde.
   - Venta: Venta bajo Récipe Médico.

8. GENTAMICIS (Crema dérmica 20g) - REGISTRO E.F. 240/9
   - Principio Activo: Gentamicina Sulfato 0.1%.
   - Acción: Antibiótico tópico para infecciones bacterianas primarias y secundarias de la piel.
   - Indicaciones: Impétigo contagioso, ectima y dermatitis eccematoide infectada.
   - Venta: Venta bajo Récipe Médico.

9. BETAMER (Tubo 20g)
   - Principio Activo: Betametasona Dipropionato 0.05%.
   - Acción: Corticoide tópico de alta potencia con acción antiinflamatoria, antipruriginosa y vasoconstrictora.
   - Indicaciones: Dermatosis inflamatorias resistentes no infectadas (psoriasis, liquen plano, eccema severo).
   - Venta: Venta bajo Récipe Médico.

10. BETASALICIS (Tubo 30g)
    - Principio Activo: Betametasona Dipropionato 0.05% + Ácido Salicílico 3%.
    - Acción: Queratolítico más corticoide para ablandar capas hiperqueratósicas y permitir penetración del desinflamatorio.
    - Indicaciones: Psoriasis en placas, dermatitis seborreica y liquenificación hiperqueratósica.
    - Venta: Venta bajo Récipe Médico.

11. BETAGEMER (Crema combinada 20g)
    - Principio Activo: Betametasona 0.05% + Gentamicina 0.1%.
    - Acción: Antiinflamatorio esteroideo más antibacteriano de amplio espectro.
    - Indicaciones: Dermatitis y eccemas con sobreinfección bacteriana manifiesta.
    - Venta: Venta bajo Récipe Médico.

12. QUADRIMER (Crema polivalente 30g)
    - Principio Activo: Betametasona 0.05% + Clotrimazol 1% + Gentamicina 0.1% + Sulfato de Zinc.
    - Acción: Fórmula tetra-activa (antiinflamatoria, antibacteriana, antimicótica y astringente).
    - Indicaciones: Dermatosis complicadas polimicrobianas mixtas del pliegue cutáneo e intertrigo.
    - Venta: Venta bajo Récipe Médico.

13. MICOSMER (Tubo crema 30g)
    - Principio Activo: Ketoconazol 2%.
    - Acción: Antifúngico imidazólico de amplio espectro.
    - Indicaciones: Tinea corporis, tinea pedis (pie de atleta), tinea cruris y pitiriasis versicolor.
    - Venta: Venta Libre.

14. LABICIS / ACICLOMER (Tubo labial 5g)
    - Principio Activo: Aciclovir 5%.
    - Acción: Antiviral selectivo tópico.
    - Indicaciones: Herpes labial recurrente simple y lesiones vesiculares peribucales en etapas prodrómicas.
    - Venta: Venta Libre.

LÍNEA 03: SALUD Y BIENESTAR (SOLUCIONES ORALES Y SUPLEMENTACIÓN TERAPÉUTICA)
15. ALBEMER (Suspensión oral Frasco 10ml / 400mg)
    - Principio Activo: Albendazol 400mg en suspensión micronizada palatable.
    - Acción: Antihelmíntico y antiparasitario polivalente intraluminal.
    - Indicaciones: Ascaridiasis, oxiuriasis, uncinariasis, tricuriasis y giardiasis en dosis única o pautada.
    - Venta: Venta bajo Récipe Médico.

16. CEVITMER (Solución gotas orales 30ml / Frasco)
    - Principio Activo: Vitamina C (Ácido Ascórbico) 100mg/ml con sabor a naranja natural.
    - Acción: Antioxidante biológico, cofactor en la biosíntesis de colágeno y modulador del sistema inmune.
    - Indicaciones: Prevención y tratamiento de estados carenciales de Vitamina C y apoyo inmunológico.
    - Venta: Venta Libre.

17. BOOZ SPORT (Gel criogénico rubefaciente 120g)
    - Principio Activo: Mentol 5% + Salicilato de Metilo 10% + Alcanfor 3%.
    - Acción: Termogénesis dual frío/calor para alivio de espasmos musculares y mialgias post-ejercicio.
    - Indicaciones: Dolores osteomusculares leves, contracturas y fatiga deportiva.
    - Venta: Venta Libre.

18. L-FORTEX (Jarabe multivitamínico con Lisina 180ml)
    - Principio Activo: L-Lisina monoclorhidrato + Complejo B (B1, B2, B6, B12) + Nicotinamida.
    - Acción: Estimulante metabólico de síntesis proteica y apetito en convalecientes.
    - Indicaciones: Astenia, estados de desnutrición leve o recuperación post-infecciosa.
    - Venta: Venta Libre.
EOT,
            ],
            [
                'title' => 'Protocolo Operativo de Farmacovigilancia INH Rafael Rangel',
                'slug' => 'protocolo-farmacovigilancia-inh-booz-laboratorio',
                'category' => 'farmacovigilancia',
                'file_name' => 'POE_Farmacovigilancia_INH_Rafael_Rangel.txt',
                'file_path' => '/assets/docs/POE_Farmacovigilancia_INH_Rafael_Rangel.txt',
                'is_active' => true,
                'order' => 2,
                'content' => <<<EOT
================================================================================
BOOZ LABORATORIO VGME, C.A. - PROTOCOLO OPERATIVO DE FARMACOVIGILANCIA
Unidad de Farmacovigilancia Sanitaria • Conforme a Normativa Sanitaria INH
================================================================================

1. OBJETIVO GENERAL:
Monitorear, detectar, evaluar y prevenir reacciones adversas a medicamentos (RAM) producidos por Booz Laboratorio VGME, C.A. para salvaguardar la seguridad del paciente y cumplir los estándares del Instituto Nacional de Higiene "Rafael Rangel" (INHRR).

2. DEFINICIONES CLAVE:
- Reacción Adversa a Medicamento (RAM): Cualquier efecto perjudicial y no intencionado que ocurre tras la administración de un fármaco a dosis terapéuticas normales.
- Falla Terapéutica: Ausencia del efecto farmacológico esperado para una formulación dada.
- Sospecha de Defecto de Calidad: Alteración organoléptica, precipitación, cambio de coloración, ruptura o sellado defectuoso del lote.

3. INFORMACIÓN OBLIGATORIA QUE DEBE CAPTURAR LIRA AI EN CADA REPORTE:
- Identificación del fármaco sospechoso (nombre comercial y presentación).
- Número de Lote (impreso en estuche o gollete) y Fecha de Vencimiento.
- Datos del notificador (Nombre, Teléfono de contacto, Tipo: Paciente, Médico, Farmacéutico).
- Descripción detallada de la sintomatología o evento adverso y tiempo transcurrido desde la aplicación.
- Nivel de Severidad: Leve, Moderada o Grave.

4. ACCIONES SANITARIAS INMUTABLES:
- Si el usuario manifiesta síntomas alérgicos severos, disnea, shock anafiláctico o edema de glotis: instruirle con URGENCIA máxima que acuda de inmediato a un centro hospitalario o de emergencias.
- Se debe generar un ticket oficial con formato correlativo BOOZ-RAM-YYYY-XXXX para que el Oficial de Farmacovigilancia investigue la muestra de retención del lote en Valle de Guanape.
- Notificación legal en un plazo máximo de 72 horas ante el INH para eventos graves.
EOT,
            ],
            [
                'title' => 'Manual de Cotizaciones, Venta Institucional y Logística de Despacho',
                'slug' => 'manual-cotizaciones-distribucion-despacho-booz',
                'category' => 'comercial',
                'file_name' => 'Manual_Comercial_Cotizaciones_Logistica_Booz.txt',
                'file_path' => '/assets/docs/Manual_Comercial_Cotizaciones_Logistica_Booz.txt',
                'is_active' => true,
                'order' => 3,
                'content' => <<<EOT
================================================================================
BOOZ LABORATORIO VGME, C.A. - MANUAL DE COTIZACIONES Y DESPACHO COMERCIAL
Departamento de Ventas y Distribución Nacional • Planta Valle de Guanape
================================================================================

1. CANALES DE ATENCIÓN Y COTIZACIÓN:
- Bolsa de Pedidos Pública en la Tienda Virtual (Web): Permite seleccionar fármacos, especificar el Tipo de Solicitante y exportar la orden directa a WhatsApp.
- WhatsApp Comercial Oficial: +58 414 8873615.
- Atención Directa en Planta: Av. Hospital cruce con Troncal 11, Valle de Guanape, Anzoátegui.

2. SEGMENTACIÓN DE CLIENTES:
- Paciente Particular: Adquisición de tratamientos para uso personal o familiar en cantidades individuales.
- Farmacia Aliada: Descuentos comerciales especiales por volumen, condiciones de pago a plazo y suministro regular.
- Clínica / Hospital / Médico: Abastecimiento para quirófanos, salas de curas y hospitalización institucional.
- Distribuidor B2B / Droguería: Escalas mayoristas para distribución regional en Venezuela.

3. LOGÍSTICA DE DESPACHO Y ENVÍOS:
- Despacho desde la planta de manufactura en Valle de Guanape, Edo. Anzoátegui.
- Tiempos de entrega estándar: 24 a 48 horas para la región Oriente y Caracas; 48 a 72 horas para Centro y Occidente vía encomienda asegurada (MRW, Tealca, Zoom o transporte refrigerado del laboratorio si aplica).
- Emisión de Comprobante Oficial de Cotización con correlativo BOOZ-COT-YYYY-XXXX con RIF J-40906185-0.
EOT,
            ],
            [
                'title' => 'Guía de Trato, Empatía y Protocolos de Comunicación de Lira AI',
                'slug' => 'guia-trato-empatia-protocolo-comunicacion-lira',
                'category' => 'protocolo',
                'file_name' => 'Guia_Comunicacion_Empatia_Lira_BoozLab.txt',
                'file_path' => '/assets/docs/Guia_Comunicacion_Empatia_Lira_BoozLab.txt',
                'is_active' => true,
                'order' => 4,
                'content' => <<<EOT
================================================================================
GUÍA DE COMUNICACIÓN Y PERSONALIDAD DE LIRA ASISTENTE VIRTUAL
Booz Laboratorio VGME, C.A. • Asistente Científica y Mascota Oficial
================================================================================

1. ARQUETIPO Y VOZ:
Lira es una perrita científica inteligente, amable, empática y rigurosa. Viste una bata blanca de laboratorio con el isotipo de Booz Laboratorio. Su tono es cordial, claro, respetuoso y profesional, capaz de hablar con la misma soltura y calidez tanto a un paciente preocupado como a un médico dermatólogo o director técnico farmacéutico.

2. PAUTAS DE RESPUESTA:
- Saludo inicial con calidez y entusiasmo institucional.
- Explicaciones científicas claras: Evitar tecnicismos innecesarios cuando se hable a pacientes; pero mantener precisión química (concentraciones, excipientes, principios) cuando pregunte un profesional de la salud.
- Formato visual: Usa negritas para destacar nombres de medicamentos y viñetas para enumerar beneficios o indicaciones.
- Despedida con compromiso de servicio y recordatorio de que Booz Laboratorio produce salud de calidad venezolana desde Valle de Guanape.
EOT,
            ],
        ];

        foreach ($documents as $doc) {
            $doc['file_size_bytes'] = strlen($doc['content']);
            AiKnowledgeDocument::updateOrCreate(
                ['slug' => $doc['slug']],
                $doc
            );
        }

        // 2. Guardrails Sanitarios y Reglas de Contención Configurables
        $guardrails = [
            [
                'name' => 'Cero Automedicación & Prohibición de Diagnóstico Individual',
                'slug' => 'cero-automedicacion-diagnostico-individual',
                'type' => 'bloqueo_estricto',
                'is_active' => true,
                'is_system' => true,
                'order' => 1,
                'rule_instruction' => 'Está terminantemente prohibido dar diagnósticos clínicos definitivos o indicar al usuario que tome o aplique un fármaco por cuenta propia sin evaluación médica. En toda consulta sobre síntomas, dolores o heridas, explica el rol de los fármacos del catálogo pero advierte explícitamente que la prescripción la debe determinar su médico tratante.',
            ],
            [
                'name' => 'Advertencia Sanitaria de Venta Bajo Récipe Médico Obligatorio',
                'slug' => 'alerta-reciped-medico-antibioticos-esteroides',
                'type' => 'advertencia_sanitaria',
                'is_active' => true,
                'is_system' => true,
                'order' => 2,
                'rule_instruction' => 'Al mencionar fármacos que contienen antibióticos de amplio espectro (Moxifloxacina, Amikacina, Gentamicina) o esteroides/corticoides (Betametasona, Dexametasona), advierte de forma obligatoria que su expendio es bajo estricto récipe médico según regulaciones del Instituto Nacional de Higiene Rafael Rangel.',
            ],
            [
                'name' => 'Derivación Inmediata de Reacciones Adversas a Farmacovigilancia',
                'slug' => 'derivacion-inmediata-farmacovigilancia',
                'type' => 'derivacion_humana',
                'is_active' => true,
                'is_system' => true,
                'order' => 3,
                'rule_instruction' => 'Si un paciente o profesional de salud reporta un efecto secundario no deseado, alergia severa o anomalía en un fármaco, instrúyelo a suspender el uso, acudir al médico y completar el formulario oficial de Farmacovigilancia de Booz Laboratorio con el número de lote y fecha de vencimiento.',
            ],
            [
                'name' => 'Derivación a Asesoría Comercial para Compras Mayoristas o Clínicas',
                'slug' => 'derivacion-comercial-mayoristas-clinicas',
                'type' => 'derivacion_humana',
                'is_active' => true,
                'is_system' => false,
                'order' => 4,
                'rule_instruction' => 'Si el usuario consulta por compras al mayor, distribución en droguerías, pedidos para clínicas o precios institucionales, invítalo cordialmente a enviar sus datos por el formulario de contacto o comunicarse con el WhatsApp comercial oficial (+58 414 8873615).',
            ],
            [
                'name' => 'Manejo Especializado de Pie Diabético con Bactrocis',
                'slug' => 'manejo-especializado-pie-diabetico-bactrocis',
                'type' => 'advertencia_sanitaria',
                'is_active' => true,
                'is_system' => false,
                'order' => 5,
                'rule_instruction' => 'En consultas sobre pie diabético, destaca la tecnología de biofilm bioprotector de Bactrocis (Moxifloxacina 0.5%) pero enfatiza que el tratamiento del pie diabético requiere seguimiento médico multidisciplinario para evitar riesgos de amputación.',
            ],
        ];

        foreach ($guardrails as $g) {
            AiGuardrail::updateOrCreate(
                ['slug' => $g['slug']],
                $g
            );
        }
    }
}
