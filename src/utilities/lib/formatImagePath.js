import { base_url_image } from "../configs/base_api";

export const formatImagePath = (imagePath) =>
  imagePath ? `${base_url_image}${imagePath.replace(/\\/g, "/")}` : undefined;
