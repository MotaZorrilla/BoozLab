export interface ProductLine {
    id: number;
    name: string;
    code: string;
    description: string | null;
    badge_color: string;
    image_path: string | null;
    products?: Product[];
}

export interface Product {
    id: number;
    product_line_id: number;
    name: string;
    slug: string;
    active_ingredients: string;
    presentation: string;
    description: string;
    indications: string;
    posology: string | null;
    contraindications: string | null;
    price: number | string;
    stock: number;
    is_prescription_required: boolean;
    is_active: boolean;
    image_path: string;
    pdf_path: string | null;
    product_line?: ProductLine;
    created_at?: string;
    updated_at?: string;
}

export interface Testimonial {
    id: number;
    quote: string;
    author_name: string;
    author_role: string;
    avatar_path: string;
    is_active: boolean;
}

export interface Faq {
    id: number;
    question: string;
    answer: string;
    category: string;
    order: number;
    is_active: boolean;
}

export interface PharmacovigilanceReport {
    id: number;
    ticket_number: string;
    product_id: number | null;
    product_name: string;
    batch_number: string | null;
    expiry_date: string | null;
    reporter_name: string;
    reporter_type: 'Paciente' | 'Médico' | 'Farmacéutico' | 'Distribuidor';
    reporter_contact: string;
    adverse_reaction: string;
    severity: 'Leve' | 'Moderada' | 'Grave';
    status: 'Pendiente' | 'En Revisión' | 'Resuelto';
    admin_notes: string | null;
    created_at?: string;
}
