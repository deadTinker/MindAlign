import { useEffect, useState, useRef } from "react";
import Sidebar from "./Sidebar";
import { Camera, User, Mail, Lock, ArrowRight, X, ShieldCheck } from "lucide-react";

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth`;

function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    profilePhoto: {
      url: ""
    }
  });

  const [selectedImage, setselectedImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

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
      const response = await fetch(`${API_URL}/profile/username`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({
          name: username.trim()
        })
      });

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
      const response = await fetch(`${API_URL}/profile/email`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({
          email: email.trim()
        })
      });

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
      const response = await fetch(`${API_URL}/profile/password`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        })
      });

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
    if (file) {
      setselectedImage(file);
      setShowPreview(true);
    }
  };

  const handleProfilePhotoUpload = async () => {
    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("profilePhoto", selectedImage);

      const response = await fetch(`${API_URL}/profile/photo`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setUser((prevUser) => ({
          ...prevUser,
          profilePhoto: data.profilePhoto
        }));

        setShowPreview(false);
        setselectedImage(null);
        alert("Profile photo uploaded successfully!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error in photo upload", error);
      alert("Couldn't upload your profile photo. Please try again.");
    } finally {
      setSaving(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 relative overflow-x-hidden selection:bg-[#22C55E] selection:text-white">
      {/* Subtle Light Ambient Background */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-[25%] h-[420px] w-[420px] rounded-full bg-emerald-400/[0.08] blur-[120px]" />
        <div className="absolute right-[-180px] top-[35%] h-[380px] w-[380px] rounded-full bg-teal-400/[0.07] blur-[110px]" />
      </div>

      <Sidebar />

      <main className="relative z-10 ml-0 min-h-screen px-5 pb-16 pt-24 md:ml-64 md:px-10 md:pt-8 lg:px-14">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <header className="mb-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#16A34A]">
              <ShieldCheck size={14} /> Account Settings
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Your <span className="text-[#22C55E]">Profile</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage your account information, profile photo, and security preferences.
            </p>
          </header>

          {/* Profile Card */}
          <section className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.04)] backdrop-blur-md sm:p-8">
            {/* Profile Information */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              {/* Profile Image */}
              <div className="relative w-fit">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  ref={fileInputRef}
                  onChange={handleImageSelection}
                  className="hidden"
                />

                <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-emerald-100 bg-emerald-50/50 shadow-md flex items-center justify-center">
                  <img
                    src={user.profilePhoto?.url || "/MindAlign.jpg"}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#22C55E] text-white shadow-md shadow-emerald-500/25 transition hover:bg-[#16A34A] hover:scale-105"
                  title="Change profile photo"
                >
                  <Camera size={15} />
                </button>
              </div>

              {/* User Details */}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#16A34A] mb-1">
                  Member Overview
                </p>

                {loading ? (
                  <h2 className="text-2xl font-bold text-slate-900">Loading...</h2>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">{user.email}</p>
                  </>
                )}

                <span className="mt-3 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#16A34A]">
                  Student Account
                </span>
              </div>
            </div>

            <div className="my-8 h-px bg-slate-200/80" />

            {/* Account Settings Grid */}
            <div>
              <div className="mb-5">
                <h3 className="text-lg font-bold text-slate-900">Account Settings</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Manage your personal information and security.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {/* Username Card */}
                <button
                  onClick={() => {
                    setUsername(user.name);
                    setActiveModal("username");
                  }}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-slate-50/50 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#22C55E]/50 hover:bg-white hover:shadow-lg hover:shadow-emerald-500/10"
                >
                  <div>
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-[#16A34A]">
                      <User size={20} />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 transition-colors group-hover:text-[#16A34A]">
                      Change Username
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Update the name displayed on your MindAlign account.
                    </p>
                  </div>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#16A34A] transition-transform group-hover:translate-x-1">
                    Manage <ArrowRight size={14} />
                  </span>
                </button>

                {/* Email Card */}
                <button
                  onClick={() => {
                    setEmail(user.email);
                    setActiveModal("email");
                  }}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-slate-50/50 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#22C55E]/50 hover:bg-white hover:shadow-lg hover:shadow-emerald-500/10"
                >
                  <div>
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-[#16A34A]">
                      <Mail size={20} />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 transition-colors group-hover:text-[#16A34A]">
                      Change Email
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Update the email address connected to your account.
                    </p>
                  </div>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#16A34A] transition-transform group-hover:translate-x-1">
                    Manage <ArrowRight size={14} />
                  </span>
                </button>

                {/* Password Card */}
                <button
                  onClick={() => setActiveModal("password")}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-slate-50/50 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#22C55E]/50 hover:bg-white hover:shadow-lg hover:shadow-emerald-500/10"
                >
                  <div>
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-[#16A34A]">
                      <Lock size={20} />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 transition-colors group-hover:text-[#16A34A]">
                      Change Password
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Update your password and keep your account secure.
                    </p>
                  </div>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#16A34A] transition-transform group-hover:translate-x-1">
                    Manage <ArrowRight size={14} />
                  </span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ================= USERNAME MODAL ================= */}
      {activeModal === "username" && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#16A34A]">
                  Account Details
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">Change Username</h2>
                <p className="mt-1 text-sm text-slate-500">Enter your new display name.</p>
              </div>
              <button
                onClick={closeModal}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-slate-700">Username</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50/90 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#22C55E] focus:bg-white focus:ring-2 focus:ring-[#22C55E]/20"
                placeholder="Enter username"
              />
            </label>

            <div className="mt-6 flex gap-3 border-t border-slate-100 pt-4">
              <button
                onClick={closeModal}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUsernameUpdate}
                disabled={saving}
                className="flex-1 rounded-xl bg-[#22C55E] py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 hover:bg-[#16A34A] disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EMAIL MODAL ================= */}
      {activeModal === "email" && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#16A34A]">
                  Account Details
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">Change Email</h2>
                <p className="mt-1 text-sm text-slate-500">Enter your new email address.</p>
              </div>
              <button
                onClick={closeModal}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-slate-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50/90 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#22C55E] focus:bg-white focus:ring-2 focus:ring-[#22C55E]/20"
                placeholder="Enter email"
              />
            </label>

            <div className="mt-6 flex gap-3 border-t border-slate-100 pt-4">
              <button
                onClick={closeModal}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEmailUpdate}
                disabled={saving}
                className="flex-1 rounded-xl bg-[#22C55E] py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 hover:bg-[#16A34A] disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PASSWORD MODAL ================= */}
      {activeModal === "password" && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#16A34A]">
                  Security
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">Change Password</h2>
                <p className="mt-1 text-sm text-slate-500">Create a new secure password.</p>
              </div>
              <button
                onClick={closeModal}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-slate-700">
                  Current Password
                </span>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/90 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#22C55E] focus:bg-white focus:ring-2 focus:ring-[#22C55E]/20"
                  placeholder="Enter current password"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-slate-700">
                  New Password
                </span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/90 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#22C55E] focus:bg-white focus:ring-2 focus:ring-[#22C55E]/20"
                  placeholder="Enter new password"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-slate-700">
                  Confirm New Password
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/90 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#22C55E] focus:bg-white focus:ring-2 focus:ring-[#22C55E]/20"
                  placeholder="Confirm new password"
                />
              </label>
            </div>

            <div className="mt-6 flex gap-3 border-t border-slate-100 pt-4">
              <button
                onClick={closeModal}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordUpdate}
                disabled={saving}
                className="flex-1 rounded-xl bg-[#22C55E] py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 hover:bg-[#16A34A] disabled:opacity-50 transition-colors"
              >
                {saving ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PROFILE PHOTO PREVIEW MODAL ================= */}
      {showPreview && selectedImage && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#16A34A]">
                  Avatar Update
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">Preview Profile Photo</h2>
              </div>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setselectedImage(null);
                }}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="my-6 flex justify-center">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="New profile preview"
                className="h-36 w-36 rounded-full border-4 border-emerald-200 object-cover shadow-lg"
              />
            </div>

            <p className="mb-6 text-center text-sm text-slate-500">
              Do you want to use this photo as your profile picture?
            </p>

            <div className="flex gap-3 border-t border-slate-100 pt-4">
              <button
                onClick={() => {
                  setShowPreview(false);
                  setselectedImage(null);
                }}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProfilePhotoUpload}
                disabled={saving}
                className="flex-1 rounded-xl bg-[#22C55E] py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 hover:bg-[#16A34A] disabled:opacity-50 transition-colors"
              >
                {saving ? "Uploading..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;