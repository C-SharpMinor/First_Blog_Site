import { Button, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

const SearchPage = () => {
	const [sidebarData, setSidebarData] = useState({
		searchTerm: "",
		sort: "desc",
		category: "uncategorized",
	});
	console.log(sidebarData);

	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showMore, setShowMore] = useState(false);

	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const searchTermFromUrl = urlParams.get("searchTerm");
		const sortFromUrl = urlParams.get("sort");
		const categoryFromUrl = urlParams.get("category");

		if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
			setSidebarData({
				...sidebarData,
				searchTerm: searchTermFromUrl,
				sort: sortFromUrl || "desc",
				category: categoryFromUrl || "uncategorized",
			});
		}

		//now we wanna get the post from the backend to fill the post state
		const fetchPosts = async () => {
			setLoading(true);
			const searchQuery = urlParams.toString();
			const res = await fetch(`/api/post/getposts?${searchQuery}`);
			if (!res.ok) {
				setLoading(false);
				return;
			}
			if (res.ok) {
				const data = await res.json();
				setPosts(data.posts);
				setLoading(false);
				if (data.posts.length === 9) {
					setShowMore(true);
				} else {
					setShowMore(false);
				}
			}
		};
		fetchPosts();
	}, [location.search]);

	const handleChange = (e) => {
		if (e.target.id === "searchTerm") {
			setSidebarData({
				...sidebarData,
				searchTerm: e.target.value,
			});
		}
		if (e.target.id == "sort") {
			const order = e.target.value || "desc";
			setSidebarData({ ...sidebarData, sort: order });
		}
		if (e.target.id == "category") {
			const category = e.target.value || "uncategorized";
			setSidebarData({ ...sidebarData, category }); //you know we left is as just category cuz it's the same as category: category
		}
	};

	const handleSubmit = (e) => {
		e.prevetDefault();
		const urlParams = new URLSearchParams(location.search);
		urlParams.set("searchTerm", sidebarData.searchTerm);
		urlParams.set("sort", sidebarData.sort);
		urlParams.set("category", sidebarData.category);
		const searchQuery = urlParams.toString();
		navigate(`/search?${searchQuery}`);
	};

	const handleShowMore = async () => {
		const numberOfPosts = posts.length;
		const startIndex = numberOfPosts;
		const urlParams = new URLSearchParams(location.search);
		urlParams.set("startIndex", startIndex);
		const searchQuery = urlParams.toString();
		const res = await fetch(`/api/post/getposts?${searchQuery}`);
		if (!res.ok) {
			return;
		}
		if (res.ok) {
			const data = await res.json();
			setPosts([...posts, ...data.posts]);
			console.log(data.posts);
			if (data.posts.length === 8) {
				setShowMore(true);
			} else {
				setShowMore(false);
			}
		}
	}; //why is handleShowMore not working? i have exactly 8 posts

	return (
		<div className="flex flex-col md:flex-row">
			<div className="p-7 border-b md:border-r md:min-h-screen border-grey-500">
				<form className="flex flex-col gap-8" onSubmit={handleSubmit}>
					<div className="flex items-center gap-2 ">
						<label> Search Term</label>
						<TextInput
							placeholder="Search..."
							id="searchTerm"
							type="text"
							value={sidebarData.searchTerm}
							onChange={handleChange}
						/>
					</div>

					<div className="flex item-center gap-2">
						<label className="font-semibold">Sort:</label>
						<Select onChange={handleChange} value={sidebarData.sort} id="sort">
							{/* we could also ohave set the defaultValue={'desc'}. my question is why is there {} for the defaultValue{'desc'} if desc is not a js code. why not just defaultValue='desc' */}
							<option value="desc">Latest</option>
							<option value="asc">Oldest</option>
						</Select>
					</div>

					<div className="flex item-center gap-2">
						<label className="font-semibold">Category:</label>
						<Select
							onChange={handleChange}
							value={sidebarData.category}
							id="category"
						>
							{/* we could also ohave set the defaultValue={'desc'}. my question is why is there {} for the defaultValue{'desc'} if desc is not a js code. why not just defaultValue='desc' */}
							<option value="uncategorized">Uncategorized</option>
							<option value="reactjs">React.js</option>
							<option value="nextjs">Next.js</option>
							<option value="javascript">Javascript</option>
						</Select>
					</div>
					<Button type="submit" outline gradientDuoTone="purpleToPink">
						Apply Filters
					</Button>
				</form>
			</div>
			<div className="w-full">
				<h1 className="text-3xl font-semibold border-b sm:border-gray-500 p-3 mt-5">
					Post Results
				</h1>
				<div className="p-2 flex flex-wrap gap-4">
					{!loading && posts.length === 0 && (
						<p className="text-xl text-gray-500">No posts found.</p>
					)}
					{loading && <p className="text-xl text-gray-500">Loading...</p>}
					{!loading &&
						posts &&
						posts.map((post) => <PostCard key={post._id} post={post} />)}
					{showMore && (
						<button
							onClick={handleShowMore}
							className="text-teal-500 text-lg hover:underline 
                        p-7 w-full"
						>
							Show more
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default SearchPage;
