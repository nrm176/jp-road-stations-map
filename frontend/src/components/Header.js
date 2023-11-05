import { Link } from 'react-router-dom';

const navigation = [
    {name: 'Home', href: '/'},
    {name: '検索', href: '/search'}
]

export default function Header() {

    return (
        <header className="bg-white">
            <nav className="flex items-center justify-between p-6 px-8" aria-label="Global">
                <div className="flex flex-1">
                    <h1 className="-m-1.5 p-1.5">駅チカ道の駅　〜駅から歩いて行ける道の駅〜</h1>
                </div>
                <div className="flex gap-x-12">
                    {navigation.map((item) => (
                        <Link key={item.name} to={item.href} className="text-sm font-semibold leading-6 text-gray-900">
                            {item.name}
                        </Link>
                    ))}
                </div>
            </nav>
        </header>
    )
};