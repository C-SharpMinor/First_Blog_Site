import { Footer } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaXTwitter, FaGithub } from "react-icons/fa6";

const FooterComp = () => {
	//we had to chnage the component name to footerComp to avoid conflict with the flowbit <footer />
	return (
		<Footer container className="border border-t-8 border-teal-500">
			<div className="w-full max-w-7xl mx-auto">
				<div className="grid w-full justify-between sm:flex md:gris-cols-1">
					<div className="mt-5 ">
						<Link
							to="/"
							className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
						>
							<span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
								Ore's
							</span>
							Blog
						</Link>
					</div>
					<div className=" grid grid-cols-2 gap-8 sm: mt-4 sm:grid-cols-3 sm:gap-6">
						<div>
							{" "}
							{/* this is the first column, we had to put the footer title and linkgroup in another div cuz other wise, it causes them to appear in rows */}
							<Footer.Title title="About" />
							<Footer.LinkGroup col>
								<Footer.Link
									href="https://www.100jsprojects.com/"
									target="_blank"
									rel="noopener noreferrer"
								>
									100 JS projects
								</Footer.Link>
								<Footer.Link
									href="/about"
									target="_blank"
									rel="noopener noreferrer"
								>
									My Blog
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
						<div>
							{" "}
							<Footer.Title title="Follow Us" />
							<Footer.LinkGroup col>
								<Footer.Link
									href="https://github.com/C-SharpMinor"
									target="_blank"
									rel="noopener noreferrer"
								>
									GitHub
								</Footer.Link>
								<Footer.Link
									href="#" // # means the link goes nowhere
									target="_blank"
									rel="noopener noreferrer"
								>
									Discord
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
						<div>
							{" "}
							<Footer.Title title="Legal" />
							<Footer.LinkGroup col>
								<Footer.Link href="#" target="_blank" rel="noopener noreferrer">
									Privacy Policy
								</Footer.Link>
								<Footer.Link
									href="#" // # means the link goes nowhere
									target="_blank"
									rel="noopener noreferrer"
								>
									Terms & Conditions
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
					</div>
				</div>
				<Footer.Divider />
				<div className="w-full sm:flex sm:items-center sm:justify-between">
					<Footer.Copyright
						href="#"
						by="Ore's blog"
						year={new Date().getFullYear()}
					/>
					<div className="flex gap-3 sm:mt-0 mt-4 sm:justify-center">
						<Footer.Icon href="#" icon={FaFacebook} />
						<Footer.Icon href="#" icon={FaInstagram} />
						<Footer.Icon href="#" icon={FaXTwitter} />
						<Footer.Icon href="#" icon={FaGithub} />
					</div>
				</div>
			</div>
		</Footer>
	);
};

export default FooterComp;
