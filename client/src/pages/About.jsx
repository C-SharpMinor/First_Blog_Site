import React from "react";

const About = () => {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="max-w-2xl mx-auto p-3 text-center">
				<div className="">
					<h1 className="text-3xl font-semibold text-center my-2">
						About Ore's Blog
					</h1>
					<div className="text-md text-gray-500 flex flex-col gap-6">
						<p>
							This is a blog that I've created for the singular purpose of
							improving my skills in programming with ReactJS the API handling,
							react-redux and many other programming features in order to be a
							better developer for my work at PurpleCity.
						</p>
						<p>
							In this blog, I will be posting articles on various topics that I
							find interesting and that I think will be helpful. THis is
							actually to see that the API functionalities are good and useful
							though. This is the most difficult project I've worked on so far
							and it's opened my eyes to a lot of programming possibilities
						</p>
						<p>
							Thank you for opening this site. And going through this write-up.
							It's been truly stressful building it, considering the fact that
							I'm having tests and exams in like 2 weeks and I haven't read much
							since I've been trying to finish this. But without further ado, I
							present to you ORE'S BLOG.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default About;
