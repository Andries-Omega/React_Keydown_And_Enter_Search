import { useState } from "react";

export default function Success(props: any) {
	const pokemon = props.pokemon;
	console.log("Found Poke", props.pokemon.abilities[0].name);
	return (
		<>
			<div className="grid justify-center pt-16">
				<img src={pokemon?.sprites?.front_default} className=" w-64  h-96" />
				<h1 className=" text-gray-800 text-3xl text-center font-mono">
					{pokemon?.name}.
				</h1>
				{pokemon.abilities && (
					<h3 className=" text-xl font-mono text-center">Abilities:</h3>
				)}
				<ol className=" text-center pt-5">
					{pokemon?.abilities.map((ability: any) => (
						<li>
							<a className=" hover:text-blue-500" href={ability?.ability?.url}>
								{ability?.ability?.name}
							</a>
						</li>
					))}
				</ol>
			</div>
		</>
	);
}
