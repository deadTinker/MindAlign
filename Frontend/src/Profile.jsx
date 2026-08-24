function Profile() {
  return (
    <div>
      <h1>Profile</h1>

      <div>
        <img
          src="/favicon.svg"
          alt="Profile"
        />

        <h2>Username</h2>
        <p>user@example.com</p>
      </div>

      <div>
  <div>
    <button>Change Username</button>
  </div>

  <div>
    <button>Change Email</button>
  </div>

  <div>
    <button>Change Password</button>
  </div>
</div>
    </div>
  )
}

export default Profile