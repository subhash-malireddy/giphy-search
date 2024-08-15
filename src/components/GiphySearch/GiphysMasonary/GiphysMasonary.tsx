import { GiphyObject } from "../../../hooks/useSearchGiphys/types";
import useSearchForGifs from "../../../hooks/useSearchGiphys";
import "./GiphysMasonary.css";
import { useCallback, useEffect, useMemo, useRef } from "react";
import Masonry from "react-responsive-masonry";

interface GifsGridProps {
    queryString: string,
    shouldSearch: boolean,
    resetShouldSearch: () => void;
}

const GIF_FIXED_SMALL_WIDTH = 200;
// * Just an assumed value
const GIF_FIXED_SMALL_HEIGHT = 100;

const GifsGrid = ({ queryString, shouldSearch, resetShouldSearch }: GifsGridProps) => {

    const { response, loading, error } = useSearchForGifs({ queryString, shouldSearch, resetShouldSearch });
    // const containerRef = useRef<HTMLDivElement>(null);

    if (error) return <>`error: ${error.message}`</>
    if (loading) return <>loading...</>

    if (response) console.log(response);


    return (
        <div className='giphys-masonary'>
            {
                response && response.data && (
                    <>
                        {/* <h3>Search results for <em>{`${queryString}`}</em></h3> */}
                        {
                            response.data.map(giphy => {
                                return <Gif {...giphy} key={giphy.id} />
                            })
                        }

                    </>
                )
            }
        </div>
    )
}

export default GifsGrid;

type GiphyData = Partial<Pick<GiphyObject, 'id' | 'url' | 'images' | 'bitly_gif_url' | 'bitly_url' | 'alt_text' | 'title'>>;

// interface GiphyProps {
//     index: number;
//     data: GiphyData;
//     width: number;
// }
// eslint-disable-next-line
const Gif = ({ id, url, images, bitly_gif_url, bitly_url, title, alt_text: altText }: GiphyData) => {
    return (
        <div className="giphy" key={id}>
            <a href={url}>
                {/* <figure> */}
                {/* // eslint-disable-next-line */}
                <img src={images.fixed_width.url} alt={altText} />
                {/* <figcaption>{title || '-'}</figcaption> */}
                {/* </figure> */}
            </a>
        </div>
    )
}
