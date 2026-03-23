import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchListingDetails();
    checkIfSaved();
  }, [id]);

  async function fetchListingDetails() {
    try {
      const response = await fetch(`/api/listings/${id}`);
      if (!response.ok) {
        navigate("/buyer/browse");
        return;
      }
      const data = await response.json();
      setListing(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching listing:", err);
      setLoading(false);
    }
  }

  function checkIfSaved() {
    const saved = JSON.parse(localStorage.getItem("savedItems") || "[]");
    setIsSaved(saved.includes(parseInt(id)));
  }

  function toggleSave() {
    const saved = JSON.parse(localStorage.getItem("savedItems") || "[]");
    const updated = isSaved
      ? saved.filter((itemId) => itemId !== parseInt(id))
      : [...saved, parseInt(id)];
    localStorage.setItem("savedItems", JSON.stringify(updated));
    setIsSaved(!isSaved);
  }

  function handleContactSeller() {
    if (!listing) return;

    navigate("/buyer/contact", {
      state: {
        listingId: listing.id,
      },
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading listing details...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Listing not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/buyer/browse")}
            className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium text-sm"
          >
            ← Back
          </button>
          <span className="text-brand-600 text-xl font-extrabold tracking-tight">
            MarketMap <span className="text-gray-700">Ethiopia</span>
          </span>
          <button
            onClick={toggleSave}
            className="text-2xl hover:scale-110 transition-transform"
          >
            {isSaved ? "❤️" : "🤍"}
          </button>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Listing Details */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
              {/* Image placeholder */}
              <div className="h-80 bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center">
                <span className="text-6xl">📦</span>
              </div>

              {/* Details */}
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {listing.title}
                </h1>
                <p className="text-2xl font-bold text-brand-600 mb-4">
                  ETB {listing.price}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Category
                    </p>
                    <p className="text-sm font-semibold text-gray-800 mt-1">
                      {listing.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Region
                    </p>
                    <p className="text-sm font-semibold text-gray-800 mt-1">
                      {listing.region}
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-2">
                    Description
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {listing.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Card */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                About Seller
              </h2>

              {/* Seller info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center mb-3">
                  <span className="text-3xl">👤</span>
                </div>
                <h3 className="font-bold text-gray-800 text-sm mb-1">
                  {listing.seller_name}
                </h3>
                <p className="text-xs text-gray-500 break-all mb-3">
                  {listing.seller_email}
                </p>
                <div className="inline-flex items-center gap-2 text-xs">
                  <span className="text-lg">🛡️</span>
                  <span className="font-medium text-gray-700 capitalize">
                    {listing.verification_status || "unverified"}
                  </span>
                </div>
              </div>

              {/* Contact button */}
              <button
                onClick={handleContactSeller}
                className="w-full rounded-lg bg-brand-600 text-white px-4 py-3 font-medium hover:bg-brand-700 transition-colors mb-3"
              >
                💬 Contact Seller
              </button>

              {/* Save button */}
              <button
                onClick={toggleSave}
                className={`w-full rounded-lg border-2 px-4 py-3 font-medium transition-colors ${
                  isSaved
                    ? "border-brand-600 text-brand-600 bg-brand-50"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {isSaved ? "❤️ Saved" : "🤍 Save Item"}
              </button>

              {/* Report button */}
              <button className="w-full rounded-lg text-gray-600 px-4 py-2 font-medium hover:bg-gray-100 transition-colors text-xs mt-3">
                🚩 Report Listing
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
