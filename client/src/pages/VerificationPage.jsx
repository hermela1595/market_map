import { useEffect, useState } from "react";
import {
  fetchPendingVerifications,
  submitVerification,
} from "../api/verification";
import { useAuth } from "../context/AuthContext";

export default function VerificationPage() {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);
  const [notesById, setNotesById] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workingId, setWorkingId] = useState(null);

  async function loadPending() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchPendingVerifications(user.token);
      setPending(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not load pending listings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPending();
  }, []);

  async function handleDecision(listingId, status) {
    setWorkingId(listingId);
    setError("");

    try {
      await submitVerification(
        listingId,
        {
          status,
          notes: notesById[listingId] || "",
        },
        user.token,
      );
      setPending((prev) => prev.filter((item) => item.id !== listingId));
    } catch (err) {
      setError(err.message || "Verification action failed");
    } finally {
      setWorkingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Verification Queue
        </h1>

        {error ? (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="text-sm text-gray-600">Loading pending listings...</p>
        ) : null}

        {!loading && pending.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-sm text-gray-600 shadow-sm">
            No pending listings to verify.
          </div>
        ) : null}

        <div className="space-y-4">
          {pending.map((item) => (
            <article
              key={item.id}
              className="rounded-xl bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    {item.title}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {item.category} - {item.region} - ETB{" "}
                    {Number(item.price || 0).toLocaleString()}
                  </p>
                </div>
                <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700">
                  Pending
                </span>
              </div>

              <p className="mt-3 text-sm text-gray-700">
                {item.description || "No description"}
              </p>

              <label
                className="mt-3 block text-xs font-medium text-gray-700"
                htmlFor={`notes-${item.id}`}
              >
                Reviewer notes
              </label>
              <textarea
                id={`notes-${item.id}`}
                rows={3}
                value={notesById[item.id] || ""}
                onChange={(event) =>
                  setNotesById((prev) => ({
                    ...prev,
                    [item.id]: event.target.value,
                  }))
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Optional notes for this decision"
              />

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleDecision(item.id, "approved")}
                  disabled={workingId === item.id}
                  className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDecision(item.id, "rejected")}
                  disabled={workingId === item.id}
                  className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
