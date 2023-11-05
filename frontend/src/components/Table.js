const Table = ({items, handleSelectItem, mode}) => {
    return (
        <div className="px-1">
            <div className="mt-2 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto -mx-1">
                    <div className="inline-block min-w-full py-1 align-middle px-1">
                        <table className="min-w-full divide-y divide-gray-300 table-fixed">
                            <thead>
                            <tr>
                                <th scope="col"
                                    className="w-2/6 text-left px-3 py-3.5 text-sm font-semibold text-gray-900">
                                    駅名
                                </th>
                                <th scope="col"
                                    className="w-3/6 text-left px-3 py-3.5 text-sm font-semibold text-gray-900">
                                    道の駅名
                                </th>
                                <th scope="col"
                                    className="w-1/6 text-left px-3 py-3.5 text-sm font-semibold text-gray-900">
                                    距離(km)
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white">
                            {items.map((item, index) => (
                                <tr key={index}
                                    onClick={() => handleSelectItem(item)}
                                    className="even:bg-gray-50">
                                    <td className="whitespace-wrap px-2 py-3 text-sm text-gray-900 text-left">
                                        <a href={`https://www.google.co.jp/maps/dir/${item.rail_station.lat},${item.rail_station.lon}/${item.road_station.lat},${item.road_station.lon}`}
                                           target="_blank" rel="noopener noreferrer">
                                            {item.rail_station.name}
                                        </a>
                                    </td>
                                    <td className="whitespace-wrap px-2 py-3 text-sm text-gray-900 text-left">
                                        {item.road_station.name}
                                    </td>
                                    <td className="whitespace-wrap px-2 py-3 text-sm text-gray-900 text-left">{item.distance}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Table;
