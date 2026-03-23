import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SavedItemsPage() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedItems();
  }, []);

  async function loadSavedItems() {
    try {
      const saved = JSON.parse(localStorage.getItem("savedItems") || "[]");
      setSavedItems(saved);

      if (saved.length === 0) {
        setLoading(false);
        return;
      }

      const response = await fetch("/api/listings");
      if (!response.ok) throw new Error("Failed to fetch listings");
      const allListings = await response.json();

      const savedListings = allListings.filter((l) => saved.includes(l.id));
      setListings(savedListings);
      setLoading(false);
    } catch (err) {
      console.error("Error loading saved items:", err);
      setLoading(false);
    }
  }

  function removeSavedItem(listingId) {
    const updated = savedItems.filter((id) => id !== listingId);
    setSavedItems(updated);
    localStorage.setItem("savedItems", JSON.stringify(updated));
    setListings(listings.filter((l) => l.id !== listingId));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium text-sm"
          >
            ← Back
          </button>
          <span className="text-brand-600 text-xl font-extrabold tracking-tight">
            MarketMap <span className="text-gray-700">Ethiopia</span>
          </span>
          <span className="w-16" />
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-2xl bg-white shadow-sm p-8 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            ❤️ Saved Items
          </h1>
          <p className="text-sm text-gray-500">
            Your bookmarked listings ({listings.length})
          </p>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading saved items...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="rounded-2xl bg-white shadow-sm p-12 text-center">
            <p className="text-gray-500 mb-4">No saved items yet</p>
            <button
              onClick={() => navigate("/buyer/browse")}
              className="rounded-lg bg-brand-600 text-white px-4 py-2 font-medium hover:bg-brand-700 transition-colors"
            >
              Browse Listings
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="rounded-xl bg-white border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="h-40 bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center">
                  <span className="text-4xl">📦</span>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-2">
                    {listing.title}
                  </h3>

                  {/* Seller info */}
                  <div className="mb-2 pb-2 border-b border-gray-100 text-xs">
                    <p className="text-gray-500">Seller</p>
                    <p className="font-medium text-gray-800">
                      {listing.seller_name || "Unknown"}
                    </p>
                  </div>

                  <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">
                    {listing.description}
                  </p>
                  <div className="mb-3">
                    <p className="text-lg font-bold text-brand-600">
                      ETB {listing.price}
                    </p>
                  </div>
                  <div className="grid gap-2 grid-cols-2">
                    <button
                      onClick={() => navigate(`/buyer/listing/${listing.id}`)}
                      className="rounded-lg bg-brand-600 text-white px-3 py-2 text-sm font-medium hover:bg-brand-700 transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => removeSavedItem(listing.id)}
                      className="rounded-lg border border-gray-300 text-gray-700 px-3 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Unsave
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
