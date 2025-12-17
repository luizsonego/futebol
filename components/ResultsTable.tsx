"use client";

import { type TeamResult } from "@/lib/actions/results";

interface ResultsTableProps {
  results: TeamResult[];
}

export function ResultsTable({ results }: ResultsTableProps) {
  // Determina o campeão (primeiro lugar com pontos > 0)
  const champion = results.length > 0 && results[0].points > 0 ? results[0] : null;

  return (
    <div>
      {/* Cards Mobile - Mobile First */}
      <div className="md:hidden space-y-4">
        {results.map((team, index) => {
          const position = index + 1;
          const isChampion = champion && team.id === champion.id;
          
          return (
            <div
              key={team.id}
              className={`card transition-all duration-200 ${
                isChampion
                  ? "bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-400 shadow-lg"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Posição do Ranking */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-md ${
                    isChampion
                      ? "bg-yellow-500 text-yellow-900"
                      : position <= 3
                      ? "bg-gray-800 text-white"
                      : "bg-gray-300 text-gray-800"
                  }`}
                  aria-label={isChampion ? `Campeão - ${team.name}` : `Posição ${position} - ${team.name}`}
                >
                  {isChampion ? "🏆" : position}
                </div>

                {/* Avatar e Nome */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md flex-shrink-0"
                    style={{
                      backgroundColor: team.primaryColor,
                      color: team.secondaryColor,
                    }}
                    aria-hidden="true"
                  >
                    {team.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-base font-semibold truncate block ${
                        isChampion ? "text-yellow-900" : "text-gray-900"
                      }`}
                    >
                      {team.name}
                    </span>
                    {isChampion && (
                      <span className="text-xs font-medium text-yellow-800">
                        Campeão
                      </span>
                    )}
                  </div>
                </div>

                {/* Pontuação e Gols */}
                <div className="flex items-center gap-4 ml-auto">
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Gols</div>
                    <div
                      className={`text-lg font-semibold ${
                        isChampion ? "text-yellow-900" : "text-gray-900"
                      }`}
                    >
                      {team.goals}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Pontos</div>
                    <div
                      className={`text-2xl font-black ${
                        isChampion
                          ? "text-yellow-800"
                          : "text-blue-700"
                      }`}
                    >
                      {team.points}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabela Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200" role="table" aria-label="Tabela de resultados">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Pos
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Time
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                Gols
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                Pontos
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((team, index) => {
              const position = index + 1;
              const isChampion = champion && team.id === champion.id;

              return (
                <tr
                  key={team.id}
                  className={`transition-colors duration-200 ${
                    isChampion
                      ? "bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200"
                      : "hover:bg-gray-50"
                  } ${isChampion ? "border-l-4 border-yellow-400" : ""}`}
                >
                  {/* Posição */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                        isChampion
                          ? "bg-yellow-500 text-yellow-900"
                          : position <= 3
                          ? "bg-gray-800 text-white"
                          : "bg-gray-300 text-gray-800"
                      }`}
                      aria-label={isChampion ? `Campeão - ${team.name}` : `Posição ${position} - ${team.name}`}
                    >
                      {isChampion ? "🏆" : position}
                    </div>
                  </td>

                  {/* Time */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md"
                        style={{
                          backgroundColor: team.primaryColor,
                          color: team.secondaryColor,
                        }}
                        aria-hidden="true"
                      >
                        {team.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span
                          className={`text-sm font-medium ${
                            isChampion ? "text-yellow-900" : "text-gray-900"
                          }`}
                        >
                          {team.name}
                        </span>
                        {isChampion && (
                          <span className="ml-2 text-xs font-medium text-yellow-800">
                            Campeão
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Gols */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span
                      className={`font-semibold ${
                        isChampion ? "text-yellow-900" : "text-gray-900"
                      }`}
                    >
                      {team.goals}
                    </span>
                  </td>

                  {/* Pontos */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span
                      className={`text-lg font-black ${
                        isChampion ? "text-yellow-800" : "text-blue-700"
                      }`}
                    >
                      {team.points}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

