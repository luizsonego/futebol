import Link from "next/link";

export default function HomePage() {
  return (
    <div className="page-container max-w-4xl">
      <h1 className="page-title">Bem-vindo ao Sistema de Gerenciamento de Futebol</h1>
      
      <div className="grid-standard">
        <Link 
          href="/teams" 
          className="card hover:shadow-xl active:shadow-lg transition-all duration-200 active:scale-[0.98] hover:border-blue-300 min-h-[120px] flex flex-col justify-center"
        >
          <h2 className="section-title mb-2">⚽ Times</h2>
          <p className="body-text text-sm sm:text-base">Cadastre e gerencie os times participantes com suas cores personalizadas.</p>
        </Link>

        <Link 
          href="/game-days" 
          className="card hover:shadow-xl active:shadow-lg transition-all duration-200 active:scale-[0.98] hover:border-blue-300 min-h-[120px] flex flex-col justify-center"
        >
          <h2 className="section-title mb-2">📅 Dias de Jogos</h2>
          <p className="body-text text-sm sm:text-base">Crie dias de jogos e organize as partidas do campeonato.</p>
        </Link>

        <Link 
          href="/matches" 
          className="card hover:shadow-xl active:shadow-lg transition-all duration-200 active:scale-[0.98] hover:border-blue-300 min-h-[120px] flex flex-col justify-center"
        >
          <h2 className="section-title mb-2">🎮 Partidas</h2>
          <p className="body-text text-sm sm:text-base">Visualize todas as partidas e registre os gols em tempo real.</p>
        </Link>

        <Link 
          href="/resultados" 
          className="card hover:shadow-xl active:shadow-lg transition-all duration-200 active:scale-[0.98] hover:border-blue-300 min-h-[120px] flex flex-col justify-center"
        >
          <h2 className="section-title mb-2">📊 Resultados</h2>
          <p className="body-text text-sm sm:text-base">Veja os resultados dos times: pontos e gols marcados.</p>
        </Link>

        <Link 
          href="/standings" 
          className="card hover:shadow-xl active:shadow-lg transition-all duration-200 active:scale-[0.98] hover:border-blue-300 min-h-[120px] flex flex-col justify-center sm:col-span-2"
        >
          <h2 className="section-title mb-2">🏆 Tabela</h2>
          <p className="body-text text-sm sm:text-base">Acompanhe a classificação e descubra quem é o campeão.</p>
        </Link>
      </div>

      <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-blue-50 border-2 border-blue-200 rounded-lg shadow-sm">
        <h3 className="section-title mb-3">Como usar:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base text-gray-800">
          <li>Comece cadastrando os times participantes</li>
          <li>Crie um dia de jogos para organizar as partidas</li>
          <li>Use o chaveamento automático ou crie partidas manualmente</li>
          <li>Registre os gols durante as partidas</li>
          <li>Finalize as partidas para atualizar a tabela</li>
          <li>Acompanhe a classificação e veja quem é o campeão!</li>
        </ol>
      </div>
    </div>
  );
}

