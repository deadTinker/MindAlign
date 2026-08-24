import { Link } from "react-router-dom"

function Sidebar() {
  return (
    <aside className="w-60 min-h-screen p-6">
      
      <img
        src="/favicon.svg"
        alt="Profile"
        className="w-16 h-16 mb-8"
      />

      <nav className="flex flex-col gap-4">
        <Link to="/profile">Profile</Link>

        <div>
          <p>Assessment</p>

          <div className="flex flex-col gap-2 ml-4 mt-2">
            <Link to="/assessment/1">
              Option-Based
            </Link>

            <Link to="/assessment/2">
              Text-Based
            </Link>
          </div>
        </div>

        <Link to="/summary">Summary</Link>

        <button>Logout</button>
      </nav>

    </aside>
  )
}

export default Sidebar