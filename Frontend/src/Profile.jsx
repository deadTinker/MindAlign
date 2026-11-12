import { useEffect, useState , useRef} from "react";
import Sidebar from "./Sidebar";

const API_URL = "http://localhost:5000/api/auth";

function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    profilePhoto: {
      url: ""
    }

  });

  const [selectedImage, setselectedImage] = useState(null);  // stores the photo that user selected in this.
  const [showPreview , setShowPreview ] = useState(false);
  const fileInputRef   =  useRef(null);            // this will let camera button open the file picker.

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [activeModal, setActiveModal] = useState(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const token = localStorage.getItem("token");

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  // Fetch current user
  const fetchProfile = async () => {
    if (!token) {
      alert("Please login first.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: "GET",
        headers: authHeaders
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to load profile");
        return;
      }

      setUser(data.user);
      setUsername(data.user.name);
      setEmail(data.user.email);

    } catch (error) {
      console.error("Profile error:", error);
      alert("Couldn't connect to the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Close modal and reset password fields
  const closeModal = () => {
    setActiveModal(null);

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setSaving(false);
  };

  // Update username
  const handleUsernameUpdate = async () => {
    if (!username.trim()) {
      alert("Username cannot be empty.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${API_URL}/profile/username`,
        {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({
            name: username.trim()
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to update username");
        return;
      }

      setUser(data.user);
      setUsername(data.user.name);

      alert("Username updated successfully!");
      closeModal();

    } catch (error) {
      console.error("Username update error:", error);
      alert("Couldn't connect to the server");
    } finally {
      setSaving(false);
    }
  };

  // Update email
  const handleEmailUpdate = async () => {
    if (!email.trim()) {
      alert("Email cannot be empty.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${API_URL}/profile/email`,
        {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({
            email: email.trim()
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to update email");
        return;
      }

      setUser(data.user);
      setEmail(data.user.email);

      alert("Email updated successfully!");
      closeModal();

    } catch (error) {
      console.error("Email update error:", error);
      alert("Couldn't connect to the server");
    } finally {
      setSaving(false);
    }
  };

  // Update password
  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${API_URL}/profile/password`,
        {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to update password");
        return;
      }

      alert("Password updated successfully!");
      closeModal();

    } catch (error) {
      console.error("Password update error:", error);
      alert("Couldn't connect to the server");
    } finally {
      setSaving(false);
    }
  };

  
  const handleImageSelection = (e) => {
 
    const file = e.target.files[0];
    console.log("selected file:", file);

    if(file){
      setselectedImage(file);
      setShowPreview(true);
    }
  };


  const handleProfilePhotoUpload = async() => {
   
    if(!selectedImage){
      alert("Please select an image first.");
      return;
    }

  try{
        const formData = new FormData();
        formData.append("profilePhoto", selectedImage);

        const response = await fetch(`${API_URL}/profile/photo`,{
          method: "PUT",
          headers:{
            Authorization: `Bearer ${token}`
          },
          body: formData

        });

        const data =await response.json();

        if(response.ok){

          // set user profile phot
          setUser(prevUser =>({
            ...prevUser,
            profilePhoto: data.profilePhoto
          }))


           setShowPreview(false);
           setselectedImage(null);

          alert("profile photo uploaded successfully!");
        }else{
          alert(data.message);
        }

  }catch(error){
     console.error("Error In photo upload", error);
     alert("Couldn't upload your profile photo. Please try again.");

  }finally{
     if(fileInputRef.current){
         fileInputRef.current.value ="";
     }
  }
  };








  return (
    <div className="min-h-screen bg-[#070B16] text-white relative overflow-hidden">

      {/* Background Glows */}
      <div className="fixed top-[-180px] left-[-180px] w-[450px] h-[450px] bg-blue-600/[0.10] rounded-full blur-3xl pointer-events-none"></div>

      <div className="fixed bottom-[-180px] right-[-180px] w-[450px] h-[450px] bg-violet-600/[0.06] rounded-full blur-3xl pointer-events-none"></div>

      <Sidebar />

      <main className="ml-64 min-h-screen p-6 md:p-10 relative">

        {/* Header */}
        <div className="mb-8">
          <p className="text-cyan-300 text-sm font-medium mb-2">
            Account Settings
          </p>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Profile
          </h1>

          <p className="text-slate-400 mt-2">
            Manage your account information and preferences.
          </p>
        </div>


        {/* Profile Card */}
        <section className="max-w-5xl rounded-3xl border border-white/10 bg-[#0D1424]/90 backdrop-blur-xl p-6 md:p-8 shadow-2xl">

          {/* Profile Information */}
          <div className="flex flex-col md:flex-row md:items-center gap-6">

           {/* Profile Image */}
                      {/*   testing for bordering-->  {{style="border: 2px solid black;}} */}
            <div className="relative" >

              <input 
                type="file"
                accept="image/jpeg,image/png, image/webp"
                ref = {fileInputRef}
                onChange={handleImageSelection}
                className="hidden"
              />
              {/* Image container */}  
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-cyan-400/20 bg-[#0D1424] shadow-xl flex items-center justify-center">
               {/*Image which we are showing*/}
                <img
                  src ={user.profilePhoto?.url ||  "/favicon.svg"}
                  alt="Profile"
                  className="w-full h-full object-cover "
                />
              </div>


              <button
                    type = "button"
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 ho/ver:bg-cyan-400 border-4 border-slate-950 flex items-center justify-center shadow-lg transition-colors"
                    title="Change profile photo"
              ></button>
              {/* Green status indicator*/}
              {/* <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-4 border-slate-950"></div> */}
            </div>

            {/* User Details */}
            <div>
              <p className="text-sm text-cyan-300 font-medium mb-1">
                Your Profile
              </p>

              {loading ? (
                <h2 className="text-2xl font-semibold text-white">
                  Loading...
                </h2>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold text-white">
                    {user.name}
                  </h2>

                  <p className="text-slate-400 mt-1">
                    {user.email}
                  </p>
                </>
              )}

              <span className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium bg-cyan-400/[0.08] text-cyan-300 border border-cyan-400/15">
                Student Account
              </span>
            </div>

          </div>

          <div className="my-8 h-px bg-white/10"></div>

          {/* Account Settings */}
          <div>

            <div className="mb-5">
              <h3 className="text-xl font-semibold text-white">
                Account Settings
              </h3>

              <p className="text-slate-500 text-sm mt-1">
                Manage your personal information and security.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* Username */}
              <button
                onClick={() => {
                  setUsername(user.name);
                  setActiveModal("username");
                }}
                className="group text-left rounded-2xl border border-white/10 bg-white/[0.05] p-6 transition-all duration-300 hover:bg-white/[0.07] hover:border-cyan-400/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/20"
              >
                <div className="w-11 h-11 rounded-xl bg-cyan-400/[0.08] border border-cyan-400/15 flex items-center justify-center mb-5">
                  <span className="text-cyan-300 font-bold">
                    U
                  </span>
                </div>

                <h4 className="text-lg font-semibold text-white">
                  Change Username
                </h4>

                <p className="text-sm text-slate-500 mt-2 leading-6">
                  Update the name displayed on your MindAlign account.
                </p>

                <p className="text-sm text-cyan-300 mt-5 font-medium group-hover:translate-x-1 transition-transform">
                  Manage →
                </p>
              </button>


              {/* Email */}
              <button
                onClick={() => {
                  setEmail(user.email);
                  setActiveModal("email");
                }}
                className="group text-left rounded-2xl border border-white/10 bg-white/[0.05] p-6 transition-all duration-300 hover:bg-white/[0.07] hover:border-cyan-400/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/20"
              >
                <div className="w-11 h-11 rounded-xl bg-cyan-400/[0.08] border border-cyan-400/15 flex items-center justify-center mb-5">
                  <span className="text-cyan-300 font-bold">
                    @
                  </span>
                </div>

                <h4 className="text-lg font-semibold text-white">
                  Change Email
                </h4>

                <p className="text-sm text-slate-500 mt-2 leading-6">
                  Update the email address connected to your account.
                </p>

                <p className="text-sm text-cyan-300 mt-5 font-medium group-hover:translate-x-1 transition-transform">
                  Manage →
                </p>
              </button>


              {/* Password */}
              <button
                onClick={() => setActiveModal("password")}
                className="group text-left rounded-2xl border border-white/10 bg-white/[0.05] p-6 transition-all duration-300 hover:bg-white/[0.07] hover:border-cyan-400/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/20"
              >
                <div className="w-11 h-11 rounded-xl bg-cyan-400/[0.08] border border-cyan-400/15 flex items-center justify-center mb-5">
                  <span className="text-cyan-300 font-bold">
                    *
                  </span>
                </div>

                <h4 className="text-lg font-semibold text-white">
                  Change Password
                </h4>

                <p className="text-sm text-slate-500 mt-2 leading-6">
                  Update your password and keep your account secure.
                </p>

                <p className="text-sm text-cyan-300 mt-5 font-medium group-hover:translate-x-1 transition-transform">
                  Manage →
                </p>
              </button>

            </div>
          </div>

        </section>

      </main>


      {/* ================= USERNAME MODAL ================= */}
      {activeModal === "username" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#02040A]/75 backdrop-blur-md px-4">

          <div className="w-full max-w-md rounded-3xl border border-white/[0.10] bg-[#0D1424] p-7 shadow-2xl shadow-black/40">

            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold">
                  Change Username
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  Enter your new username.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-cyan-300 text-xl transition-colors"
              >
                ×
              </button>
            </div>

            <label className="block text-sm text-slate-300 mb-2">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#070B16] border border-white/10 text-white outline-none focus:border-cyan-400/50"
              placeholder="Enter username"
            />

            <div className="flex gap-3 mt-6">

              <button
                onClick={closeModal}
                className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/[0.06] transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleUsernameUpdate}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 font-semibold disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

            </div>

          </div>
        </div>
      )}


      {/* ================= EMAIL MODAL ================= */}
      {activeModal === "email" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#02040A]/75 backdrop-blur-md px-4">

          <div className="w-full max-w-md rounded-3xl border border-white/[0.10] bg-[#0D1424] p-7 shadow-2xl shadow-black/40">

            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold">
                  Change Email
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  Enter your new email address.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-cyan-300 text-xl transition-colors"
              >
                ×
              </button>
            </div>

            <label className="block text-sm text-slate-300 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#070B16] border border-white/10 text-white outline-none focus:border-cyan-400/50"
              placeholder="Enter email"
            />

            <div className="flex gap-3 mt-6">

              <button
                onClick={closeModal}
                className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/[0.06] transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleEmailUpdate}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 font-semibold disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

            </div>

          </div>
        </div>
      )};


      {/* ================= PASSWORD MODAL ================= */}
      {activeModal === "password" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#02040A]/75 backdrop-blur-md px-4">

          <div className="w-full max-w-md rounded-3xl border border-white/[0.10] bg-[#0D1424] p-7 shadow-2xl shadow-black/40 max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold">
                  Change Password
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  Create a new secure password.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-cyan-300 text-xl transition-colors"
              >
                ×
              </button>
            </div>


            {/* Current Password */}
            <div className="mb-4">
              <label className="block text-sm text-slate-300 mb-2">
                Current Password
              </label>

              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#070B16] border border-white/10 text-white outline-none focus:border-cyan-400/50"
                placeholder="Enter current password"
              />
            </div>


            {/* New Password */}
            <div className="mb-4">
              <label className="block text-sm text-slate-300 mb-2">
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#070B16] border border-white/10 text-white outline-none focus:border-cyan-400/50"
                placeholder="Enter new password"
              />
            </div>


            {/* Confirm Password */}
            <div className="mb-6">
              <label className="block text-sm text-slate-300 mb-2">
                Confirm New Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#070B16] border border-white/10 text-white outline-none focus:border-cyan-400/50"
                placeholder="Confirm new password"
              />
            </div>


            <div className="flex gap-3">

              <button
                onClick={closeModal}
                className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/[0.06] transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handlePasswordUpdate}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 font-semibold disabled:opacity-50"
              >
                {saving ? "Updating..." : "Update Password"}
              </button>

            </div>

          </div>
        </div>
      )}




        {/*Showing  profile photo preview*/}
        {showPreview && selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#02040A]/75 backdrop-blur-md px-4">
            <div className="w-full max-w-md rounded-3xl border border-white/[0.10] bg-[#0D1424] p-7 shadow-2xl shadow-black/40 max-h-[90vh] overflow-y-auto">
              <div className ="flex justify-between items-center mb-6">
                   <h2 className="text-2xl font-semibold">
                     Preview Profile Photo
                  </h2>

                     
              </div>



             {/* secclected Image */}
              <div className="flex justify-center my-8">
               <img 
                  src= {URL.createObjectURL(selectedImage)}
                  alt="New profile preview"
                  className="w-36 h-36 rounded-full object-cover border-4 border-cyan-400/30 shadow-x1"
                />
              </div>
              <p className="text-center text-sm text-slate-400 mb-6">
                Do you want to use this photo as your profile picture?
              </p>


              {/*Action buttons */} 
              <div className="flex gap-3"> 
                 <button 
                  onClick={() =>{
                    setShowPreview(false);
                    setSelectedImage(null);
                  
                  }}
                  className="flex-1 py-2 rounded-xl border border-white/10 text-slate-300 hover:bg-white/[0.06] transition-colors"
                  >Cancel</button>

                  <button onClick={() => { handleProfilePhotoUpload(); }}

                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 font-semibold">
                    Confirm
                  </button>

            </div>

            </div>
          </div>
        )};

    </div>
    );
  }


export default Profile;
