import { getResults } from "@/lib/actions/results";
import { ResultsTable } from "@/components/ResultsTable";

export default async function ResultsPage() {
  const resultsResult = await getResults();
  const results = resultsResult.success ? (resultsResult.data || []) : [];

  return (
    <div className="page-container max-w-4xl">
      <h1 className="page-title">Resultados</h1>

      {results.length === 0 ? (
        <div className="card text-center py-8 sm:py-12">
          <p className="body-text font-medium text-base sm:text-lg">Nenhum time cadastrado ainda.</p>
          <p className="text-secondary mt-2">Cadastre times para ver os resultados.</p>
        </div>
      ) : (
        <div className="md:card md:p-4">
          <ResultsTable results={results} />
        </div>
      )}
    </div>
  );
}

