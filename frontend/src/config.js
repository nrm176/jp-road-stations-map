const baseUrl = process.env.REACT_APP_API_URL
const tileUrlMap =
    {
        OpenStreetMap: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`,
        ArcGIS: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}`
    }

export {baseUrl};
export {tileUrlMap};