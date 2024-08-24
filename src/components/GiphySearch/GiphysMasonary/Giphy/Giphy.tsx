import React from "react";
import { GiphyObject } from "../../../../hooks/useSearchGiphys/types";

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

const Giphy = React.forwardRef(function Giphy(
  {
    id,
    url,
    images,
    // eslint-disable-next-line
    bitly_gif_url,
    // eslint-disable-next-line
    bitly_url,
    title,
    alt_text: altText,
    index,
  }: GiphyData & { index: number },
  ref: (instance: Element) => void,
) {
  console.log("🚀 ~ index:", index);
  console.log("🚀 ~ ref:", ref);
  return (
    <div
      className="giphy"
      key={id}
      style={{
        height: Number(images.fixed_width.height),
        width: Number(images.fixed_width.width),
        backgroundColor: "rebeccapurple",
      }}
      ref={ref}
    >
      <a href={url}>
        <img src={images.fixed_width.url} alt={altText} loading="lazy" />
      </a>
    </div>
  );
});

export default Giphy;
