import SourceForm from '@/components/SourceForm'

export const metadata = {
  title: 'Ajouter une source - Veille IA',
}

export default function AjouterPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Ajouter une source</h1>
      <p className="text-gray-500 text-sm mb-8">
        Colle une URL - l'IA analyse, qualifie et classe automatiquement.
      </p>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SourceForm />
      </div>
    </div>
  )
}
