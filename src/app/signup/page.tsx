"use client";

import React, { useState } from "react";
import {
    FiArrowRight,
    FiChevronDown,
    FiEye,
    FiEyeOff,
    FiLock,
    FiMail,
    FiMapPin,
    FiUser,
} from "react-icons/fi";
import { FaUserCog } from "react-icons/fa";
import { BiBuildings } from "react-icons/bi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";

export default function SignupPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [location, setLocation] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // =========================================================
    // ERROR STATES
    // =========================================================

    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [roleError, setRoleError] = useState("");
    const [locationError, setLocationError] = useState("");
    const [signupError, setSignupError] = useState("");

    // =========================================================
    // LOADING
    // =========================================================

    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    // =========================================================
    // FIELD CLASS
    // =========================================================

    const getFieldClass = (hasError: boolean) =>
        `flex items-center gap-3 rounded-2xl border bg-[#fbfcfd] px-4 py-3.5 transition ${hasError
            ? "border-red-400 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/10"
            : "border-[#e4e7ec] focus-within:border-[#953002] focus-within:ring-4 focus-within:ring-[#953002]/10"
        }`;

    // =========================================================
    // PASSWORD VALIDATION
    // =========================================================

    const validatePassword = (value: string): string => {
        if (!value) {
            return "Please enter a password";
        }

        if (value.length < 8) {
            return "Password must contain at least 8 characters";
        }

        if (!/[A-Za-z]/.test(value)) {
            return "Password must contain at least one letter";
        }

        if (!/[0-9]/.test(value)) {
            return "Password must contain at least one number";
        }

        if (!/[^A-Za-z0-9]/.test(value)) {
            return "Password must contain at least one special character";
        }

        return "";
    };

    // =========================================================
    // EMAIL VALIDATION
    // =========================================================

    const validateEmail = (value: string): string => {
        if (!value.trim()) {
            return "Please enter your email";
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) {
            return "Please enter a valid email address";
        }

        return "";
    };

    // =========================================================
    // SIGNUP
    // =========================================================

    const handleSignup = async () => {
        // Clear API error
        setSignupError("");

        // Clear previous errors
        setUsernameError("");
        setEmailError("");
        setPasswordError("");
        setConfirmPasswordError("");
        setRoleError("");
        setLocationError("");

        let hasError = false;

        // =====================================================
        // USERNAME
        // =====================================================

        if (!username.trim()) {
            setUsernameError("Please enter a username");
            hasError = true;
        }

        // =====================================================
        // EMAIL
        // =====================================================

        const emailValidation = validateEmail(email);

        if (emailValidation) {
            setEmailError(emailValidation);
            hasError = true;
        }

        // =====================================================
        // PASSWORD
        // =====================================================

        const passwordValidation =
            validatePassword(password);

        if (passwordValidation) {
            setPasswordError(passwordValidation);
            hasError = true;
        }

        // =====================================================
        // CONFIRM PASSWORD
        // =====================================================

        if (!confirmPassword) {
            setConfirmPasswordError(
                "Please confirm your password"
            );

            hasError = true;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError(
                "Passwords do not match"
            );

            hasError = true;
        }

        // =====================================================
        // ROLE
        // =====================================================

        if (!role) {
            setRoleError("Please select a role");
            hasError = true;
        }

        // =====================================================
        // LOCATION
        // =====================================================

        if (!location) {
            setLocationError("Please select a location");
            hasError = true;
        }

        // =====================================================
        // STOP IF VALIDATION FAILED
        // =====================================================

        if (hasError) {
            return;
        }

        // =====================================================
        // API REQUEST
        // =====================================================

        try {
            setIsLoading(true);

            console.log("Registering user...");

            console.log({
                username,
                password,
                email,
                role,
                location,
            });

            const response = await api.post(
                "/api/auth/register",
                {
                    username,
                    password,
                    email,
                    role,
                    location,
                }
            );

            console.log(
                "REGISTER RESPONSE:",
                response
            );

            console.log(
                "REGISTER DATA:",
                response.data
            );

            // =================================================
            // SUCCESS
            // =================================================

            alert("User Registered Successfully");

            router.push("/login");

        } catch (error: unknown) {
            console.error(
                "REGISTRATION ERROR:",
                error
            );

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

                console.error(
                    "STATUS:",
                    axiosError.response?.status
                );

                console.error(
                    "DATA:",
                    axiosError.response?.data
                );

                const responseData =
                    axiosError.response?.data;

                // ---------------------------------------------
                // BACKEND ERROR MESSAGE
                // ---------------------------------------------

                if (
                    typeof responseData === "object" &&
                    responseData !== null &&
                    "message" in responseData
                ) {
                    const message =
                        String(
                            (
                                responseData as {
                                    message?: unknown;
                                }
                            ).message
                        );

                    setSignupError(message);
                } else if (
                    typeof responseData === "string"
                ) {
                    setSignupError(responseData);
                } else {
                    setSignupError(
                        "Registration failed. Please try again."
                    );
                }

            } else {
                setSignupError(
                    "Unable to connect to the server. Please try again."
                );
            }

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f8fa] px-4 py-10 text-[#1f2937]">

            {/* ================================================= */}
            {/* BACKGROUND */}
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

                    <div className="absolute -right-24 -top-20 size-72 rounded-full border-[42px] border-[#ffb401]/30" />

                    <div className="absolute -bottom-28 -left-24 size-80 rounded-full border-[48px] border-white/10" />

                    <div className="relative">

                        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#ffb401] text-[#281914] shadow-lg shadow-[#281914]/20">
                            <BiBuildings size={27} />
                        </div>

                        <p className="mt-7 text-sm font-semibold uppercase tracking-[0.22em] text-[#ffb401]">
                            IMS platform
                        </p>

                        <h1 className="mt-4 max-w-sm text-4xl font-semibold leading-tight tracking-tight">
                            Bring your inventory team into one clear workspace.
                        </h1>

                        <p className="mt-5 max-w-sm text-base leading-7 text-white/70">
                            Create your account and connect the people,
                            products, and locations that keep operations moving.
                        </p>

                    </div>

                    {/* Bottom information */}

                    <div className="relative rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">

                        <div className="flex items-center justify-between text-sm">

                            <span className="text-white/70">
                                Workspace setup
                            </span>

                            <span className="flex items-center gap-2 font-semibold">

                                <span className="size-2 rounded-full bg-[#ffb401]" />

                                Simple

                            </span>

                        </div>

                        <div className="mt-5 flex items-end gap-2">

                            <span className="text-3xl font-semibold">
                                One
                            </span>

                            <span className="pb-1 text-sm text-white/60">
                                place for every stock decision
                            </span>

                        </div>

                    </div>

                </section>

                {/* ================================================= */}
                {/* RIGHT SIDE */}
                {/* ================================================= */}

                <section className="p-7 sm:p-10 lg:p-14">

                    {/* Mobile heading */}

                    <div className="mb-9 flex items-center gap-3 lg:hidden">

                        <div className="flex size-10 items-center justify-center rounded-xl bg-[#953002] text-white">
                            <BiBuildings size={23} />
                        </div>

                        <span className="font-semibold text-[#953002]">
                            Inventory Management
                        </span>

                    </div>

                    <div className="max-w-md">

                        {/* Heading */}

                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#953002]">
                            Get started
                        </p>

                        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#1f2937] sm:text-4xl">
                            Create your workspace account
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-[#667085]">
                            Set up your profile to start managing inventory with your team.
                        </p>

                        {/* ================================================= */}
                        {/* FORM */}
                        {/* ================================================= */}

                        <form
                            className="mt-9 grid gap-5 sm:grid-cols-2"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSignup();
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
                                    className={getFieldClass(
                                        !!usernameError
                                    )}
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
                                            setUsername(
                                                e.target.value
                                            );
                                            setUsernameError("");
                                        }}
                                    />

                                </div>

                                {usernameError && (
                                    <p className="ml-1 text-xs font-medium text-red-500">
                                        {usernameError}
                                    </p>
                                )}

                            </div>

                            {/* ================================================= */}
                            {/* EMAIL */}
                            {/* ================================================= */}

                            <div className="space-y-2">

                                <label className="ml-1 text-sm font-semibold text-[#344054]">
                                    Email
                                </label>

                                <div
                                    className={getFieldClass(
                                        !!emailError
                                    )}
                                >

                                    <FiMail
                                        className={`shrink-0 ${emailError
                                            ? "text-red-500"
                                            : "text-[#953002]"
                                            }`}
                                        size={20}
                                    />

                                    <input
                                        type="email"
                                        placeholder="Enter email address"
                                        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#98a2b3]"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(
                                                e.target.value
                                            );
                                            setEmailError("");
                                        }}
                                    />

                                </div>

                                {emailError && (
                                    <p className="ml-1 text-xs font-medium text-red-500">
                                        {emailError}
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
                                    className={getFieldClass(
                                        !!passwordError
                                    )}
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
                                        placeholder="password@123"
                                        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#98a2b3]"
                                        value={password}
                                        onChange={(e) => {
                                            const value =
                                                e.target.value;

                                            setPassword(value);

                                            // Validate while typing
                                            if (value.length > 0) {
                                                setPasswordError(
                                                    validatePassword(
                                                        value
                                                    )
                                                );
                                            } else {
                                                setPasswordError("");
                                            }

                                            // Re-check confirm password
                                            if (
                                                confirmPassword &&
                                                value !==
                                                confirmPassword
                                            ) {
                                                setConfirmPasswordError(
                                                    "Passwords do not match"
                                                );
                                            } else {
                                                setConfirmPasswordError(
                                                    ""
                                                );
                                            }
                                        }}
                                    />

                                    <button
                                        type="button"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        onClick={() =>
                                            setShowPassword(
                                                (visible) =>
                                                    !visible
                                            )
                                        }
                                        className={`shrink-0 transition ${passwordError
                                            ? "text-red-500 hover:text-red-700"
                                            : "text-[#667085] hover:text-[#953002]"
                                            }`}
                                    >

                                        {showPassword ? (
                                            <FiEye size={18} />
                                        ) : (
                                            <FiEyeOff size={18} />
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
                            {/* CONFIRM PASSWORD */}
                            {/* ================================================= */}

                            <div className="space-y-2">

                                <label className="ml-1 text-sm font-semibold text-[#344054]">
                                    Confirm password
                                </label>

                                <div
                                    className={getFieldClass(
                                        !!confirmPasswordError
                                    )}
                                >

                                    <FiLock
                                        className={`shrink-0 ${confirmPasswordError
                                            ? "text-red-500"
                                            : "text-[#953002]"
                                            }`}
                                        size={20}
                                    />

                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Re-enter your password"
                                        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#98a2b3]"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            const value =
                                                e.target.value;

                                            setConfirmPassword(
                                                value
                                            );

                                            if (
                                                value &&
                                                value !== password
                                            ) {
                                                setConfirmPasswordError(
                                                    "Passwords do not match"
                                                );
                                            } else {
                                                setConfirmPasswordError(
                                                    ""
                                                );
                                            }
                                        }}
                                    />

                                    <button
                                        type="button"
                                        aria-label={
                                            showConfirmPassword
                                                ? "Hide confirm password"
                                                : "Show confirm password"
                                        }
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (visible) =>
                                                    !visible
                                            )
                                        }
                                        className={`shrink-0 transition ${confirmPasswordError
                                            ? "text-red-500 hover:text-red-700"
                                            : "text-[#667085] hover:text-[#953002]"
                                            }`}
                                    >

                                        {showConfirmPassword ? (
                                            <FiEye size={18} />
                                        ) : (
                                            <FiEyeOff size={18} />
                                        )}

                                    </button>

                                </div>

                                {confirmPasswordError && (
                                    <p className="ml-1 text-xs font-medium text-red-500">
                                        {
                                            confirmPasswordError
                                        }
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
                                    className={`relative ${getFieldClass(
                                        !!roleError
                                    )}`}
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
                                            setRole(
                                                e.target.value
                                            );
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

                                {roleError && (
                                    <p className="ml-1 text-xs font-medium text-red-500">
                                        {roleError}
                                    </p>
                                )}

                            </div>

                            {/* ================================================= */}
                            {/* LOCATION */}
                            {/* ================================================= */}

                            <div className="space-y-2">

                                <label className="ml-1 text-sm font-semibold text-[#344054]">
                                    Location
                                </label>

                                <div
                                    className={`relative ${getFieldClass(
                                        !!locationError
                                    )}`}
                                >

                                    <FiMapPin
                                        className={`shrink-0 ${locationError
                                            ? "text-red-500"
                                            : "text-[#953002]"
                                            }`}
                                        size={20}
                                    />

                                    <select
                                        className="w-full appearance-none bg-transparent text-sm outline-none"
                                        value={location}
                                        onChange={(e) => {
                                            setLocation(
                                                e.target.value
                                            );
                                            setLocationError("");
                                        }}
                                    >

                                        <option
                                            value=""
                                            disabled
                                        >
                                            Select location
                                        </option>

                                        <option value="HEAD_OFFICE">
                                            Head Office
                                        </option>

                                        <option value="KALUTARA">
                                            Kalutara
                                        </option>

                                        <option value="KANDY">
                                            Kandy
                                        </option>

                                        <option value="GALLE">
                                            Galle
                                        </option>

                                        <option value="GAMPAHA">
                                            Gampaha
                                        </option>

                                        <option value="ANURADHAPURA">
                                            Anuradhapura
                                        </option>

                                    </select>

                                    <FiChevronDown
                                        className={`pointer-events-none absolute right-4 ${locationError
                                            ? "text-red-500"
                                            : "text-[#953002]"
                                            }`}
                                        size={18}
                                    />

                                </div>

                                {locationError && (
                                    <p className="ml-1 text-xs font-medium text-red-500">
                                        {locationError}
                                    </p>
                                )}

                            </div>

                            {/* ================================================= */}
                            {/* API ERROR */}
                            {/* ================================================= */}

                            {signupError && (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 sm:col-span-2">
                                    {signupError}
                                </div>
                            )}

                            {/* ================================================= */}
                            {/* SUBMIT */}
                            {/* ================================================= */}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-semibold text-white shadow-lg transition focus:outline-none focus:ring-4 focus:ring-[#953002]/20 sm:col-span-2 ${isLoading
                                    ? "cursor-not-allowed bg-[#953002]/60"
                                    : "bg-[#953002] shadow-[#953002]/20 hover:bg-[#7b2802]"
                                    }`}
                            >

                                {isLoading ? (
                                    <>
                                        <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create account

                                        <FiArrowRight
                                            className="transition-transform group-hover:translate-x-1"
                                            size={18}
                                        />
                                    </>
                                )}

                            </button>

                        </form>

                        {/* ================================================= */}
                        {/* LOGIN LINK */}
                        {/* ================================================= */}

                        <p className="mt-7 text-center text-xs leading-5 text-[#98a2b3]">

                            Already have an account?{" "}

                            <Link
                                href="/login"
                                className="font-semibold text-[#953002] hover:underline"
                            >
                                Sign in
                            </Link>

                        </p>

                    </div>

                </section>

            </div>

        </main>
    );
}