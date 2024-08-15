import { GiphyObject } from "../../../hooks/useSearchGiphys/types";
import useSearchForGifs from "../../../hooks/useSearchGiphys";
import "./GiphysMasonary.css";
import {
    CellMeasurer,
    CellMeasurerCache,
    createMasonryCellPositioner,
    Masonry,
    AutoSizer
} from 'react-virtualized';

import ImageMeasurer from 'react-virtualized-image-measurer';
import { useCallback, useEffect, useId, useMemo, useRef } from "react";
import { data } from "vfile";

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
        // <div className='giphys-masonary'>
        //     {
        //         response && response.data && (
        //             <>
        //                 {/* <h3>Search results for <em>{`${queryString}`}</em></h3>
        //                 {
        //                     response.data.map(giphy => {
        //                         return <Gif {...giphy} key={giphy.id} />
        //                     })
        //                 } */}
        //                 <Masonry items={response.data} render={Gif} columnWidth={GIF_FIXED_SMALL_WIDTH} overscanBy={1} columnGutter={8} />
        //             </>
        //         )
        //     }
        // </div>
        <>
            {
                response && response.data && (
                    <div className="giphys-masonary" >

                        {/* <ImageMeasurer
                            items={response.data}
                            image={giphy => giphy.images.fixed_width.url}
                            defaultHeight={GIF_FIXED_SMALL_HEIGHT}
                            defaultWidth={GIF_FIXED_SMALL_WIDTH}
                            keyMapper={(giphy) => giphy.id}
                        >
                            {({ itemsWithSizes }) => <MasonryComponent itemsWithSizes={itemsWithSizes} />}

                        </ImageMeasurer> */}
                        <MasonryComponent itemsWithSizes={response.data} />
                    </div>
                )
            }
        </>
    )
}

export default GifsGrid;


const cache = new CellMeasurerCache({
    defaultHeight: 250,
    defaultWidth: 200,
    fixedWidth: true,
});

const cellPositioner = createMasonryCellPositioner({
    cellMeasurerCache: cache,
    columnCount: 5,
    columnWidth: GIF_FIXED_SMALL_WIDTH,
    spacer: 10,
})
const MasonryComponent = ({ itemsWithSizes }) => {
    console.log("🚀 ~ MasonryComponent ~ itemsWithSizes:", itemsWithSizes)
    // Default sizes help Masonry decide how many images to batch-measure

    function cellRenderer({ index, key, parent, style }) {
        // const { item, size } = itemsWithSizes[index];
        const item = itemsWithSizes[index];
        const columnWidth = GIF_FIXED_SMALL_WIDTH;
        // const defaultHeight = GIF_FIXED_SMALL_HEIGHT;
        // const height = columnWidth * (size.height / size.width) || defaultHeight;


        return (
            <CellMeasurer cache={cache} index={index} parent={parent} key={item.id}>
                <div style={style}>
                    <img
                        src={item.images.fixed_width.url}
                        alt={item.alt_text}
                        style={{
                            height: item.images.fixed_width.height,
                            width: item.images.fixed_width.width,
                        }}
                    />
                    {/* <h4>{item.title}</h4> */}
                </div>
            </CellMeasurer>
        );
    }



    // console.log("🚀 ~ MasonryComponent ~ cellPositioner:", cellPositioner)
    return (
        <AutoSizer>
            {({ height, width }) => (
                <Masonry
                    cellCount={itemsWithSizes.length}
                    cellMeasurerCache={cache}
                    cellPositioner={cellPositioner}
                    // cellPositioner={createMasonryCellPositioner({
                    //     cellMeasurerCache: cache,
                    //     columnCount: Math.floor(width / GIF_FIXED_SMALL_WIDTH),
                    //     columnWidth: GIF_FIXED_SMALL_WIDTH,
                    //     spacer: 10,
                    // })}
                    cellRenderer={cellRenderer}
                    height={height}
                    width={width}

                />
            )}
        </AutoSizer>
    )
}

type GiphyData = Partial<Pick<GiphyObject, 'id' | 'url' | 'images' | 'bitly_gif_url' | 'bitly_url' | 'alt_text' | 'title'>>;

interface GiphyProps {
    index: number;
    data: GiphyData;
    width: number;
}
// eslint-disable-next-line
const Gif = ({ index, width, data: { id, url, images, bitly_gif_url, bitly_url, title, alt_text: altText } }: GiphyProps) => {
    return (
        <div className="giphy" key={`${index}-${id}`}>
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