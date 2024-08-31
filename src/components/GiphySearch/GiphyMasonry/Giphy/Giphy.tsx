import React from "react";
import { GiphyObject } from "../../../../hooks/useSearchGiphys/types";
import { getGiphyImgAttributes, getImageForConnectionType } from "./utils";
import "./Giphy.css";
import useHover from "../../../../hooks/useHover";

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
  alt_text: altText,
  callbackRef,
  connectionType,
}: GiphyProps) => {
  const [isHovering, elementRef] = useHover();

  if (!images) return null;

  const imgData = getImageForConnectionType({ connectionType, images });
  const { src, srcSet } = getGiphyImgAttributes({ imgData });

  const handleCopy: React.MouseEventHandler<HTMLDivElement> = async (e) => {
    e.stopPropagation();

    /* istanbul ignore next */
    if (!url) return;
    await navigator.clipboard.writeText(url);
    const copiedStuff = await navigator.clipboard.readText();
    alert(`copied :: ${copiedStuff}`);
  };
  return (
    <div ref={elementRef} data-testid="giphy_container">
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
        {isHovering && (
          <div
            onClick={handleCopy}
            className="copy-link"
            data-testid="copy_link"
          >
            <img
              loading="lazy"
              src={`${process.env.PUBLIC_URL}/icons/copy-link-outlined-24.png`}
              width={24}
              height={24}
              title="copy giphy url"
              alt="copy giphy url icon"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Giphy;
