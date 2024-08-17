export interface GiphySearchResponse {
    data: Partial<GiphyObject>[]
    meta: Partial<Meta>
    pagination: Partial<Pagination>
}

export interface GiphyObject {
    type: string
    id: string
    url: string
    // slug: string
    bitly_gif_url: string
    bitly_url: string
    // embed_url: string
    // username: string
    // source: string
    title: string
    rating: string
    // content_url: string
    // source_tld: string
    // source_post_url: string
    // is_sticker: number
    // import_datetime: string
    // trending_datetime: string
    images: Images
    // user?: User
    // analytics_response_payload: string
    // analytics: Analytics
    alt_text: string
    // cta?: Cta
}

interface Images {
    // original: Original
    // downsized: Downsized
    // downsized_large: DownsizedLarge
    // downsized_medium: DownsizedMedium
    // downsized_small: DownsizedSmall
    // downsized_still: DownsizedStill
    // fixed_height: FixedHeight
    // fixed_height_downsampled: FixedHeightDownsampled
    // fixed_height_small: FixedHeightSmall
    // fixed_height_small_still: FixedHeightSmallStill
    // fixed_height_still: FixedHeightStill
    fixed_width: FixedWidth
    // fixed_width_downsampled: FixedWidthDownsampled
    // fixed_width_small: FixedWidthSmall
    // fixed_width_small_still: FixedWidthSmallStill
    // fixed_width_still: FixedWidthStill
    // looping: Looping
    // original_still: OriginalStill
    // original_mp4: OriginalMp4
    // preview: Preview
    // preview_gif: PreviewGif
    // preview_webp: PreviewWebp
    // hd?: Hd
    // "480w_still": N480wStill
    // "4k"?: N4k
}

interface Meta {
    status: number
    msg: string
    response_id: string
}

export interface Pagination {
    total_count: number
    count: number
    offset: number
}

interface FixedWidth {
    height: string
    width: string
    size: string
    url: string
    mp4_size: string
    mp4: string
    webp_size: string
    webp: string
}