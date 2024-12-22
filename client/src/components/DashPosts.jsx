//immediatelt after oding the rafce of this component, we went to make the api command to get all the posts that will be shown in this section
import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Table, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamation } from "react-icons/hi";

const DashPosts = () => {
	const { currentUser } = useSelector((state) => state.user);
	const [userPosts, setUserPosts] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [postIdToDelete, setPostIdToDelete] = useState(null);

	console.log(userPosts);
	useEffect(() => {
		//we wanna show the posts using the useEffect but recall, the command in the backend is async, so the function calling ht eopsts here will have to wait for the response. meaning the function should be async as well. We make 'useEffect' itself async so we make the function inside it async
		const fetchPosts = async () => {
			try {
				const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
				//         , {
				//         method: 'GET',
				//         headers: {
				//             'Content-Type': 'application/json',}
				// }) we don't need this since we are not sending any data to the backend
				const data = await res.json();
				if (res.ok) {
					setUserPosts(data.posts);
					if (data.posts.length < 9) {
						setShowMore(false);
					}
				}
			} catch (error) {
				console.log(error.message);
			}
		};
		if (currentUser.isAdmin) {
			fetchPosts();
		}
	}, [currentUser._id]);

	const handleShowMore = async () => {
		const startIndex = userPosts.length; //we are making the index the lenght so the array should start showing from the end of the array ie the last post
		try {
			const res = await fetch(
				`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
			);
			const data = await res.json();
			if (res.ok) {
				setUserPosts((prev) => [...prev, ...data.posts]);
				if (data.posts.length < 9) {
					setShowMore(false);
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleDeletePost = async () => {
		setShowModal(false);
		try {
			const res = await fetch(
				`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
				{
					method: "DELETE",
				}
			);
			const data = await res.json();
			if (!res.ok) {
				console.log(data.message);
			} else {
				setUserPosts((prev) =>
					prev.filter((post) => post._id !== postIdToDelete)
				);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
			{/* the scrollbar stlye above was made available by the tailwind scrollbar plugin installed  */}
			{currentUser.isAdmin && userPosts.length > 0 ? (
				<>
					<Table hoverable className="shadow-md">
						<Table.Head>
							<Table.HeadCell>Date Updated</Table.HeadCell>
							<Table.HeadCell>Post Image </Table.HeadCell>
							<Table.HeadCell>Post Title </Table.HeadCell>
							<Table.HeadCell>Category </Table.HeadCell>
							<Table.HeadCell>Delete </Table.HeadCell>
							<Table.HeadCell>
								<span>Edit </span>
							</Table.HeadCell>
						</Table.Head>
						{userPosts.map((post) => {
							return (
								<Table.Body className="divide-y" key={post._id}>
									<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
										<Table.Cell>
											{new Date(post.updatedAt).toLocaleDateString()}
										</Table.Cell>
										<Table.Cell>
											<Link to={`/post/${post.slug}`}>
												<img
													src={post.image}
													alt={post.title}
													className="w-20 h-10 object-cover bg-gray-500"
												/>
											</Link>
										</Table.Cell>
										<Table.Cell>
											<Link
												to={`/post/${post.slug}`}
												className="font-medium text-gray-900 dark:text-white"
											>
												{post.title}
											</Link>
										</Table.Cell>
										<Table.Cell>{post.category}</Table.Cell>
										<Table.Cell>
											<span
												onClick={() => {
													setShowModal(true);
													setPostIdToDelete(post._id);
												}}
												className="font-medium text-red-500 hover:underline cursor-pointer"
											>
												Delete
											</span>
										</Table.Cell>
										<Table.Cell>
											<Link
												to={`/update-post/${post._id}`}
												className="text-teal-500 hover:underline"
											>
												<span>Edit</span>
											</Link>
										</Table.Cell>
									</Table.Row>
								</Table.Body>
							);
						})}
					</Table>
					{showMore && (
						<button
							className="w-full text-teal-500 py-7 hover:underline"
							onClick={handleShowMore}
						>
							Show more...
						</button>
					)}
				</>
			) : (
				<p>You have no posts yet</p>
			)}
			<Modal
				show={showModal}
				onClose={() => setShowModal(false)}
				popup
				size="md"
			>
				<Modal.Header />
				<Modal.Body>
					<div className="text-center">
						<HiOutlineExclamation
							className="h-14 w-14 text-gray-400 
                        dark:text-gray-200 mb-4 mx-auto"
						/>
						<h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
							Are you sure you want to delete this post
						</h3>
						<div className="flex gap-5 justify-center">
							<Button color="failure" onClick={handleDeletePost}>
								Yes, I'm sure
							</Button>
							<Button color="gray" onClick={() => setShowModal(false)}>
								No, Cancel
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
};

export default DashPosts;
