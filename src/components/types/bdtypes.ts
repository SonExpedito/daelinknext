export type Empresa = {
    imageUrl?: string;
    imageProfile?: string;
    sobreimg?: string;
    name?: string;
    area?: string;
    id?: string;
    cep?: string;
    cnpj?: string;
    descricao?: string;
    email?: string;
    sobre?: string;
};

export type Vaga = {
    id: string;
    empresaId?: string;
    empresa?: Empresa;
    area?: string;
    salario?: string;
    tipo?: string;
    local?: string;
    detalhes?: string;
    vaga?: string;
    status?: string;
    descricao?: string;
};

export type Documento = {
    [key: string]: any;
    id: string;
    nome: string;
    experiencia: string;
    objetivo: string;
    files: string[];
    status?: string;
};

export type Processo = {
    id: string;
    nome: string;
    vagaId?: string;
    empresaId?: string;
    processoId?: string;
    documento?: Documento;
    empresa?: Empresa;
    vaga?: Vaga;
    situacao?: string;
    [key: string]: any;
};

export type ChatMessage = {
    id: string;
    processoId: string;
    userId: string;
};

export type ChatResponse = {
    empty: boolean;
    data: ChatMessage[];
};