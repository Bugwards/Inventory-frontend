"use client";

import React, { useState } from "react";
import {
  FiArrowRight,
  FiChevronDown,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { FaUserCog } from "react-icons/fa";
import { BiBuildings } from "react-icons/bi";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  // Error states
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleError, setRoleError] = useState("");

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = async () => {
    // Clear previous errors
    setUsernameError("");
    setPasswordError("");
    setRoleError("");

    // =====================================================
    // FRONTEND VALIDATION
    // =====================================================

    let hasError = false;

    if (!username.trim()) {
      setUsernameError("Please enter your username");
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError("Please enter your password");
      hasError = true;
    }

    if (!role) {
      setRoleError("Please select your role");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // =====================================================
    // API LOGIN
    // =====================================================

    try {
      setIsLoading(true);

      console.log("Logging in...");

      const response = await api.post("/api/auth/login", {
        username,
        password,
      });

      console.log("FULL RESPONSE:", response);
      console.log("LOGIN RESPONSE DATA:", response.data);

      const token = response.data;

      // =================================================
      // INVALID TOKEN
      // =================================================

      if (
        !token ||
        token === "invalid Credential" ||
        token === "Invalid Credential"
      ) {
        setPasswordError("Invalid username or password");
        return;
      }

      // =================================================
      // SAVE JWT
      // =================================================

      localStorage.setItem("token", token);

      console.log("JWT SAVED:", token);

      // =================================================
      // REDIRECT
      // =================================================

      router.push("/dashboard");

    } catch (error: unknown) {
      console.error("LOGIN ERROR:", error);

      // -----------------------------------------------
      // Axios error handling
      // -----------------------------------------------

      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const axiosError = error as {
          response?: {
            status?: number;
            data?: unknown;
          };
        };

        console.log(
          "STATUS:",
          axiosError.response?.status
        );

        console.log(
          "DATA:",
          axiosError.response?.data
        );

        // -------------------------------------------
        // 401 / 403
        // -------------------------------------------

        if (
          axiosError.response?.status === 401 ||
          axiosError.response?.status === 403
        ) {
          setPasswordError(
            "Invalid username or password"
          );

          return;
        }
      }

      // -----------------------------------------------
      // General error
      // -----------------------------------------------

      setPasswordError(
        "Unable to login. Please try again."
      );

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f8fa] px-4 py-10 text-[#1f2937]">

      {/* ================================================= */}
      {/* BACKGROUND DECORATION */}
      {/* ================================================= */}

      <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-[#ffb401]/20 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-24 size-96 rounded-full bg-[#2f80ed]/10 blur-3xl" />

      {/* ================================================= */}
      {/* MAIN CARD */}
      {/* ================================================= */}

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#e7e9ee] bg-white shadow-[0_24px_80px_rgba(31,41,55,0.12)] lg:grid-cols-[0.9fr_1.1fr]">

        {/* ================================================= */}
        {/* LEFT SIDE */}
        {/* ================================================= */}

        <section className="relative hidden min-h-[620px] overflow-hidden bg-[#953002] p-10 text-white lg:flex lg:flex-col lg:justify-between">

          {/* Decorative circles */}

          <div className="absolute -right-24 -top-20 size-72 rounded-full border-[42px] border-[#ffb401]/30" />

          <div className="absolute -bottom-28 -left-24 size-80 rounded-full border-[48px] border-white/10" />

          {/* Content */}

          <div className="relative">

            {/* Logo */}

            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#ffb401] text-[#281914] shadow-lg shadow-[#281914]/20">
              <BiBuildings size={27} />
            </div>

            {/* Platform */}

            <p className="mt-7 text-sm font-semibold uppercase tracking-[0.22em] text-[#ffb401]">
              IMS platform
            </p>

            {/* Heading */}

            <h1 className="mt-4 max-w-sm text-4xl font-semibold leading-tight tracking-tight">
              Know what is in stock. Know what moves next.
            </h1>

            {/* Description */}

            <p className="mt-5 max-w-sm text-base leading-7 text-white/70">
              A clearer way to manage products, purchasing,
              and daily operations from one workspace.
            </p>

          </div>

          {/* ================================================= */}
          {/* WORKSPACE STATUS */}
          {/* ================================================= */}

          <div className="relative rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">

            <div className="flex items-center justify-between text-sm">

              <span className="text-white/70">
                Workspace status
              </span>

              <span className="flex items-center gap-2 font-semibold">

                <span className="size-2 rounded-full bg-[#ffb401]" />

                Ready

              </span>

            </div>

            <div className="mt-5 flex items-end gap-2">

              <span className="text-3xl font-semibold">
                24/7
              </span>

              <span className="pb-1 text-sm text-white/60">
                visibility across your inventory
              </span>

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* RIGHT SIDE */}
        {/* ================================================= */}

        <section className="p-7 sm:p-10 lg:p-14">

          {/* Mobile Logo */}

          <div className="mb-9 flex items-center gap-3 lg:hidden">

            <div className="flex size-10 items-center justify-center rounded-xl bg-[#953002] text-white">
              <BiBuildings size={23} />
            </div>

            <span className="font-semibold text-[#953002]">
              Inventory Management
            </span>

          </div>

          <div className="max-w-md">

            {/* ================================================= */}
            {/* TITLE */}
            {/* ================================================= */}

            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#953002]">
              Welcome back
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#1f2937] sm:text-4xl">
              Sign in to your workspace
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#667085]">
              Access your inventory, orders, and operational
              insights.
            </p>

            {/* ================================================= */}
            {/* FORM */}
            {/* ================================================= */}

            <form
              className="mt-9 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >

              {/* ================================================= */}
              {/* USERNAME */}
              {/* ================================================= */}

              <div className="space-y-2">

                <label className="ml-1 text-sm font-semibold text-[#344054]">
                  Username
                </label>

                <div
                  className={`flex items-center gap-3 rounded-2xl border bg-[#fbfcfd] px-4 py-3.5 transition ${usernameError
                    ? "border-red-400 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/10"
                    : "border-[#e4e7ec] focus-within:border-[#953002] focus-within:ring-4 focus-within:ring-[#953002]/10"
                    }`}
                >

                  <FiUser
                    className={`shrink-0 ${usernameError
                      ? "text-red-500"
                      : "text-[#953002]"
                      }`}
                    size={20}
                  />

                  <input
                    type="text"
                    placeholder="Enter username"
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#98a2b3]"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setUsernameError("");
                    }}
                  />

                </div>

                {/* Username Error */}

                {usernameError && (
                  <p className="ml-1 text-xs font-medium text-red-500">
                    {usernameError}
                  </p>
                )}

              </div>

              {/* ================================================= */}
              {/* PASSWORD */}
              {/* ================================================= */}

              <div className="space-y-2">

                <label className="ml-1 text-sm font-semibold text-[#344054]">
                  Password
                </label>

                <div
                  className={`flex items-center gap-3 rounded-2xl border bg-[#fbfcfd] px-4 py-3.5 transition ${passwordError
                    ? "border-red-400 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/10"
                    : "border-[#e4e7ec] focus-within:border-[#953002] focus-within:ring-4 focus-within:ring-[#953002]/10"
                    }`}
                >

                  <FiLock
                    className={`shrink-0 ${passwordError
                      ? "text-red-500"
                      : "text-[#953002]"
                      }`}
                    size={20}
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter password"
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#98a2b3]"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                  />

                  {/* Show / Hide Password */}

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className={`shrink-0 transition ${passwordError
                      ? "text-red-500 hover:text-red-700"
                      : "text-[#953002] hover:text-[#7b2802]"
                      }`}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    {showPassword ? (
                      <FiEye size={20} />
                    ) : (
                      <FiEyeOff size={20} />
                    )}

                  </button>

                </div>

                {/* Password Error */}

                {passwordError && (
                  <p className="ml-1 text-xs font-medium text-red-500">
                    {passwordError}
                  </p>
                )}

              </div>

              {/* ================================================= */}
              {/* ROLE */}
              {/* ================================================= */}

              <div className="space-y-2">

                <label className="ml-1 text-sm font-semibold text-[#344054]">
                  Select role
                </label>

                <div
                  className={`relative flex items-center gap-3 rounded-2xl border bg-[#fbfcfd] px-4 py-3.5 transition ${roleError
                    ? "border-red-400 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/10"
                    : "border-[#e4e7ec] focus-within:border-[#953002] focus-within:ring-4 focus-within:ring-[#953002]/10"
                    }`}
                >

                  <FaUserCog
                    className={`shrink-0 ${roleError
                      ? "text-red-500"
                      : "text-[#953002]"
                      }`}
                    size={20}
                  />

                  <select
                    className="w-full appearance-none bg-transparent text-sm outline-none"
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      setRoleError("");
                    }}
                  >

                    <option
                      value=""
                      disabled
                    >
                      Select role
                    </option>

                    <option value="SYSTEM_ADMIN">
                      Admin
                    </option>

                    <option value="STORE_STAFF">
                      Store Officer
                    </option>

                    <option value="FINANCIAL_SUPPLIER">
                      Financial Supplier
                    </option>

                    <option value="REQUESTING_OFFICER">
                      Requesting Officer
                    </option>

                    <option value="APPROVING_AUTHORITY">
                      Approving Authority
                    </option>

                  </select>

                  <FiChevronDown
                    className={`pointer-events-none absolute right-4 ${roleError
                      ? "text-red-500"
                      : "text-[#953002]"
                      }`}
                    size={18}
                  />

                </div>

                {/* Role Error */}

                {roleError && (
                  <p className="ml-1 text-xs font-medium text-red-500">
                    {roleError}
                  </p>
                )}

              </div>

              {/* ================================================= */}
              {/* LOGIN BUTTON */}
              {/* ================================================= */}

              <button
                type="submit"
                disabled={isLoading}
                className={`group flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-semibold text-white shadow-lg transition focus:outline-none focus:ring-4 focus:ring-[#953002]/20 ${isLoading
                  ? "cursor-not-allowed bg-[#953002]/60"
                  : "bg-[#953002] shadow-[#953002]/20 hover:bg-[#7b2802]"
                  }`}
              >

                {isLoading ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in

                    <FiArrowRight
                      className="transition-transform group-hover:translate-x-1"
                      size={18}
                    />
                  </>
                )}

              </button>

            </form>


            <div>
              <p className="mt-7 text-center text-xs leading-5 text-[#98a2b3]">

                Not registered yet?{" "}

                <Link href="/signup" className="font-semibold text-[#953002] hover:underline">
                  Create an account
                </Link>

              </p>
            </div>

            {/* ================================================= */}
            {/* FOOTER */}
            {/* ================================================= */}

            <p className="mt-7 text-center text-xs leading-5 text-[#98a2b3]">
              Secure access for authorized team members
            </p>

          </div>

        </section>

      </div>

    </main>
  );
}