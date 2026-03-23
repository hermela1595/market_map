import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchListings, removeListing } from "../api/listings";
import { useAuth } from "../context/AuthContext";

export default function MyListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchListings(user.token);
      setListings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not load listings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const mine = useMemo(
    () => listings.filter((item) => Number(item.seller_id) === Number(user.id)),
    [listings, user.id],
  );

  async function onDelete(id) {
    setDeletingId(id);
    try {
      await removeListing(id, user.token);
      setListings((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Go Back
            </Link>
            <Link
              to="/seller/listings/new"
              className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Create Listing
            </Link>
          </div>
        </div>

        {error ? (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="text-sm text-gray-600">Loading listings...</p>
        ) : null}

        {!loading && mine.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-sm text-gray-600 shadow-sm">
            You have no listings yet.
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mine.map((item) => (
            <article
              key={item.id}
              className="rounded-xl bg-white p-4 shadow-sm"
            >
              <h2 className="text-sm font-semibold text-gray-900">
                {item.title}
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                {item.category} - {item.region}
              </p>
              <p className="mt-2 text-sm font-medium text-gray-800">
                ETB {Number(item.price || 0).toLocaleString()}
              </p>
              <p className="mt-2 line-clamp-3 text-xs text-gray-600">
                {item.description}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${item.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                >
                  {item.verified ? "Verified" : "Pending"}
                </span>
                <button
                  onClick={() => onDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="text-xs font-medium text-red-600 hover:text-red-500 disabled:opacity-50"
                >
                  {deletingId === item.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
