import { useEffect, useMemo, useState } from "react";
import {
  Copy,
  Check,
  Search,
  RefreshCw,
  Plus,
  Users,
  KeyRound,
  CheckCircle,
  Clock,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import API from "../../services/api";

function HostelIdManagement() {
  // ============================
  // STATES
  // ============================

  const [hostelIds, setHostelIds] = useState([]);
  const [availableIds, setAvailableIds] = useState([]);

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const [quantity, setQuantity] = useState(5);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [copiedId, setCopiedId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================
  // FETCH ALL HOSTEL IDS
  // ============================

  const fetchAllHostelIds = async () => {
    try {
      const response = await API.get("/hostel-ids");

      setHostelIds(response.data.hostelIds || []);
    } catch (error) {
      console.error("Error fetching Hostel IDs:", error);

      setError(
        error.response?.data?.message ||
          "Failed to retrieve Hostel IDs."
      );
    }
  };

  // ============================
  // FETCH AVAILABLE HOSTEL IDS
  // ============================

  const fetchAvailableHostelIds = async () => {
    try {
      const response = await API.get("/hostel-ids/available");

      setAvailableIds(response.data.hostelIds || []);
    } catch (error) {
      console.error("Error fetching available IDs:", error);

      setError(
        error.response?.data?.message ||
          "Failed to retrieve available Hostel IDs."
      );
    }
  };

  // ============================
  // FETCH DATA
  // ============================

  const fetchData = async () => {
    setLoading(true);
    setError("");

    await Promise.all([
      fetchAllHostelIds(),
      fetchAvailableHostelIds(),
    ]);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ============================
  // GENERATE HOSTEL IDS
  // ============================

  const handleGenerate = async (e) => {
    e.preventDefault();

    const number = Number(quantity);

    if (!Number.isInteger(number) || number < 1 || number > 100) {
      setError("Please enter a quantity between 1 and 100.");
      return;
    }

    try {
      setGenerating(true);
      setError("");
      setSuccess("");

      const response = await API.post("/hostel-ids/generate", {
        quantity: number,
      });

      setSuccess(
        `${response.data.totalGenerated} Hostel IDs generated successfully!`
      );

      setActiveTab("all");
      setSearch("");

      await fetchData();
    } catch (error) {
      console.error("Error generating Hostel IDs:", error);

      setError(
        error.response?.data?.message ||
          "Failed to generate Hostel IDs."
      );
    } finally {
      setGenerating(false);
    }
  };

  // ============================
  // COPY HOSTEL ID
  // ============================

  const handleCopy = async (hostelId) => {
    try {
      await navigator.clipboard.writeText(hostelId);

      setCopiedId(hostelId);

      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (error) {
      console.error("Clipboard error:", error);
      setError("Unable to copy Hostel ID.");
    }
  };

  // ============================
  // FILTER HOSTEL IDS
  // ============================

  const filteredIds = useMemo(() => {
    let data = [];

    if (activeTab === "available") {
      data = availableIds;
    } else if (activeTab === "registered") {
      data = hostelIds.filter((item) => item.isRegistered);
    } else {
      data = hostelIds;
    }

    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return data;
    }

    return data.filter((item) => {
      const student = item.student || {};

      return (
        item.hostelId?.toLowerCase().includes(searchText) ||
        student.name?.toLowerCase().includes(searchText) ||
        student.email?.toLowerCase().includes(searchText) ||
        student.universityRollNo
          ?.toLowerCase()
          .includes(searchText)
      );
    });
  }, [hostelIds, availableIds, activeTab, search]);

  // ============================
  // STATISTICS
  // ============================

  const totalIds = hostelIds.length;

  const totalAvailable = availableIds.length;

  const totalRegistered = hostelIds.filter(
    (item) => item.isRegistered
  ).length;

  // ============================
  // RENDER
  // ============================

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* HEADER */}

      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Hostel ID Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Generate and manage student Hostel IDs.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>

      </div>

      {/* ALERT MESSAGES */}

      {error && (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>

          <button
            onClick={() => setError("")}
            className="font-bold"
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} />
            {success}
          </div>

          <button
            onClick={() => setSuccess("")}
            className="font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* STATISTICS CARDS */}

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

        {/* TOTAL IDS */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Hostel IDs
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-800">
                {totalIds}
              </h2>
            </div>

            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
              <KeyRound size={25} />
            </div>

          </div>
        </div>

        {/* AVAILABLE IDS */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Available IDs
              </p>

              <h2 className="mt-2 text-3xl font-bold text-green-600">
                {totalAvailable}
              </h2>
            </div>

            <div className="rounded-lg bg-green-100 p-3 text-green-600">
              <Clock size={25} />
            </div>

          </div>
        </div>

        {/* REGISTERED IDS */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Registered IDs
              </p>

              <h2 className="mt-2 text-3xl font-bold text-purple-600">
                {totalRegistered}
              </h2>
            </div>

            <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
              <Users size={25} />
            </div>

          </div>
        </div>

      </div>

      {/* GENERATE HOSTEL IDS */}

      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="mb-5 flex items-center gap-3">

          <div className="rounded-lg bg-indigo-100 p-3 text-indigo-600">
            <Plus size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Generate Hostel IDs
            </h2>

            <p className="text-sm text-gray-500">
              Generate new IDs for students.
            </p>
          </div>

        </div>

        <form
          onSubmit={handleGenerate}
          className="flex flex-col gap-4 sm:flex-row sm:items-end"
        >

          <div className="w-full sm:max-w-xs">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Number of IDs
            </label>

            <input
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Enter quantity"
            />

            <p className="mt-1 text-xs text-gray-400">
              Minimum 1 and maximum 100 IDs per request.
            </p>

          </div>

          <button
            type="submit"
            disabled={generating}
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {generating ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Plus size={18} />
                Generate IDs
              </>
            )}
          </button>

        </form>

      </div>

      {/* HOSTEL ID TABLE */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* TABLE HEADER */}

        <div className="border-b border-gray-200 p-5">

          <h2 className="text-lg font-semibold text-gray-800">
            Hostel ID Records
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            View and manage all generated Hostel IDs.
          </p>

        </div>

        {/* FILTERS */}

        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 lg:flex-row lg:items-center lg:justify-between">

          {/* TABS */}

          <div className="flex flex-wrap gap-2">

            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All IDs ({totalIds})
            </button>

            <button
              onClick={() => setActiveTab("available")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === "available"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Available ({totalAvailable})
            </button>

            <button
              onClick={() => setActiveTab("registered")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === "registered"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Registered ({totalRegistered})
            </button>

          </div>

          {/* SEARCH */}

          <div className="relative w-full lg:max-w-sm">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Hostel ID or student..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

          </div>

        </div>

        {/* TABLE CONTENT */}

        {loading ? (

          <div className="flex flex-col items-center justify-center py-16">

            <LoaderCircle
              size={35}
              className="animate-spin text-indigo-600"
            />

            <p className="mt-3 text-sm text-gray-500">
              Loading Hostel IDs...
            </p>

          </div>

        ) : filteredIds.length === 0 ? (

          <div className="py-16 text-center">

            <KeyRound
              size={40}
              className="mx-auto text-gray-300"
            />

            <h3 className="mt-3 font-semibold text-gray-700">
              No Hostel IDs found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or generate new IDs.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[750px] text-left">

              <thead className="bg-gray-50 text-xs uppercase text-gray-500">

                <tr>
                  <th className="px-5 py-4 font-semibold">
                    Hostel ID
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Student Name
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    University Roll No.
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Email
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-4 text-center font-semibold">
                    Action
                  </th>
                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredIds.map((item) => {

                  const student = item.student || {};

                  const registered = item.isRegistered;

                  return (

                    <tr
                      key={item._id}
                      className="transition hover:bg-gray-50"
                    >

                      <td className="px-5 py-4">

                        <span className="font-semibold text-gray-800">
                          {item.hostelId}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {registered
                          ? student.name || "Student details unavailable"
                          : "—"}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {registered
                          ? student.universityRollNo || "—"
                          : "—"}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {registered
                          ? student.email || "—"
                          : "—"}
                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                            registered
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >

                          {registered ? (
                            <CheckCircle size={14} />
                          ) : (
                            <Clock size={14} />
                          )}

                          {registered ? "Registered" : "Available"}

                        </span>

                      </td>

                      <td className="px-5 py-4 text-center">

                        <button
                          onClick={() => handleCopy(item.hostelId)}
                          title="Copy Hostel ID"
                          className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
                        >

                          {copiedId === item.hostelId ? (
                            <Check size={17} />
                          ) : (
                            <Copy size={17} />
                          )}

                        </button>

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        )}

        {/* TABLE FOOTER */}

        {!loading && filteredIds.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-4 text-sm text-gray-500">
            Showing {filteredIds.length} Hostel ID records.
          </div>
        )}

      </div>

    </div>
  );
}

export default HostelIdManagement;