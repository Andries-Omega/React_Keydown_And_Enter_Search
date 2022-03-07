import PokeSearch from "./PokeSearch";

export default function App() {
	return (
		<div className="grid grid-cols-1 place-items-center h-screen pt-11">
			<div className=" w-3/4 h-[850px] rounded-xl bg-white opacity-90 pt-5 shadow-2xl">
				<h1 className=" text-center text-3xl font-mono mb-5">
					Which pokemon you wanna know<span className=" text-blue-700"> ?</span>
				</h1>
				<hr />
				<PokeSearch />
			</div>
		</div>
	);
}
