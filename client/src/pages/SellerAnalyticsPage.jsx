import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { buildApiUrl } from "../api/baseUrl.js";

export default function SellerAnalyticsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    totalViews: 0,
    verificationStatus: "pending",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(buildApiUrl("/api/listings"), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) return setLoading(false);

      const listings = await response.json();
      const userListings = listings.filter((l) => l.seller_id === user.id);

      setStats({
        totalListings: userListings.length,
        activeListings: userListings.filter((l) => l.status === "active")
          .length,
        totalViews: userListings.reduce((sum, l) => sum + (l.views || 0), 0),
        verificationStatus: user.verification_status || "unverified",
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setLoading(false);
    }
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
            Seller Analytics
          </h1>
          <p className="text-sm text-gray-500">
            Track your performance and listing insights
          </p>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading analytics...</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              label="Total Listings"
              value={stats.totalListings}
              icon="📦"
            />
            <StatCard
              label="Active Listings"
              value={stats.activeListings}
              icon="✅"
            />
            <StatCard label="Total Views" value={stats.totalViews} icon="👁️" />
            <StatCard
              label="Verification"
              value={stats.verificationStatus}
              icon="🛡️"
            />
          </div>
        )}

        {/* Quick actions */}
        <div className="rounded-2xl bg-white shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => navigate("/seller/listings/new")}
              className="rounded-lg bg-brand-600 text-white px-4 py-2 font-medium hover:bg-brand-700 transition-colors"
            >
              Create New Listing
            </button>
            <button
              onClick={() => navigate("/seller/listings")}
              className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              View All Listings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-xl bg-white border border-gray-200 p-6">
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
      <p className="text-2xl font-bold text-gray-800 mt-2 capitalize">
        {value}
      </p>
    </div>
  );
}
