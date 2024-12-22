//this is the page that shows the inidividual posts when the admin clicks on any post from the list of post shown byt he sidebar

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";

const PostPage = () => {
	//for this component we will be using the useParams hook to get the post slug from the url
	const { postSlug } = useParams();
	//we want a spinner to show while the page is loading so we will need the loading state
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [post, setPost] = useState(null);
	const [recentPosts, setRecentPosts] = useState(null);

	useEffect(() => {
		const fetchPost = async () => {
			try {
				setLoading(true);
				const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
				const data = await res.json();
				console.log(data);
				if (!res.ok) {
					setError(true);
					setLoading(false);
					return;
				}
				if (res.ok) {
					//this fetchPost functions works just cuz of this next line, recall in the controller, the function we had made was to
					//return posts, totalPostsand lastMonthPosts, and they are in an array inside the data object. since we only need the first thing (post)  we used data.post[0]
					setPost(data.posts[0]);
					setLoading(false);
					setError(false);
				}
			} catch (error) {
				setError(true);
				setLoading(false);
			}
		};
		fetchPost();
	}, [postSlug]);

	useEffect(() => {
		try {
			const fetchRecentPosts = async () => {
				const res = await fetch("/api/post/getposts?limit=3");
				const data = await res.json();
				if (res.ok) {
					setRecentPosts(data.posts);
				}
			};
		} catch (error) {
			console.log(error);
		}
	});

	if (loading) {
		//you have to use this return keyword cuz of this html or it won't work
		return (
			<div className="flex justify-center items-center min-h-screen">
				<Spinner size="xl" />
			</div>
		);
	}
	return (
		<main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
			<h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
				{" "}
				{post && post.title}{" "}
			</h1>
			<Link
				to={`/search?category?=${post & post.category}`}
				className="self-center mt-5"
			>
				<Button color="gray" pill size="xs">
					{" "}
					{post && post.category}
					{/* basically meaning if there is a post, then show the post.category */}
				</Button>
			</Link>
			<img
				src={post && post.image}
				alt={post && post.title}
				className="mt-10 p-3 max-h-[600px] w-full object-cover"
			/>
			<div className="flex justify-between p-3 border-b norder-slate-300">
				<span> {post && new Date(post.createdAt).toLocaleDateString()}</span>
				<span>
					{" "}
					{post && (post.content.length / 1000).toFixed(0)} mins read
				</span>
				{/* toFixed(0) removes any decimal that may be formed as a result */}
			</div>
			<div
				dangerouslySetInnerHTML={{ __html: post && post.content }}
				className="p-3 max-w-2xl mx-auto w-full post-content"
				// we want to make some additional styling to the post content like having headers get an extra indent or be bolder, or making code showed on the post be in a sandbox-type design
				// so we added post-content. It's not a tailwind class, it's a custom class we'd write in index.css to cater for all this design
			></div>
			<div className="max-w-4xl mx-auto w-full">
				{/* we coulda set the size of the callToAction directly in the file where the component is defined, but we want the callToAction to be of different sizes in different pges so we'll put the size info in the div that covers the component  */}
				<CallToAction />
			</div>
			<CommentSection postId={post._id} />

			{/* the helow is to show the latest 3 posts on the homepage */}
			<div className="flex flex-col items-center mb-5">
				<h1 className="text-xl mt-5"> Recent articles </h1>
				<div className="flex flex-wrap gap-5 mt-5 justify-center">
					{recentPosts &&
						recentPosts.map((post) => {
							<PostCard key={post._id} post={post} />;
						})}
				</div>
			</div>
		</main>
	);
};

export default PostPage;
