export interface Search {
    Search: SearchResult[]
    totalResults: string
    Response: 'True' | 'False'
}

export interface SearchResult {
    Title: string
    Year: string
    imdbID: string
    Type: string
    Poster: string
}
