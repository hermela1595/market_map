import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from "../api/baseUrl.js";

export default function BrowseListingsPage() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    fetchListings();
    fetchCategoriesAndRegions();
    loadSavedItems();
  }, []);

  useEffect(() => {
    filterListings();
  }, [listings, searchTerm, selectedCategory, selectedRegion]);

  async function fetchListings() {
    try {
      const response = await fetch(buildApiUrl("/api/listings"));
      if (!response.ok) throw new Error("Failed to fetch listings");
      const data = await response.json();
      setListings(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setLoading(false);
    }
  }

  async function fetchCategoriesAndRegions() {
    try {
      const [catRes, regRes] = await Promise.all([
        fetch(buildApiUrl("/api/listings/categories")),
        fetch(buildApiUrl("/api/listings/regions")),
      ]);
      if (catRes.ok) setCategories(await catRes.json());
      if (regRes.ok) setRegions(await regRes.json());
    } catch (err) {
      console.error("Error fetching filters:", err);
    }
  }

  function loadSavedItems() {
    const saved = JSON.parse(localStorage.getItem("savedItems") || "[]");
    setSavedItems(saved);
  }

  function filterListings() {
    let filtered = listings;

    if (searchTerm) {
      filtered = filtered.filter(
        (l) =>
          l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((l) => l.category === selectedCategory);
    }

    if (selectedRegion !== "all") {
      filtered = filtered.filter((l) => l.region === selectedRegion);
    }

    setFilteredListings(filtered);
  }

  function toggleSaveItem(listingId) {
    const updated = savedItems.includes(listingId)
      ? savedItems.filter((id) => id !== listingId)
      : [...savedItems, listingId];
    setSavedItems(updated);
    localStorage.setItem("savedItems", JSON.stringify(updated));
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
          <button
            onClick={() => navigate("/buyer/saved")}
            className="text-brand-600 hover:text-brand-700 font-medium text-sm"
          >
            ❤️ Saved
          </button>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-2xl bg-white shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Current Listings
          </h1>

          {/* Search and Filters */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="all">All Regions</option>
                {regions.map((reg) => (
                  <option key={reg.name} value={reg.name}>
                    {reg.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading listings...</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl">
            <p className="text-gray-500">No listings found</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((listing) => (
              <div
                key={listing.id}
                className="rounded-xl bg-white border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="h-40 bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center">
                  <span className="text-4xl">📦</span>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 flex-1">
                      {listing.title}
                    </h3>
                    <button
                      onClick={() => toggleSaveItem(listing.id)}
                      className="text-lg flex-shrink-0"
                    >
                      {savedItems.includes(listing.id) ? "❤️" : "🤍"}
                    </button>
                  </div>

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
                  <button
                    onClick={() => navigate(`/buyer/listing/${listing.id}`)}
                    className="w-full rounded-lg bg-brand-600 text-white px-3 py-2 text-sm font-medium hover:bg-brand-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
