import { GiphyObject } from "../../../hooks/useSearchGiphys/types";
import useSearchForGifs from "../../../hooks/useSearchGiphys";
import "./GiphysMasonary.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Masonry from "react-responsive-masonry";

interface GifsGridProps {
    queryString: string,
    shouldSearch: boolean,
    resetShouldSearch: () => void;
}

const GIF_FIXED_SMALL_WIDTH = 200;
// * Just an assumed value
const GIF_FIXED_SMALL_HEIGHT = 100;

const DEFAULT_COLUMN_COUNT = 1;
const GifsGrid = ({ queryString, shouldSearch, resetShouldSearch }: GifsGridProps) => {

    const { response, loading, error } = useSearchForGifs({ queryString, shouldSearch, resetShouldSearch });
    const containerRef = useRef<HTMLDivElement>(null);
    const [shouldComputePadding, setShouldComputePadding] = useState(false);
    
    useEffect(() => {
        
        if(containerRef.current === null) return;

        const containerDiv = containerRef.current;
        const { columnCount, columnGap, columnWidth } = caclulateColumnProperties(containerDiv);

        containerDiv.style.columnCount = `${columnCount}`;
        containerDiv.style.columnWidth = `${columnWidth}px`;
        containerDiv.style.columnGap = `${columnGap}px`;
        
        if(response){
            setShouldComputePadding(true);
        }

    },[response])

    useEffect(() => {

        if(containerRef.current === null || !shouldComputePadding) return;
        
        const containerDiv = containerRef.current;
        const { columnCount, columnGap, columnWidth } = caclulateColumnProperties(containerDiv);
        const  containerPadding = calculateContainerPadding({ columnCount, columnGap, containerDiv });
        containerDiv.style.padding = containerPadding;

        setShouldComputePadding(false)
    })
    
    if (error) return <>`error: ${error.message}`</> 

    return (
        <div ref={containerRef} className='giphys-masonry-container'>
            {
                response && response.data && (
                    <>
                        {/* <h3>Search results for <em>{`${queryString}`}</em></h3> */}
                        {/* <Masonry columnsCount={columns} className="giphys-masonry"> */}

                        {
                            response.data.map(giphy => {
                                return <Gif {...giphy}  key={giphy.id} />
                            })
                        }
                        {/* </Masonry> */}
                    </>
                )
            }
            <>
            {
                loading && <>Loading ...</>
            }
            </>
        </div>
    )
}
export default GifsGrid;

type GiphyData = Partial<Pick<GiphyObject, 'id' | 'url' | 'images' | 'bitly_gif_url' | 'bitly_url' | 'alt_text' | 'title'>>;

// eslint-disable-next-line
const Gif = ({ id, url, images, bitly_gif_url, bitly_url, title, alt_text: altText }: GiphyData) => {
    return (
        <div className="giphy" key={id} style={{height: Number(images.fixed_width.height), width: Number(images.fixed_width.width), backgroundColor: 'rebeccapurple'}}>
            <a href={url}>
                <img src={images.fixed_width.url} alt={altText} loading="lazy" />
            </a>
        </div>
    )
}
function calculateContainerPadding({ columnCount, columnGap, containerDiv }: { columnCount: number; columnGap: number; containerDiv: HTMLDivElement; }) {
    
    if(columnCount === 0) return '0';
    
    const containerWidth = containerDiv.offsetWidth;
    const totalColumnGap = (columnCount - 1) * columnGap;
    const totalColumnsWidth = columnCount * GIF_FIXED_SMALL_WIDTH;
    const totalHorizontalPadding = containerWidth - totalColumnsWidth - totalColumnGap;
    const containerPadding = Math.sign(totalHorizontalPadding) === 1 ? `0 ${totalHorizontalPadding / 2}px` : '0';

    return containerPadding;
}

function caclulateColumnProperties(containerDiv?: HTMLDivElement) {

    if(!containerDiv) return {columnCount: 0, columnGap: 0, columnWidth: GIF_FIXED_SMALL_WIDTH}
    
    const width = containerDiv.offsetWidth;
    const columnsCountDecimal = width / GIF_FIXED_SMALL_WIDTH - 1;
    const columnCount = Math.sign(columnsCountDecimal) === 1 ? Math.floor(columnsCountDecimal) : DEFAULT_COLUMN_COUNT;
    const COLUMN_GAP = 8;
    
    return { columnCount, columnGap: COLUMN_GAP, columnWidth: GIF_FIXED_SMALL_WIDTH };
}

