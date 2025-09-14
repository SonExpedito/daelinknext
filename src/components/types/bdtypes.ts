export type PCD = {
    id?: string;
    name?: string;
    cpf?: string;
    deficiencia?: string;
    descricao?: string;
    imageProfile?: string;
    imageUrl?: string;
    email?: string;
    dataNasc?: string;
    laudomedico?: string;
    sobre?: string;
    telefone?: string;
}

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
    telefone?: string;
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

export type Chat = {
    id: string;
    processoId: string;
    empresaId: string;
    pcdId: string;
};

export type Mensagem = {
    id: string;
    pcdId: string;
    empresaId: string;
    fileUrl: string;
    data: Date;
};

