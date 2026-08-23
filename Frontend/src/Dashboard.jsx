import Sidebar from './Sidebar'

function Dashboard() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold">
          MindAlign Dashboard
        </h1>

        <section className="mt-8 rounded-lg border p-6">
          <h2 className="text-xl font-semibold">
            What is Burnout?
          </h2>

          <p className="mt-4">
            Burnout is a state of physical and emotional exhaustion
            caused by prolonged stress.
          </p>
        </section>

        <section className="mt-6 rounded-lg border p-6">
          <h2 className="text-xl font-semibold">
            Burnout Risk Score
          </h2>

          <p className="mt-4">
            Please take the assessment to see your burnout risk score.
          </p>
        </section>
      </main>
    </div>
  )
}

export default Dashboard