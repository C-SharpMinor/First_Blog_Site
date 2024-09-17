import React from "react";
import { useSelector } from "react-redux";

const ThemeProvider = ({ children }) => {
	const { theme } = useSelector((state) => state.theme);
	return (
		<div className={theme}>
			<div
				className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16, 23, 42)] 
        min-h-screen"
			>
				{children}
			</div>
		</div>
	);
}; //className of div set to {theme}and not light or dark cuz it depends on the theme state
//the function of the style min-h-screen is so that when the content of the page is not enought to fill the screen, there is still no white space signifying empty content, and the style reaches there

export default ThemeProvider;
