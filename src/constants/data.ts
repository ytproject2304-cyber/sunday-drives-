import { Drive, Route } from '../types';

export const BANNED_LOCATIONS = [
    "Barnetts Lookout", "Berowra Waters Café", "Hawkesbury Lookout", "North Rocks Dam",
    "Wentworth Falls Lookout", "Leura Village", "Govetts Leap Lookout", "Blackheath Café",
    "Wisemans Ferry Lookout", "St Albans Village", "Webbs Creek Road", "Spencer Waterfront"
];

export const UPCOMING_DRIVES: Drive[] = [
    {
        date: "31 May 2026",
        title: "Misty Hawkesbury Dawn",
        distance: "145km",
        duration: "4.5h",
        stops: ["Wisemans Ferry Lookout", "St Albans Village", "Webbs Creek Road", "Spencer Waterfront"],
        coords: [
            { name: "Parramatta CBD (Start)", lat: -33.815, lng: 151.0011 },
            { name: "Wisemans Ferry Lookout", lat: -33.3828, lng: 150.985 },
            { name: "St Albans Village", lat: -33.2842, lng: 150.9658 },
            { name: "Webbs Creek Road", lat: -33.385, lng: 150.98 },
            { name: "Spencer Waterfront", lat: -33.4542, lng: 151.15 }
        ],
        desc: "An atmospheric escape hugging the riverbanks. Early morning mist off the Hawkesbury makes for unforgettable, tranquil visuals.",
        cafe: "Settlers Arms Inn / St Albans local bakery"
    },
    {
        date: "7 Jun 2026",
        title: "Blue Mountains Golden Hour",
        distance: "165km",
        duration: "5h",
        stops: ["Wentworth Falls Lookout", "Leura Village", "Govetts Leap Lookout", "Blackheath Café"],
        coords: [
            { name: "Parramatta CBD (Start)", lat: -33.815, lng: 151.0011 },
            { name: "Wentworth Falls Lookout", lat: -33.7258, lng: 150.3753 },
            { name: "Leura Village", lat: -33.7089, lng: 150.3344 },
            { name: "Govetts Leap Lookout", lat: -33.6289, lng: 150.3117 },
            { name: "Blackheath Café", lat: -33.6333, lng: 150.2833 }
        ],
        desc: "Slightly higher rev fluctuations suited for break-in, tracking up the Great Western Highway to dramatic cliff edges.",
        cafe: "Blackheath General Store / Local Artisans"
    },
    {
        date: "14 Jun 2026",
        title: "Serene Hawkesbury Dawn",
        distance: "150km",
        duration: "4.5h",
        stops: ["Barnetts Lookout", "Berowra Waters Café", "Hawkesbury Lookout", "North Rocks Dam"],
        coords: [
            { name: "Parramatta CBD (Start)", lat: -33.815, lng: 151.0011 },
            { name: "Barnetts Lookout", lat: -33.6061, lng: 151.1219 },
            { name: "Berowra Waters Café", lat: -33.6014, lng: 151.1264 },
            { name: "Hawkesbury Lookout", lat: -33.6167, lng: 150.65 },
            { name: "North Rocks Dam", lat: -33.7686, lng: 151.0189 }
        ],
        desc: "Quiet pockets and river ferries. The ideal low-stress drive with plenty of throttle-variation opportunities without high strain.",
        cafe: "Berowra Waters Marina Café"
    }
];

