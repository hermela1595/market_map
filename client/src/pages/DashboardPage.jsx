import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLE_BADGE = {
  admin: "bg-purple-100 text-purple-700",
  seller: "bg-brand-100 text-brand-700",
  buyer: "bg-green-100 text-green-700",
};

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <span className="text-brand-600 text-xl font-extrabold tracking-tight">
            MarketMap <span className="text-gray-700">Ethiopia</span>
          </span>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-gray-600">
              {user.name}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                ROLE_BADGE[user.role] ?? "bg-gray-100 text-gray-700"
              }`}
            >
              {user.role}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-2xl bg-white shadow-sm p-8 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Welcome back, {user.name}!
          </h1>
          <p className="text-sm text-gray-500">
            Signed in as{" "}
            <span className="font-medium text-gray-700">{user.email}</span>
          </p>
        </div>

        {/* Role-specific quick-start cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {user.role === "seller" && (
            <>
              <QuickCard
                title="Create listing"
                description="Post a new product or service on the marketplace."
                icon="📦"
                onClick={() => navigate("/seller/listings/new")}
              />
              <QuickCard
                title="My listings"
                description="View and manage all your active listings."
                icon="📋"
                onClick={() => navigate("/seller/listings")}
              />
              <QuickCard
                title="Seller analytics"
                description="Track performance and listing quality over time."
                icon="📈"
                onClick={() => navigate("/seller/analytics")}
              />
              <QuickCard
                title="Buyer messages"
                description="Read and reply to buyers who contacted your listings."
                icon="💬"
                onClick={() => navigate("/seller/messages")}
              />
            </>
          )}
          {user.role === "buyer" && (
            <>
              <QuickCard
                title="Current listings"
                description="View all current listings posted by sellers."
                icon="🔍"
                onClick={() => navigate("/buyer/browse")}
              />
              <QuickCard
                title="Saved items"
                description="View the listings you have bookmarked."
                icon="🔖"
                onClick={() => navigate("/buyer/saved")}
              />
              <QuickCard
                title="Contact sellers"
                description="Message verified sellers directly."
                icon="💬"
                onClick={() => navigate("/buyer/contact")}
              />
            </>
          )}
          {user.role === "admin" && (
            <>
              <QuickCard
                title="Manage users"
                description="View and moderate registered accounts."
                icon="👥"
              />
              <QuickCard
                title="Verifications"
                description="Review pending seller verification requests."
                icon="🛡️"
                onClick={() => navigate("/verification")}
              />
              <QuickCard
                title="All listings"
                description="Browse, approve or remove marketplace listings."
                icon="🗂️"
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function QuickCard({ title, description, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-gray-200 bg-white p-5 text-left hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h2 className="text-sm font-semibold text-gray-800 group-hover:text-brand-600 transition-colors">
        {title}
      </h2>
      <p className="mt-1 text-xs text-gray-500">{description}</p>
    </button>
  );
}
