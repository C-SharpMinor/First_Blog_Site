import React from "react";
import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";

const Home = () => {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const fetchPosts = async () => {
			const res = await fetch("/api/post/getposts");
			const data = await res.json();
			if (res.ok) {
				setPosts(data.posts); //it is this 'posts' that we are setting now that is being used in line 41. you'll notice that data is has a post object with a post object inside that first post object.
				//why are there 2 post objects? because the first post object is the object that contains the array of posts. the second post object is the array of posts itself. so we are setting the posts to the array of posts
			}
		};
		fetchPosts();
	}, []);

	return (
		<div>
			<div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold lg:text-6xl"> Welcome to my Blog</h1>
				<p className="text-gray-500 text-xs">
					Here, you'll see a variety of articles and tutorials on topics such as
					web development, software engineering, and programming languages.
				</p>
				<Link
					to="/search"
					className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
				>
					View Posts
				</Link>
			</div>
			<div className="p-3 bg-amber-100s dark:bg-slate-700">
				<CallToAction />
			</div>

			<div className="flex flex-col gap-8 py-7 p-3 max-w-6xl mx-auto">
				{posts && posts.length > 0 && (
					<div className="flex flex-col gap-6">
						<h2 className="text-2xl font-semibold text-center">
							{" "}
							Recent Posts
						</h2>
						<div className="flex flex-wrap gap-4">
							{posts.map(
								(
									post //why are we using () and not {} here? because we are returning the post component. if we were to return a div, we would use {}
								) => (
									<PostCard key={post._id} post={post} />
								)
							)}
						</div>
						<Link
							to="/search"
							className="text-lg text-teal-500 hover:underline text-center"
						>
							View all posts
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};

export default Home;
