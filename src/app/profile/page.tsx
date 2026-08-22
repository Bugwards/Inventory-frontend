"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Lock,
  LogOut,
  Camera,
  Pencil,
  X,
  Eye,
  EyeOff,
  Check,
  ArrowLeft,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";


/* ============================================================
   JWT PAYLOAD
============================================================ */

type JwtPayload = {
  sub: string;
  role: string;
  exp: number;
  iat: number;

  // Optional fields.
  // These will be used automatically if your JWT contains them.
  email?: string;
  phone?: string;
  location?: string;
  fullName?: string;
};


/* ============================================================
   PROFILE PAGE
============================================================ */

export default function ProfilePage() {

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  /* ----------------------------------------------------------
     LOGGED-IN USER
  ---------------------------------------------------------- */

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("");

  /* profile picture */
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  // Profile picture preview
  const [showPicturePreview, setShowPicturePreview] = useState(false);
  /*  PASSWORD- */

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);


  /* ============================================================
     LOAD CURRENT USER FROM JWT
  ============================================================ */

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No JWT token found.");
        return;
      }

      try {
        // Decode  existing JWT.
        // DO NOT change  JWT logic.
        const decoded = jwtDecode<JwtPayload>(token);

        console.log("Profile JWT:", decoded);

        // Username and role are still obtained from JWT.
        const username = decoded.sub;

        setFullName(username || "User");
        setRole(decoded.role || "User");
        //pro picture
        try {
          const pictureResponse = await fetch(
            `http://localhost:8080/api/auth/profile-picture?username=${encodeURIComponent(username)}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (pictureResponse.ok) {
            const blob = await pictureResponse.blob();
            const imageUrl = URL.createObjectURL(blob);

            setProfilePicture(imageUrl);
          } else {
            setProfilePicture(null);
          }

        } catch (error) {
          console.log("No profile picture found.");
          setProfilePicture(null);
        }

        // Get the latest profile details from database.
        const response = await fetch(
          `http://localhost:8080/api/auth/profile?username=${encodeURIComponent(username)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Profile request failed: ${response.status}`
          );
        }

        const user = await response.json();

        console.log("Profile data from backend:", user);

        // Database values
        setFullName(user.username || username || "User");
        setEmail(
          user.email ||
          "Email address not available"
        );

        setPhone(
          user.phone ||
          "Phone number not available"
        );

        setLocation(
          user.location
            ? user.location.replaceAll("_", " ")
            : "Location not available"
        );

        setRole(
          user.role ||
          decoded.role ||
          "User"
        );

      } catch (error) {
        console.error(
          "Failed to load profile:",
          error
        );
      }
    };

    loadProfile();
  }, []);


  /* ============================================================
     FORMATTED ROLE */

  const formattedRole = role
    ? role.replaceAll("_", " ")
    : "USER";


  /* ============================================================
     PROFILE INITIALS
  ============================================================ */

  const profileInitials = fullName
    ? fullName
      .split(" ")
      .filter(Boolean)
      .map((name) => name[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
    : "U";


  /* PASSWORD VALIDATION */

  const passwordRequirements = {
    required:
      newPassword.length > 0,

    minLength:
      newPassword.length >= 8,

    letter:
      /[A-Za-z]/.test(newPassword),

    number:
      /[0-9]/.test(newPassword),

    special:
      /[^A-Za-z0-9]/.test(newPassword),
  };

  const passwordValid =
    passwordRequirements.required &&
    passwordRequirements.minLength &&
    passwordRequirements.letter &&
    passwordRequirements.number &&
    passwordRequirements.special &&
    newPassword === confirmPassword;


  //priofile picture upload handler
  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Only allow images
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      e.target.value = "";
      return;
    }

    // Optional safety limit: 5 MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Profile picture must be smaller than 5 MB.");
      e.target.value = "";
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not logged in.");
      return;
    }

    try {

      const decoded = jwtDecode<JwtPayload>(token);

      setUploadingPicture(true);

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        `http://localhost:8080/api/auth/profile-picture?username=${encodeURIComponent(decoded.sub)}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      // Get backend response
      const message = await response.text();

      console.log(
        "Profile picture upload:",
        response.status,
        message
      );

      if (!response.ok) {
        throw new Error(
          `Upload failed (${response.status}): ${message}`
        );
      }

      // Immediately display selected image
      const imageUrl = URL.createObjectURL(file);

      setProfilePicture(imageUrl);

      alert("Profile picture updated successfully.");

    } catch (error) {

      console.error(
        "Profile picture upload failed:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to upload profile picture."
      );

    } finally {

      setUploadingPicture(false);

      // Allows selecting the same image again
      e.target.value = "";
    }
  };


  /* SAVE PROFILE==== */

  const handleSaveProfile = async () => {

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {

      const decoded = jwtDecode<JwtPayload>(token);

      const response = await fetch(
        "http://localhost:8080/api/auth/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentUsername: decoded.sub,
            newUsername: fullName,
            email: email,
            phone: phone,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      alert("Profile updated successfully");

      setShowEditProfile(false);

    } catch (error) {

      console.error(
        "Profile update failed:",
        error
      );

      alert("Failed to update profile");
    }
  };


  /* ============================================================
     CHANGE PASSWORD
  ============================================================ */

  const handleChangePassword = async () => {
    if (!passwordValid || !currentPassword) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not logged in.");
      return;
    }

    try {
      // Decode existing JWT.
      const decoded = jwtDecode<JwtPayload>(token);

      const response = await fetch(
        "http://localhost:8080/api/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: decoded.sub,
            currentPassword: currentPassword,
            newPassword: newPassword,
          }),
        }
      );

      const message = await response.text();

      console.log(
        "Change password response:",
        response.status,
        message
      );

      if (!response.ok) {
        throw new Error(message);
      }

      if (message === "Current password is incorrect") {
        alert("Current password is incorrect.");
        return;
      }

      // Success
      alert("Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setShowChangePassword(false);

    } catch (error) {
      console.error(
        "Password change failed:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to change password."
      );
    }
  };


  /* ============================================================
     LOGOUT
  ============================================================ */

  const handleLogout = () => {

    localStorage.removeItem("token");

    window.location.href = "/login";

  };


  /* ============================================================
     UI
  ============================================================ */

  return (

    <div className="min-h-screen bg-[#F1F3F6] px-5 py-6 md:px-8 lg:px-10">

      <div className="mx-auto max-w-7xl">


        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div className="mb-7 flex items-center gap-4">

          <Link
            href="/dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#953002] shadow-sm ring-1 ring-[#E0E0E0] transition hover:bg-[#953002] hover:text-white"
          >
            <ArrowLeft size={19} />
          </Link>

          <div>

            <h1 className="text-3xl font-bold text-[#282828]">
              Profile
            </h1>

            <p className="mt-1 text-sm text-[#828282]">
              Manage your account information and security
            </p>

          </div>

        </div>


        {/* =====================================================
            PROFILE SUMMARY
        ====================================================== */}

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#E0E0E0]">

          {/* TOP BROWN STRIP */}

          <div className="h-24 bg-[#953002]" />

          <div className="px-6 pb-7 md:px-8">

            <div className="-mt-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">


              {/* PROFILE INFORMATION */}

              <div className="flex items-end gap-5">


                {/* PROFILE IMAGE */}

                <div
                  onClick={() => {
                    if (profilePicture) {
                      setShowPicturePreview(true);
                    }
                  }}
                  className={`flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#FFB401] text-2xl font-bold text-[#953002] shadow-md ${profilePicture
                    ? "cursor-pointer transition hover:scale-105 hover:shadow-lg"
                    : ""
                    }`}
                  title={profilePicture ? "View profile picture" : ""}
                >
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    profileInitials
                  )}
                </div>


                {/* CAMERA BUTTON */}

                <label
                  className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#953002] text-white shadow-md transition hover:bg-[#7d2702]"
                  title="Edit profile picture"
                >
                  <Camera size={15} />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </label>

                {/* NAME / EMAIL / BADGES */}

                <div className="pb-3">

                  <h2 className="text-2xl font-bold text-white">
                    {fullName || "User"}
                  </h2>


                  <div className="mt-3 flex flex-wrap gap-2">


                    {/* ROLE */}

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#953002]/10 px-3 py-1.5 text-xs font-semibold text-[#953002]">

                      <Shield size={13} />

                      {formattedRole}

                    </span>


                    {/* LOCATION */}

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFB401]/15 px-3 py-1.5 text-xs font-semibold text-[#8A6200]">

                      <MapPin size={13} />

                      {location}

                    </span>

                  </div>

                </div>

              </div>


              {/* EDIT PROFILE PICTURE */}

              <label
                className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#E0E0E0] px-4 py-2.5 text-sm font-semibold text-[#4F4F4F] transition hover:border-[#953002] hover:text-[#953002] ${uploadingPicture
                  ? "cursor-not-allowed opacity-50"
                  : ""
                  }`}
              >
                <Camera size={17} />

                {uploadingPicture
                  ? "Uploading..."
                  : "Edit Profile Picture"}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  disabled={uploadingPicture}
                  className="hidden"
                />
              </label>

            </div>

          </div>

        </div>


        {/* =====================================================
            PERSONAL INFORMATION
        ====================================================== */}

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#E0E0E0] md:p-8">


          {/* SECTION HEADER */}

          <div className="flex flex-col gap-4 border-b border-[#E0E0E0] pb-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-xl font-bold text-[#282828]">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-[#828282]">
                View and manage your personal account details
              </p>

            </div>


            <button
              onClick={() => setShowEditProfile(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#953002] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#7D2702]"
            >

              <Pencil size={16} />

              Edit Information

            </button>

          </div>


          {/* INFORMATION GRID */}

          <div className="grid grid-cols-1 gap-x-10 gap-y-7 pt-7 md:grid-cols-2">

            <ProfileDetail
              icon={<User size={18} />}
              label="User Name"
              value={fullName || "Not available"}
            />

            <ProfileDetail
              icon={<Mail size={18} />}
              label="Email Address"
              value={email || "Not available"}
            />

            <ProfileDetail
              icon={<Phone size={18} />}
              label="Phone Number"
              value={phone || "Not available"}
            />

            <ProfileDetail
              icon={<MapPin size={18} />}
              label="Location"
              value={location || "Not available"}
              disabled
            />

            <ProfileDetail
              icon={<Shield size={18} />}
              label="Role"
              value={formattedRole}
              disabled
            />

          </div>

        </div>


        {/* PASSWORD & SECURITY */}

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#E0E0E0] md:p-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#953002]/10 text-[#953002]">
                <Lock size={22} />
              </div>

              <div>

                <h2 className="text-lg font-bold text-[#282828]">
                  Password & Security
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-6 text-[#828282]">
                  Keep your account secure by regularly updating your
                  password.
                </p>

              </div>

            </div>


            <button
              onClick={() => setShowChangePassword(true)}
              className="rounded-xl border border-[#953002] px-5 py-2.5 text-sm font-semibold text-[#953002] transition hover:bg-[#953002] hover:text-white"
            >
              Change Password
            </button>

          </div>

        </div>


        {/* =====================================================
            LOGOUT
        ====================================================== */}

        <div className="mt-6 rounded-2xl border border-[#EB5757]/20 bg-white p-6 shadow-sm md:p-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EB5757]/10 text-[#EB5757]">
                <LogOut size={22} />
              </div>

              <div>

                <h2 className="text-lg font-bold text-[#282828]">
                  Sign Out
                </h2>

                <p className="mt-1 text-sm text-[#828282]">
                  Sign out from your Inventory Management System account.
                </p>

              </div>

            </div>


            <button
              onClick={handleLogout}
              className="rounded-xl border border-[#EB5757] px-5 py-2.5 text-sm font-semibold text-[#EB5757] transition hover:bg-[#EB5757] hover:text-white"
            >
              Logout
            </button>

          </div>

        </div>

      </div>


      {/* =====================================================
          EDIT PROFILE MODAL
      ====================================================== */}

      {showEditProfile && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">


            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-[#E0E0E0] px-6 py-5">

              <div>

                <h2 className="text-xl font-bold text-[#282828]">
                  Edit Personal Information
                </h2>

                <p className="mt-1 text-sm text-[#828282]">
                  Update your personal details
                </p>

              </div>


              <button
                onClick={() => setShowEditProfile(false)}
                className="rounded-lg p-2 text-[#828282] transition hover:bg-[#E0E0E0] hover:text-[#282828]"
              >
                <X size={20} />
              </button>

            </div>


            {/* FORM */}

            <div className="space-y-5 px-6 py-6">

              <FormField
                label="Username"
                value={fullName}
                onChange={setFullName}
                icon={<User size={17} />}
              />

              <FormField
                label="Email Address"
                value={email}
                onChange={setEmail}
                type="email"
                icon={<Mail size={17} />}
              />

              <FormField
                label="Phone Number"
                value={phone}
                onChange={setPhone}
                type="tel"
                icon={<Phone size={17} />}
              />


              {/* LOCATION */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-[#4F4F4F]">
                  Location
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-[#E0E0E0] bg-[#F1F3F6] px-4 py-3 text-sm text-[#828282]">

                  <MapPin size={17} />

                  {location}

                </div>

                <p className="mt-1.5 text-xs text-[#828282]">
                  Location can only be changed by an authorized administrator.
                </p>

              </div>


              {/* ROLE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-[#4F4F4F]">
                  Role
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-[#E0E0E0] bg-[#F1F3F6] px-4 py-3 text-sm text-[#828282]">

                  <Shield size={17} />

                  {formattedRole}

                </div>

                <p className="mt-1.5 text-xs text-[#828282]">
                  Role is managed according to the system authorization rules.
                </p>

              </div>

            </div>


            {/* BUTTONS */}

            <div className="flex justify-end gap-3 border-t border-[#E0E0E0] px-6 py-5">

              <button
                onClick={() => setShowEditProfile(false)}
                className="rounded-xl border border-[#E0E0E0] px-5 py-2.5 text-sm font-semibold text-[#4F4F4F] transition hover:bg-[#F1F3F6]"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveProfile}
                className="rounded-xl bg-[#953002] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7D2702]"
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          CHANGE PASSWORD MODAL
      ====================================================== */}

      {showChangePassword && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">


            {/* HEADER */}

            <div className="flex items-start justify-between border-b border-[#E0E0E0] px-6 py-5">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#953002]/10 text-[#953002]">
                  <Lock size={20} />
                </div>

                <div>

                  <h2 className="text-xl font-bold text-[#282828]">
                    Change Password
                  </h2>

                  <p className="mt-1 text-sm text-[#828282]">
                    Update your account password
                  </p>

                </div>

              </div>


              <button
                onClick={() => setShowChangePassword(false)}
                className="rounded-lg p-2 text-[#828282] transition hover:bg-[#E0E0E0]"
              >
                <X size={20} />
              </button>

            </div>


            {/* PASSWORD FORM */}

            <div className="space-y-5 px-6 py-6">

              <PasswordInput
                label="Current Password"
                value={currentPassword}
                onChange={setCurrentPassword}
                showPassword={showCurrentPassword}
                setShowPassword={setShowCurrentPassword}
              />

              <PasswordInput
                label="New Password"
                value={newPassword}
                onChange={setNewPassword}
                showPassword={showNewPassword}
                setShowPassword={setShowNewPassword}
              />


              <div className="rounded-xl bg-[#F1F3F6] p-4">

                <p className="mb-3 text-sm font-semibold text-[#4F4F4F]">
                  Password requirements
                </p>

                <div className="space-y-2">

                  <PasswordRequirement
                    valid={passwordRequirements.minLength}
                    text="Minimum 8 characters"
                  />

                  <PasswordRequirement
                    valid={passwordRequirements.letter}
                    text="At least one letter"
                  />

                  <PasswordRequirement
                    valid={passwordRequirements.number}
                    text="At least one number"
                  />

                  <PasswordRequirement
                    valid={passwordRequirements.special}
                    text="At least one special character"
                  />

                </div>

              </div>


              <PasswordInput
                label="Confirm New Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                showPassword={showConfirmPassword}
                setShowPassword={setShowConfirmPassword}
              />


              {confirmPassword.length > 0 && (

                <div
                  className={`text-xs font-medium ${newPassword === confirmPassword
                    ? "text-[#27AE60]"
                    : "text-[#EB5757]"
                    }`}
                >

                  {newPassword === confirmPassword
                    ? "✓ Passwords match"
                    : "✕ Passwords do not match"}

                </div>

              )}

            </div>


            {/* BUTTONS */}

            <div className="flex justify-end gap-3 border-t border-[#E0E0E0] px-6 py-5">

              <button
                onClick={() => {

                  setShowChangePassword(false);

                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");

                }}
                className="rounded-xl border border-[#E0E0E0] px-5 py-2.5 text-sm font-semibold text-[#4F4F4F] transition hover:bg-[#F1F3F6]"
              >
                Cancel
              </button>


              <button
                onClick={handleChangePassword}
                disabled={!passwordValid || !currentPassword}
                className="rounded-xl bg-[#953002] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7D2702] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Update Password
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =====================================================
            PROFILE PICTURE PREVIEW
        ===================================================== */}

      {showPicturePreview && profilePicture && (

        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm"
          onClick={() => setShowPicturePreview(false)}
        >

          {/* Close Button */}

          <button
            type="button"
            onClick={() => setShowPicturePreview(false)}
            className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close image preview"
          >
            <X size={24} />
          </button>


          {/* Full Image */}

          <div
            className="relative flex max-h-[90vh] max-w-[90vw] items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >

            <img
              src={profilePicture}
              alt="Profile picture"
              className="max-h-[85vh] max-w-[85vw] rounded-2xl object-contain shadow-2xl"
            />

          </div>

        </div>

      )}

    </div>

  );
}


/* ============================================================
   PROFILE DETAIL
============================================================ */

function ProfileDetail({
  icon,
  label,
  value,
  disabled = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  disabled?: boolean;
}) {

  return (

    <div className="flex items-center gap-4">

      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${disabled
          ? "bg-[#F1F3F6] text-[#828282]"
          : "bg-[#953002]/10 text-[#953002]"
          }`}
      >
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-xs font-semibold uppercase tracking-wide text-[#828282]">
          {label}
        </p>

        <p className="mt-1 text-sm font-semibold text-[#282828]">
          {value}
        </p>

      </div>

    </div>

  );
}


/* ============================================================
   FORM FIELD
============================================================ */

function FormField({
  label,
  value,
  onChange,
  type = "text",
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  icon: React.ReactNode;
}) {

  return (

    <div>

      <label className="mb-2 block text-sm font-semibold text-[#4F4F4F]">
        {label}
      </label>

      <div className="relative">

        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#828282]">
          {icon}
        </div>

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-[#E0E0E0] py-3 pl-11 pr-4 text-sm text-[#282828] outline-none transition focus:border-[#953002] focus:ring-2 focus:ring-[#953002]/10"
        />

      </div>

    </div>

  );
}


/* ============================================================
   PASSWORD INPUT
============================================================ */

function PasswordInput({
  label,
  value,
  onChange,
  showPassword,
  setShowPassword,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
}) {

  return (

    <div>

      <label className="mb-2 block text-sm font-semibold text-[#4F4F4F]">
        {label}
      </label>

      <div className="relative">

        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-[#E0E0E0] px-4 py-3 pr-12 text-sm text-[#282828] outline-none transition focus:border-[#953002] focus:ring-2 focus:ring-[#953002]/10"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#828282] transition hover:text-[#953002]"
        >

          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}

        </button>

      </div>

    </div>

  );
}


/* ============================================================
   PASSWORD REQUIREMENT
============================================================ */

function PasswordRequirement({
  valid,
  text,
}: {
  valid: boolean;
  text: string;
}) {

  return (

    <div
      className={`flex items-center gap-2 text-xs font-medium ${valid
        ? "text-[#27AE60]"
        : "text-[#828282]"
        }`}
    >

      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full ${valid
          ? "bg-[#27AE60]/10"
          : "bg-[#E0E0E0]"
          }`}
      >

        {valid && <Check size={11} />}

      </span>

      {text}

    </div>

  );
}