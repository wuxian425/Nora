/* eslint-disable no-shadow */
// Generated by https://quicktype.io

export enum Explicitness {
  Cleaned = 'cleaned',
  Explicit = 'explicit',
  NotExplicit = 'notExplicit'
}

export enum ContentAdvisoryRating {
  Clean = 'Clean',
  Explicit = 'Explicit'
}

export enum Country {
  Usa = 'USA'
}

export enum Currency {
  Usd = 'USD'
}

export enum Kind {
  Podcast = 'podcast',
  Song = 'song'
}

export enum WrapperType {
  Track = 'track'
}

export interface Result {
  wrapperType: WrapperType;
  kind: Kind;
  artistId?: number;
  collectionId: number;
  trackId: number;
  artistName: string;
  collectionName: string;
  trackName: string;
  collectionCensoredName: string;
  trackCensoredName: string;
  artistViewUrl?: string;
  collectionViewUrl: string;
  trackViewUrl: string;
  previewUrl?: string;
  artworkUrl30: string;
  artworkUrl60: string;
  artworkUrl100: string;
  collectionPrice: number;
  trackPrice: number;
  releaseDate: string;
  collectionExplicitness: Explicitness;
  trackExplicitness: Explicitness;
  discCount?: number;
  discNumber?: number;
  trackCount: number;
  trackNumber?: number;
  trackTimeMillis: number;
  country: Country;
  currency: Currency;
  primaryGenreName: string;
  contentAdvisoryRating?: ContentAdvisoryRating;
  isStreamable?: boolean;
  collectionArtistName?: string;
  feedUrl?: string;
  collectionHdPrice?: number;
  genreIds?: string[];
  genres?: string[];
}

export interface AppleITunesMusicAPI {
  errorMessage?: string;
  resultCount?: number;
  results?: Result[];
}
