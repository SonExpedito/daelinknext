type CredenciaisEtapaProps = {
  data: { senha: string };
  setData: React.Dispatch<React.SetStateAction<any>>;
};

export default function CredenciaisEtapa({ data, setData }: CredenciaisEtapaProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col w-full">
        <label className="text-lg font-medium">Senha</label>
        <input
          type="password"
          value={data.senha}
          onChange={(e) => setData((prev: any) => ({ ...prev, senha: e.target.value }))}
          placeholder="Digite sua senha"
          className="w-full bg-white/70 rounded-2xl p-4 mt-1 placeholder-gray-500"
        />
      </div>

      <div className="flex gap-4 mt-6">

      </div>
    </div>
  );
}
