import { useReducer, useRef, useState } from "react";
import Failed from "./Failed";
import Idling from "./Idling";
import Pending from "./Pending";
import Success from "./Success";

enum Status {
	IDLING = "Idling",
	PENDING = "Pending",
	SUCCESS = "Success",
	FAILED = "Failed",
}

interface IStateSearch {
	keydown: boolean;
	dropdown: boolean;
	searchStatus: Status;
	foundPokemon: null;
}

const iSearch: IStateSearch = {
	keydown: true,
	dropdown: false,
	searchStatus: Status.IDLING,
	foundPokemon: null,
};
const reducer = (
	state: IStateSearch,
	action: {
		type: string;
		payload?: any;
	}
) => {
	switch (action.type) {
		case "setKeydown":
			return {
				...state,
				keydown: action.payload,
			};
		case "setDropdown":
			return {
				...state,
				dropdown: action.payload,
			};
		case "setSearchStatus":
			return {
				...state,
				searchStatus: action.payload,
			};
		case "setPokemon":
			return {
				...state,
				foundPokemon: action.payload,
				searchStatus: Status.SUCCESS,
			};

		default:
			return state;
	}
};
export default function PokeSearch() {
	const [state, dispatch] = useReducer(reducer, iSearch);

	const pending = state.searchStatus === Status.PENDING;
	const success = state.searchStatus === Status.SUCCESS;
	const idling = state.searchStatus === Status.IDLING;
	const failed = state.searchStatus === Status.FAILED;

	return (
		<div className="container">
			<div className="grid grid-cols-1 md:grid-cols-3  p-10 gap-5">
				<input
					disabled={state.dropdown}
					className="rounded-lg md:col-span-2 h-10 px-5 border-blue-500 border-2"
					type="text"
					placeholder="Enter Pokemon"
					onKeyUp={(e) => {
						state.keydown
							? keyDownSearch(e)
									.then((results) => {
										dispatch({ type: "setPokemon", payload: results });
									})
									.catch((err) =>
										dispatch({
											type: "setSearchStatus",
											payload: Status.FAILED,
										})
									)
							: enterSearch(e)
									.then((results) => {
										dispatch({ type: "setPokemon", payload: results });
									})
									.catch((err) => {
										if (err.Error == "No Enter Pressed") {
											dispatch({
												type: "setSearchStatus",
												payload: Status.IDLING,
											});
										} else {
											dispatch({
												type: "setSearchStatus",
												payload: Status.FAILED,
											});
										}
									});
					}}
				/>
				<div>
					<button
						className="text-white bg-blue-500 hover:bg-blue-800 rounded-md w-full h-10 "
						onClick={() =>
							dispatch({ type: "setDropdown", payload: !state.dropdown })
						}
					>
						{state.keydown ? "Keydown Search" : "Press Enter Search"}
						<span className="icon">
							<i
								className={
									state.dropdown
										? "fa-solid fa-caret-up float-right mr-8"
										: "fa-solid fa-caret-down float-right mr-8"
								}
							></i>
						</span>
					</button>
					<br />
					<div
						className={
							state.dropdown
								? " bg-gray-700 rounded-md text-white text-center p-5 mt-3"
								: "hidden"
						}
					>
						<ul>
							<li
								className=" hover:bg-gray-400 cursor-pointer h-full rounded-sm"
								onClick={() => {
									dispatch({ type: "setKeydown", payload: true });
									dispatch({ type: "setDropdown", payload: false });
								}}
							>
								KeyDown Search
							</li>
							<li
								className=" hover:bg-gray-400 cursor-pointer h-full rounded-sm"
								onClick={() => {
									dispatch({ type: "setKeydown", payload: false });
									dispatch({ type: "setDropdown", payload: false });
								}}
							>
								Press enter search
							</li>
						</ul>
					</div>
				</div>
			</div>
			{pending && <Pending />}
			{success && <Success pokemon={state.foundPokemon} />}
			{failed && <Failed />}
			{idling && <Idling />}
		</div>
	);
}

const keyDownSearch = async (e: any) => {
	if (!e.target.value) throw new Error("No Poke To search"); //because api without pokemon doesn't throw an exception, although technically not having a pokemon to search implies no poke

	return await fetch(
		`https://pokeapi.co/api/v2/pokemon/${e.target.value.toLowerCase()}`
	)
		.then((res) => res.json())
		.then((res) => {
			return res;
		})
		.catch((err) => {
			throw err;
		});
};

const enterSearch = async (e: any) => {
	if (!e.target.value) throw new Error("No Poke To search"); //because api without pokemon doesn't throw an exception, although technically not having a pokemon to search implies no poke

	if (e.key === "Enter") {
		return await fetch(
			`https://pokeapi.co/api/v2/pokemon/${e.target.value.toLowerCase()}`
		)
			.then((res) => res.json())
			.then((res) => {
				return res;
			})
			.catch(() => {
				throw new Error("Poke Not Found");
			});
	} else {
		throw new Error("No Enter Pressed");
	}
};
