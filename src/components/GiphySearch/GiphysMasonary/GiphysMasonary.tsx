import { GiphyObject } from "../../../hooks/useSearchGiphys/types";
import useSearchForGifs from "../../../hooks/useSearchGiphys";
import "./GiphysMasonary.css";
import {
    CellMeasurer,
    CellMeasurerCache,
    createMasonryCellPositioner,
    Masonry,
    MasonryProps,
} from 'react-virtualized';

import { useCallback, useEffect, useRef, useState } from "react";

interface GiphysMasonryProps {
    queryString: string,
    shouldSearch: boolean,
    resetShouldSearch: () => void;
}

const GIF_FIXED_SMALL_WIDTH = 200;

const GiphysMasonry = ({ queryString, shouldSearch, resetShouldSearch }: GiphysMasonryProps) => {

    const [containerDimensions, setContainerDimensions] = useState<{ width: number, height: number }>({ width: 0, height: 0 });
    const masonaryContainerRef = useRef<HTMLDivElement>(null);
    const { response, loading, error } = useSearchForGifs({ queryString, shouldSearch, resetShouldSearch });


    useEffect(() => {
        if (!masonaryContainerRef.current) return;
        const updateContainerDimensions = () => {
            if (containerDimensions.height === masonaryContainerRef.current.offsetHeight || containerDimensions.width === masonaryContainerRef.current.offsetWidth) return;
            setContainerDimensions({
                height: masonaryContainerRef.current.offsetHeight,
                width: masonaryContainerRef.current.offsetWidth,
            })
        }
        updateContainerDimensions();
    }, [containerDimensions])

    if (error) return <>{`error: ${error.message}`}</>
    if (loading) return <>loading...</>

    return (
        <div className="giphys-masonary-container" ref={masonaryContainerRef}>
            {
                response && response.data && (
                    <MasonryComponent giphyArray={response.data} containerDimensions={containerDimensions} />
                )
            }
        </div>
    )
}

export default GiphysMasonry;


const cache = new CellMeasurerCache({
    defaultHeight: 100,
    defaultWidth: 200,
    fixedWidth: true,
});

const MasonryComponent = ({ giphyArray, containerDimensions }: {
    giphyArray: Partial<GiphyObject>[],
    containerDimensions: {
        width: number;
        height: number;
    }
}) => {
    const masonaryRef = useRef(null);

    const cellRenderer: MasonryProps['cellRenderer'] = useCallback(function ({ index, parent, style }) {
        const item = giphyArray[index];

        return (
            <CellMeasurer cache={cache} index={index} parent={parent} key={item.id}>
                <div style={style} className="giphy-wrapper">
                    {Giphy(item)}
                </div>
            </CellMeasurer>
        );
    }, [])

    const columnCount = Math.floor(containerDimensions.width / GIF_FIXED_SMALL_WIDTH) - 1;
    const spacer = 10;
    const cellPositionerDefault = {
        cellMeasurerCache: cache,
        columnCount,
        columnWidth: GIF_FIXED_SMALL_WIDTH,
        spacer,
    };
    const cellPositioner = createMasonryCellPositioner(cellPositionerDefault)

    useEffect(function reComputeLayout() {
        cache.clearAll();
        cellPositioner.reset(cellPositionerDefault)
        masonaryRef.current?.clearCellPositions();
    }, [giphyArray])

    useEffect(() => {
        const masonaryElement = document.querySelector('.giphys-masonry');
        if (masonaryElement) {
            const masonaryDiv = masonaryElement as HTMLDivElement;
            const scrollbarWidth = masonaryDiv.offsetWidth - masonaryDiv.clientWidth;
            masonaryDiv.style.width = `calc(${masonaryDiv.style.width} + ${scrollbarWidth}px)`;
        }
    }, [])

    return (
        <Masonry
            cellCount={giphyArray.length}
            cellMeasurerCache={cache}
            cellPositioner={cellPositioner}
            cellRenderer={cellRenderer}
            height={containerDimensions.height}
            width={columnCount * GIF_FIXED_SMALL_WIDTH + ((columnCount - 1) * spacer)}
            ref={masonaryRef}
            className='giphys-masonry'
            autoHeight={false}
        />
    )
}

type GiphyProps = Partial<Pick<GiphyObject, 'id' | 'url' | 'images' | 'bitly_gif_url' | 'bitly_url' | 'alt_text' | 'title'>>;


function Giphy(item: GiphyProps) {
    return <a href={item.url}>
        <img
            src={item.images.fixed_width.url}
            alt={item.alt_text}
            style={{
                height: Number(item.images.fixed_width.height),
                width: Number(item.images.fixed_width.width),
            }}
            loading="lazy"
        />
    </a>;
}
