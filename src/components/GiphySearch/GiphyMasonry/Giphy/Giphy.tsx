import React from "react";
import { GiphyObject } from "../../../../hooks/useSearchGiphys/types";
import { getGiphyImgAttributes, getImageForConnectionType } from "./utils";
import "./Giphy.css";

type GiphyData = Partial<
  Pick<
    GiphyObject,
    | "id"
    | "url"
    | "images"
    | "bitly_gif_url"
    | "bitly_url"
    | "alt_text"
    | "title"
  >
>;

interface GiphyProps extends GiphyData {
  callbackRef?: React.RefCallback<HTMLDivElement> | null;
  connectionType: NetworkInformation["effectiveType"];
}

const Giphy = ({
  id,
  url,
  images,
  // eslint-disable-next-line
  bitly_gif_url,
  // eslint-disable-next-line
  bitly_url,
  title,
  alt_text: altText,
  callbackRef,
  connectionType,
}: GiphyProps) => {
  if (!images) return null;
  const imgData = getImageForConnectionType({ connectionType, images });
  const { src, srcSet } = getGiphyImgAttributes({ imgData });
  return (
    <div
      className="giphy"
      key={id}
      style={{
        height: Number(imgData.height),
        width: Number(imgData.width),
        backgroundColor: "rebeccapurple",
      }}
      ref={callbackRef}
    >
      <a href={url}>
        <img
          srcSet={srcSet}
          src={src}
          alt={altText}
          loading="lazy"
          height={Number(imgData.height)}
          width={Number(imgData.width)}
        />
      </a>
    </div>
  );
};

export default Giphy;
