import { useState, useEffect } from 'react'
import WritingStreak from './components/WritingStreak'

interface WordEntry {
  id: number
  word_count: number
  date: string
  description: string | null
}

function App() {
  const [wordCount, setWordCount] = useState('')
  const [description, setDescription] = useState('')
  const [entries, setEntries] = useState<WordEntry[]>([])
  const [totalWords, setTotalWords] = useState(0)

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/word-entries/')
      if (response.ok) {
        const data = await response.json()
        setEntries(data.sort((a: WordEntry, b: WordEntry) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ))
        setTotalWords(data.reduce((sum: number, entry: WordEntry) => sum + entry.word_count, 0))
      }
    } catch (error) {
      console.error('Error fetching entries:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Set time to midnight
      
      const response = await fetch('/api/word-entries/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word_count: parseInt(wordCount),
          date: today.toISOString(),
          description: description,
        }),
      })

      if (response.ok) {
        setWordCount('')
        setDescription('')
        fetchEntries() // Refresh the list
      }
    } catch (error) {
      console.error('Error submitting word count:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Ascalon</h1>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="grid gap-6">
          {/* Writing Streak Section */}
          <div className="md:col-span-2">
            <WritingStreak entries={entries} />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Stats Section */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-indigo-600 mb-1">Total Words</p>
                  <p className="text-2xl font-bold text-indigo-900">{totalWords.toLocaleString()}</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-indigo-600 mb-1">Writing Days</p>
                  <p className="text-2xl font-bold text-indigo-900">{entries.length}</p>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Log Today's Progress</h2>
              <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
                <div>
                  <label htmlFor="wordCount" className="block text-sm font-medium text-gray-700">
                    Word Count
                  </label>
                  <input
                    type="number"
                    id="wordCount"
                    value={wordCount}
                    onChange={(e) => setWordCount(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    rows={3}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Log Words
                </button>
              </form>
            </div>
          </div>

          {/* Entries List */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Writing History</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {entries.map((entry) => (
                  <li key={entry.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {entry.word_count.toLocaleString()} words
                        </p>
                        <p className="text-sm text-gray-500">{formatDate(entry.date)}</p>
                        {entry.description && (
                          <p className="mt-1 text-sm text-gray-600">{entry.description}</p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
