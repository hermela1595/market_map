import {
  createListing,
  getListings,
  getListingById,
  getCategories,
  getRegions,
  updateListing,
  deleteListing,
} from "../models/Listing.js";

export const createNewListing = async (req, res) => {
  try {
    const listingId = await createListing({
      ...req.body,
      seller_id: req.user.id,
    });
    res.json({ message: "Listing created", id: listingId });
  } catch (error) {
    console.error("Error creating listing:", error);
    res
      .status(500)
      .json({ message: "Failed to create listing", error: error.message });
  }
};

export const fetchListings = async (req, res) => {
  try {
    const listings = await getListings(req.query || {});
    res.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch listings", error: error.message });
  }
};

export const fetchListingById = async (req, res) => {
  try {
    const listing = await getListingById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Not found" });
    res.json(listing);
  } catch (error) {
    console.error("Error fetching listing:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch listing", error: error.message });
  }
};

export const fetchCategories = async (_req, res) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch categories", error: error.message });
  }
};

export const fetchRegions = async (_req, res) => {
  try {
    const regions = await getRegions();
    res.json(regions);
  } catch (error) {
    console.error("Error fetching regions:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch regions", error: error.message });
  }
};

export const editListing = async (req, res) => {
  try {
    await updateListing(req.params.id, req.body);
    res.json({ message: "Listing updated" });
  } catch (error) {
    console.error("Error updating listing:", error);
    res
      .status(500)
      .json({ message: "Failed to update listing", error: error.message });
  }
};

export const removeListing = async (req, res) => {
  try {
    await deleteListing(req.params.id);
    res.json({ message: "Listing deleted" });
  } catch (error) {
    console.error("Error deleting listing:", error);
    res
      .status(500)
      .json({ message: "Failed to delete listing", error: error.message });
  }
};
