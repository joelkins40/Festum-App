export interface Welcome {
    type:     string;
    features: Feature[];
    query:    Query;
}

export interface Feature {
    type:       string;
    properties: Properties;
    geometry:   Geometry;
    bbox:       number[];
}

export interface Geometry {
    type:        string;
    coordinates: number[];
}

export interface Properties {
    datasource:         Datasource;
    other_names?:       { [key: string]: string };
    country:            string;
    country_code:       string;
    region?:            string;
    state:              string;
    city:               string;
    iso3166_2:          string;
    lon:                number;
    lat:                number;
    result_type:        string;
    formatted:          string;
    address_line1:      string;
    address_line2:      string;
    category?:          string;
    timezone:           Timezone;
    plus_code:          string;
    plus_code_short?:   string;
    rank:               Rank;
    place_id:           string;
    county?:            string;
    state_code?:        string;
    suburb?:            string;
    hamlet?:            string;
    isolated_dwelling?: string;
    name?:              string;
    district?:          string;
    town?:              string;
}

export interface Datasource {
    sourcename:  string;
    attribution: string;
    license:     string;
    url:         string;
}

export interface Rank {
    importance:            number;
    confidence:            number;
    confidence_city_level: number;
    match_type:            string;
}

export interface Timezone {
    name:               string;
    offset_STD:         string;
    offset_STD_seconds: number;
    offset_DST:         string;
    offset_DST_seconds: number;
    abbreviation_STD:   string;
    abbreviation_DST:   string;
}

export interface Query {
    text:       string;
    parsed:     Parsed;
    categories: unknown[];
}

export interface Parsed {
    city:          string;
    expected_type: string;
}
