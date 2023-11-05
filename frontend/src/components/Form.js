const Form = ({
                  maxDistance, setMaxDistance,
                  selectedPref, handleSelectPref,
                  prefectures
              }) => {
    return (
        <div className="mx-auto px-1 mt-0">

            <div className="flex">
                <form className="w-full">
                    <div className="flex flex-wrap mb-3">
                        <div className="flex flex-col w-full w-1/2 px-1 mb-3 mb-0 items-start">
                            <label
                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                htmlFor="grid-max-distance">
                                最寄り駅からの直線距離(km):
                            </label>
                            <input
                                type="number"
                                value={maxDistance}
                                step={0.1}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                onChange={setMaxDistance}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap mb-3">
                        <div className="flex flex-col w-full w-1/2 px-1 mb-3 mb-0 items-start">
                            <label htmlFor="prefecture"
                                   className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            >都道府県:</label>
                            <select id="prefecture" name="prefecture"
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    onChange={handleSelectPref}
                                    value={selectedPref}
                            >
                                <option key={"0"} value="0" defaultValue>全国</option>
                                {prefectures.map((prefecture) => (
                                    <option key={prefecture.code} value={prefecture.code}>{prefecture.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Form