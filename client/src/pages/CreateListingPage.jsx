import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createListing } from "../api/listings";
import { useAuth } from "../context/AuthContext";

export default function CreateListingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    category: "",
    price: "",
    region: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function onChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  }

  async function onSubmit(event) {
    event.preventDefault();

    if (!form.title.trim() || !form.category.trim() || !form.region.trim()) {
      setError("Title, category, and region are required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await createListing(
        {
          title: form.title.trim(),
          category: form.category.trim(),
          price: Number(form.price || 0),
          region: form.region.trim(),
          description: form.description.trim(),
        },
        user.token,
      );

      setSuccess("Listing created successfully");
      setForm({
        title: "",
        category: "",
        price: "",
        region: "",
        description: "",
      });

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 500);
    } catch (err) {
      setError(err.message || "Could not create listing");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Create Listing</h1>
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Seller Dashboard
            </Link>
            <Link
              to="/seller/listings"
              className="text-sm font-medium text-brand-600 hover:text-brand-500"
            >
              My Listings
            </Link>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl bg-white p-6 shadow-sm"
        >
          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              {success}
            </p>
          ) : null}

          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="title"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={onChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="Coffee beans wholesale"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="category"
              >
                Category
              </label>
              <input
                id="category"
                name="category"
                value={form.category}
                onChange={onChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Agriculture"
              />
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="region"
              >
                Region
              </label>
              <input
                id="region"
                name="region"
                value={form.region}
                onChange={onChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Addis Ababa"
              />
            </div>
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="price"
            >
              Price
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={onChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="2500"
            />
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={form.description}
              onChange={onChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="Add details about your product or service"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}
