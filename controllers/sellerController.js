import {
  getListingsBySeller,
  getSellerStats,
} from "../services/sellerService.js";

export const getMyListings = async (req, res) => {
  const listings = await getListingsBySeller(req.user.id);
  res.json(listings);
};

export const getMyStats = async (req, res) => {
  const stats = await getSellerStats(req.user.id);
  res.json(stats);
};