export const PRE_GENERATED_ROUTES: Route[] = [
    {
        region: "Southern Highlands",
        title: "Southern Escarpment & Patisseries",
        distance: "210 km (Round Trip)",
        duration: "5.5 hours",
        stops: ["Picton Historic Township", "Bowral Village", "Fitzroy Falls Lookout", "Mount Keira Summit"],
        coords: [
            { name: "Parramatta CBD (Start)", lat: -33.815, lng: 151.0011 },
            { name: "Picton Historic Township", lat: -34.1808, lng: 150.6925 },
            { name: "Bowral (Gumnut Patisserie)", lat: -34.4791, lng: 150.4183 },
            { name: "Fitzroy Falls Lookout", lat: -34.6433, lng: 150.4808 },
            { name: "Mount Keira Summit", lat: -34.4039, lng: 150.8494 }
        ],
        desc: "Roll down the old Remembrance Driveway through scenic Picton, up to Bowral for world-class pastries, over to Fitzroy Falls, and descend back via Mount Keira.",
        cafe: "Gumnut Patisserie, Bowral",
        parking: "Picton: Main street side bays. Bowral: Large rear public car park off Station St. Fitzroy Falls: Dedicated National Parks car park.",
        directions: "Depart Parramatta CBD south to Hume Hwy (M31) -> Exit toward Picton Road -> Remembrance Driveway -> Argyle St Picton -> Continue to Bowral via Old Hume Hwy -> B73 to Fitzroy Falls -> Return via Illawarra Hwy (M1) and Mount Keira Rd."
    },
    {
        region: "Central Coast",
        title: "Ocean Breeze & Coastal Parks",
        distance: "190 km (Round Trip)",
        duration: "5.0 hours",
        stops: ["Mt Penang Gardens", "Ettalong Beachfront", "Bouddi National Park Lookout", "Marie Byles Lookout"],
        coords: [
            { name: "Parramatta CBD (Start)", lat: -33.815, lng: 151.0011 },
            { name: "Mt Penang Gardens", lat: -33.4244, lng: 151.3106 },
            { name: "Ettalong Beach (Coast 175 Café)", lat: -33.5133, lng: 151.3414 },
            { name: "Marie Byles Lookout", lat: -33.5283, lng: 151.3650 },
            { name: "Bouddi National Park", lat: -33.5161, lng: 151.4172 }
        ],
        desc: "A stunning seaside cruise using the M1 temporarily, then winding around coastal peninsulas. Low stress, gorgeous ocean glimpses, and cool breezes.",
        cafe: "Coast 175 Cafe, Ettalong Beach",
        parking: "Mt Penang: Vast open-air car park. Ettalong: Absolute beachside parking bays. Marie Byles: Dedicated gravel bay.",
        directions: "M2 Motorway from Parramatta -> M1 Northbound -> Exit at Kariong -> Central Coast Hwy -> Mt Penang -> Woy Woy Rd to Ettalong Beach -> Scenic Rd to Marie Byles Lookout."
    },
    {
        region: "Royal National Park",
        title: "Grand Pacific Coast & Rainforest Cruise",
        distance: "175 km (Round Trip)",
        duration: "4.5 hours",
        stops: ["Audley Weir", "Bald Hill Lookout (Stanwell Tops)", "Thirroul Seaside Café", "Sea Cliff Bridge Viewpoint"],
        coords: [
            { name: "Parramatta CBD (Start)", lat: -33.815, lng: 151.0011 },
            { name: "Audley Weir", lat: -34.0782, lng: 151.0601 },
            { name: "Bald Hill Lookout", lat: -34.2185, lng: 150.9983 },
            { name: "Sea Cliff Bridge Viewpoint", lat: -34.2542, lng: 150.9722 },
            { name: "Thirroul Seaside Cafe", lat: -34.3183, lng: 150.8983 }
        ],
        desc: "An absolute classic. Wind slowly through the lush, shaded canopy of the world's second-oldest National Park, emerging to dramatic ocean cliffs.",
        cafe: "Earth's Elements or Honest Don's in Thirroul",
        parking: "Audley Weir: Multiple flat car parks near the river. Bald Hill: Large, newly paved clifftop parking. Thirroul: Safe street parking off the highway.",
        directions: "A6 south from Parramatta -> Princes Highway -> Turn left into Royal National Park (Sir Bertram Stevens Dr) -> Audley Rd -> Drive south through park -> Exit to Lawrence Hargrave Dr -> Bald Hill Lookout -> Sea Cliff Bridge -> Thirroul."
    }
];
