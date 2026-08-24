import Sidebar from './Sidebar'

function Dashboard() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold">
          MindAlign Dashboard
        </h1>

        {/* Burnout Risk Score */}
        <section className="mt-8 rounded-lg border p-6">
          <h2 className="text-xl font-semibold">
            Burnout Risk Score
          </h2>

          <p className="mt-4">
            Please take the assessment to see your burnout risk score.
          </p>
        </section>

        {/* What is Burnout */}
        <section className="mt-6 rounded-lg border p-6">
          <h2 className="text-xl font-semibold">
            What is Burnout?
          </h2>

          <p className="mt-4">
            Burnout is a state of physical, emotional, and mental
            exhaustion caused by prolonged or excessive stress. It can
            occur when the demands placed on a person consistently
            exceed their ability to cope with them.
          </p>
        </section>

        {/* Causes */}
        <section className="mt-6 rounded-lg border p-6">
          <h2 className="text-xl font-semibold">
            Causes of Burnout
          </h2>

          <ul className="mt-4 list-disc pl-6">
            <li>Excessive workload or academic pressure</li>
            <li>Lack of adequate rest and recovery</li>
            <li>Long-term or unmanaged stress</li>
            <li>Lack of control over responsibilities</li>
            <li>Lack of support from others</li>
            <li>Poor work-life or study-life balance</li>
          </ul>
        </section>

        {/* Effects */}
        <section className="mt-6 rounded-lg border p-6">
          <h2 className="text-xl font-semibold">
            Effects of Burnout
          </h2>

          <ul className="mt-4 list-disc pl-6">
            <li>Physical and emotional exhaustion</li>
            <li>Difficulty concentrating</li>
            <li>Reduced motivation</li>
            <li>Decreased productivity</li>
            <li>Irritability and emotional distress</li>
            <li>Feeling overwhelmed or detached</li>
          </ul>
        </section>

        {/* Prevention */}
        <section className="mt-6 rounded-lg border p-6">
          <h2 className="text-xl font-semibold">
            How to Prevent Burnout
          </h2>

          <ul className="mt-4 list-disc pl-6">
            <li>Take regular breaks and get adequate rest</li>
            <li>Maintain a healthy sleep schedule</li>
            <li>Set realistic goals and manage your workload</li>
            <li>Maintain a healthy balance between work, study, and personal life</li>
            <li>Stay physically active and maintain healthy habits</li>
            <li>Talk to trusted people when you're feeling overwhelmed</li>
          </ul>
        </section>

      </main>
    </div>
  )
}

export default Dashboard