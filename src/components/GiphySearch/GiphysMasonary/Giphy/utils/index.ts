import { GiphyObject } from "../../../../../hooks/useSearchGiphys/types";

type GiphyImageObject = GiphyObject["images"];

export const getGiphyImgAttributes = ({
  imgData,
}: {
  imgData:
    | GiphyImageObject["fixed_width"]
    | GiphyImageObject["fixed_width_downsampled"]
    | GiphyImageObject["fixed_width_still"];
}) => {
  return hasWebpData(imgData)
    ? { scrSet: `${imgData.webp}, ${imgData.url}`, src: imgData.webp }
    : { srcset: "", src: imgData.url };
};

export function getImageForConnectionType({
  connectionType,
  images,
}: {
  connectionType: string;
  images: GiphyImageObject;
}) {
  let imgData:
    | GiphyImageObject["fixed_width"]
    | GiphyImageObject["fixed_width_downsampled"]
    | GiphyImageObject["fixed_width_still"];

  switch (connectionType) {
    case "slow-2g":
    case "2g":
      imgData = images.fixed_width_still;
      break;
    case "3g":
    case "4g":
      imgData = images.fixed_width;
      break;
    case "unknown":
    default:
      imgData = images.fixed_width;
      break;
  }
  return imgData;
}

function hasWebpData(
  imgData:
    | GiphyImageObject["fixed_width"]
    | GiphyImageObject["fixed_width_downsampled"]
    | GiphyImageObject["fixed_width_still"],
): imgData is
  | GiphyImageObject["fixed_width_downsampled"]
  | GiphyImageObject["fixed_width"] {
  if (Object.hasOwn(imgData, "webp")) {
    return true;
  } else {
    return false;
  }
}
