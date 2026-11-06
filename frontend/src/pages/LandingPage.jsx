import { Link } from "react-router-dom";

import {
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Building2,
  Users,
  BedDouble,
} from "lucide-react";

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* NAVBAR */}

      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-600 p-2 text-white">
              <Building2 size={25} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-gray-800">
                Hostel Management
              </h1>

              <p className="text-xs text-gray-500">
                Student Accommodation System
              </p>
            </div>
          </Link>

          <span className="hidden text-sm font-medium text-gray-500 sm:block">
            Welcome to Our Hostel Portal
          </span>

        </div>
      </nav>

      {/* HERO SECTION */}

      <main className="mx-auto max-w-7xl px-6 py-16">

        <div className="mx-auto mb-14 max-w-3xl text-center">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700">
            <Building2 size={16} />
            Smart Hostel Management
          </div>

          <h2 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
            Welcome to Your
            <span className="block text-indigo-600">
              Hostel Portal
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
            A centralized platform to manage hostel accommodation,
            student information, room allocation, and administrative
            activities.
          </p>

        </div>

        {/* PORTAL CARDS */}

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">

          {/* STUDENT PORTAL */}

          <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-indigo-300 hover:shadow-xl">

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
              <GraduationCap size={35} />
            </div>

            <h3 className="text-2xl font-bold text-gray-800">
              Student Portal
            </h3>

            <p className="mt-3 leading-7 text-gray-500">
              Access your student account, manage your profile,
              select your preferred room, and check your hostel
              allocation details.
            </p>

            <div className="my-6 space-y-3">

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Users size={18} className="text-indigo-600" />
                Manage student profile
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <BedDouble size={18} className="text-indigo-600" />
                Select and manage rooms
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <ShieldCheck size={18} className="text-indigo-600" />
                Secure student login
              </div>

            </div>

            <Link
              to="/student/login"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Student Login
              <ArrowRight size={19} />
            </Link>

            <p className="mt-4 text-center text-sm text-gray-500">
              New student?{" "}
              <Link
                to="/student/register"
                className="font-semibold text-indigo-600 hover:underline"
              >
                Register here
              </Link>
            </p>

          </div>

          {/* ADMIN PORTAL */}

          <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-xl">

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <ShieldCheck size={35} />
            </div>

            <h3 className="text-2xl font-bold text-gray-800">
              Admin Portal
            </h3>

            <p className="mt-3 leading-7 text-gray-500">
              Manage student accounts, generate Hostel IDs,
              allocate rooms, monitor occupancy, and oversee
              hostel operations.
            </p>

            <div className="my-6 space-y-3">

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Users size={18} className="text-emerald-600" />
                Manage student records
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <BedDouble size={18} className="text-emerald-600" />
                Manage room allocation
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Building2 size={18} className="text-emerald-600" />
                Monitor hostel statistics
              </div>

            </div>

            <Link
              to="/admin/login"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Admin Login
              <ArrowRight size={19} />
            </Link>

            <p className="mt-4 text-center text-sm text-gray-500">
              Authorized administrators only
            </p>

          </div>

        </div>

        {/* HOSTEL INFORMATION */}

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">

          <div className="rounded-xl bg-white p-6 text-center shadow-sm">
            <Building2 className="mx-auto text-indigo-600" size={28} />

            <h3 className="mt-3 text-2xl font-bold text-gray-800">
              100
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Hostel Rooms
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 text-center shadow-sm">
            <Users className="mx-auto text-indigo-600" size={28} />

            <h3 className="mt-3 text-2xl font-bold text-gray-800">
              500
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Student Capacity
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 text-center shadow-sm">
            <BedDouble className="mx-auto text-indigo-600" size={28} />

            <h3 className="mt-3 text-2xl font-bold text-gray-800">
              5
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Hostel Floors
            </p>
          </div>

        </div>

      </main>

      {/* FOOTER */}

      <footer className="border-t border-gray-200 bg-white py-6">

        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Student Hostel Management System.
          All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default LandingPage;