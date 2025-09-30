export type PCD = {
  id?: string;
  name?: string;
  genero?: string;
  dataNasc?: string;
  cpf?: string;
  telefone?: string;
  email?: string;

  deficiencia?: string;
  trabalho?: string;
  descrição?: string;
  sobre?: string;
  laudomedico?: string;

  imageUrl?: string;       // foto de perfil
  imageProfile?: string;   // banner
  perfilvertical?: boolean;
  empresapick?: boolean;   // se já foi vinculado a empresa
};

export type Empresa = {
  id?: string;
  name?: string;
  cnpj?: string;
  area?: string;
  descricao?: string;
  sobre?: string;
  sobreimg?: string;

  email?: string;
  telefone?: string;
  cep?: string;

  imageUrl?: string;       // logo
  imageProfile?: string;   // banner
};

export type Vaga = {
  id: string;
  vaga?: string;           // título da vaga
  descricao?: string;
  detalhes?: string;
  area?: string;
  tipo?: string;
  local?: string;
  salario?: string;
  status?: string;

  empresaId?: string;
  empresa?: Empresa;

  img?: string;
  createdAt?: string;
};

export type Documento = {
  id: string;
  nome: string;
  experiencia: string;
  objetivo: string;
  arquivos: string[];
  status?: string;
  [key: string]: any;
};

export type Processo = {
  id: string;
  nome: string;
  situacao?: string;

  processoId?: string;
  empresaId?: string;
  vagaId?: string;

  empresa?: Empresa;
  vaga?: Vaga;
  documento?: Documento;

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
  mensagem: string;
  fileUrl: string;
  data: Date;
  origem: string;

  pcdId: string;
  empresaId: string;
};
