"use client";

import ImageGallery from "react-image-gallery";
import "./index.scss";
import { images as img } from "@/utlls/variables";

export default function index({ images = img }) {
  return <ImageGallery items={images} />;
}
