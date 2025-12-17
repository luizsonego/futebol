"use client";

import { type TeamStanding } from "@/lib/utils/standings";

interface StandingsTableProps {
  standings: TeamStanding[];
  championId?: string | null;
}

export function StandingsTable({ standings, championId }: StandingsTableProps) {
  // Se há um campeão definido, usa ele; caso contrário, usa o primeiro da lista
  const champion = championId
    ? standings.find((s) => s.teamId === championId) || standings[0]
    : standings[0];

  return (
    <div>
      {/* Cards Mobile */}
      <div className="md:hidden space-y-4">
        {standings.map((team, index) => {
          const isChampion = championId
            ? team.teamId === championId
            : index === 0 && team.points > 0 && standings.length > 1;
          return (
            <div
              key={team.teamId}
              className={`card ${isChampion ? "bg-yellow-50 border-2 border-yellow-400" : ""}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md"
                    style={{
                      backgroundColor: team.primaryColor,
                      color: team.secondaryColor,
                    }}
                    aria-hidden="true"
                  >
                    {team.teamName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        {index + 1}º
                      </span>
                      {isChampion && <span className="text-xl">🏆</span>}
                    </div>
                    <span className="text-base font-semibold text-gray-900">{team.teamName}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-gray-900">{team.points}</div>
                  <div className="text-xs text-gray-600">pontos</div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-2 text-center pt-3 border-t border-gray-200">
                <div>
                  <div className="text-xs text-gray-600 mb-1">J</div>
                  <div className="font-bold text-gray-900">{team.matchesPlayed}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">V</div>
                  <div className="font-bold text-green-700">{team.wins}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">E</div>
                  <div className="font-bold text-gray-700">{team.draws}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">D</div>
                  <div className="font-bold text-red-700">{team.losses}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center pt-3 mt-2 border-t border-gray-200">
                <div>
                  <div className="text-xs text-gray-600 mb-1">GP</div>
                  <div className="font-semibold text-gray-900">{team.goalsFor}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">GC</div>
                  <div className="font-semibold text-gray-900">{team.goalsAgainst}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">SG</div>
                  <div className={`font-semibold ${
                    team.goalDifference > 0 ? "text-green-600" : 
                    team.goalDifference < 0 ? "text-red-600" : "text-gray-900"
                  }`}>
                    {team.goalDifference > 0 ? "+" : ""}{team.goalDifference}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabela Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200" role="table" aria-label="Tabela de classificação">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Pos
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Time
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider" title="Jogos">
                J
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider" title="Vitórias">
                V
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider" title="Empates">
                E
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider" title="Derrotas">
                D
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider" title="Gols Pró">
                GP
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider" title="Gols Contra">
                GC
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider" title="Saldo de Gols">
                SG
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider" title="Pontos">
                Pts
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {standings.map((team, index) => {
              const isChampion = championId
                ? team.teamId === championId
                : index === 0 && team.points > 0 && standings.length > 1;
              return (
                <tr
                  key={team.teamId}
                  className={isChampion ? "bg-yellow-50 font-semibold" : ""}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {index + 1}º
                    {isChampion && " 🏆"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{
                          backgroundColor: team.primaryColor,
                          color: team.secondaryColor,
                        }}
                        aria-hidden="true"
                      >
                        {team.teamName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium">{team.teamName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {team.matchesPlayed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {team.wins}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {team.draws}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {team.losses}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {team.goalsFor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {team.goalsAgainst}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${
                    team.goalDifference > 0 ? "text-green-600" : 
                    team.goalDifference < 0 ? "text-red-600" : ""
                  }`}>
                    {team.goalDifference > 0 ? "+" : ""}{team.goalDifference}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold">
                    {team.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {champion && champion.points > 0 && standings.length > 0 && (
        <div className="mt-6 p-4 sm:p-6 bg-yellow-100 border-2 border-yellow-400 rounded-lg text-center shadow-md">
          <p className="text-xl sm:text-2xl font-bold text-yellow-800">
            🏆 Campeão: {champion.teamName} 🏆
          </p>
          <p className="text-sm sm:text-base text-yellow-700 mt-2">
            {champion.points} pontos | {champion.wins} vitórias | Saldo: {champion.goalDifference > 0 ? "+" : ""}{champion.goalDifference}
          </p>
        </div>
      )}
    </div>
  );
}

