import React from "react";
import { Button } from "flowbite-react";

const CallToAction = () => {
	return (
		<div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
			<div className="flex-1 justify-center flex flex-col">
				<h2 className="text-2xl">
					Want to learn more about Alexander Hamilton?
				</h2>
				<p className="text-gray-500">Check out the play!</p>
				<Button
					gradientDuoTone="purpleToPink"
					className="rounded-tl-xl rounded-bl-none"
				>
					<a
						href="https://youtu.be/yspbNBIWsF0?si=7K-QWn1iVe5pMJQr"
						target="_blank"
						rel="noopener noreferrer"
					>
						The YouTube animated
					</a>
				</Button>
			</div>
			<div className="p-7 w-[500px] lg:w-1/2 object-cover">
				<img src="https://i.pinimg.com/736x/c6/98/81/c69881f0b6e9ada087a24d470977da2e.jpg" />
			</div>
		</div>
	);
};

export default CallToAction;
