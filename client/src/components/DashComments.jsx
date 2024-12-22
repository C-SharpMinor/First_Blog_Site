import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Table, Button } from "flowbite-react";
import { HiOutlineExclamation } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

const DashComments = () => {
	const { currentUser } = useSelector((state) => state.user);
	const [comments, setComments] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [commentIdToDelete, setCommentIdToDelete] = useState(null);

	console.log(comments);
	useEffect(() => {
		//we wanna show the posts using the useEffect but recall, the command in the backend is async, so the function calling ht eopsts here will have to wait for the response. meaning the function should be async as well. We make 'useEffect' itself async so we make the function inside it async
		const fetchComments = async () => {
			try {
				const res = await fetch(`/api/comment/getcomments`);

				const data = await res.json();
				if (res.ok) {
					setComments(data.allComments);
					if (data.allComments.length < 9) {
						setShowMore(false);
					}
				}
			} catch (error) {
				console.log(error.message);
			}
		};
		if (currentUser.isAdmin) {
			fetchComments();
		}
	}, [currentUser._id]);

	const handleShowMore = async () => {
		//notice here, we are not using the allCOmments from the backend anymore but the 'comments' from the state now cuz we assigned it in line 24
		const startIndex = comments.length; //we are making the index the lenght so the array should start showing from the end of the array ie the last post
		try {
			const res = await fetch(
				`/api/comment/getcomments?startIndex=${startIndex}`
			);
			const data = await res.json();
			if (res.ok) {
				setComments((prev) => [...prev, ...data.comments]);
				if (data.comments.length < 9) {
					setShowMore(false);
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleDeleteComment = async () => {
		setShowModal(false);
		try {
			const res = await fetch(
				`/api/comment/deleteComment/${commentIdToDelete}`,
				{
					method: "DELETE",
				}
			);
			const data = await res.json();
			if (!res.ok) {
				console.log(data.message);
				setComments((prev) =>
					prev.filter((comment) => comment._id !== commentIdToDelete)
				);
				setShowModal(false);
			} else {
				console.log(data.message);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
			{/* the scrollbar stlye above was made available by the tailwind scrollbar plugin installed  */}
			{currentUser.isAdmin && comments.length > 0 ? (
				<>
					<Table hoverable className="shadow-md">
						<Table.Head>
							<Table.HeadCell>Date Created</Table.HeadCell>
							<Table.HeadCell>Comment Content </Table.HeadCell>
							<Table.HeadCell>No of Likes </Table.HeadCell>
							<Table.HeadCell>PostId </Table.HeadCell>
							<Table.HeadCell>UserId </Table.HeadCell>
							<Table.HeadCell>Delete </Table.HeadCell>
						</Table.Head>
						{comments.map((comment) => {
							return (
								<Table.Body className="divide-y" key={comment._id}>
									{/* we don't actually need the key here, but whenever you do a	map method, you should add a key as good practice. the code	will still run but the error warning of not putting a key will be in the console */}
									<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
										<Table.Cell>
											{new Date(comment.updatedAt).toLocaleDateString()}
										</Table.Cell>
										<Table.Cell>{comment.content}</Table.Cell>
										<Table.Cell>{comment.numberOfLikes}</Table.Cell>
										<Table.Cell>{comment.postId}</Table.Cell>
										<Table.Cell>{comment.userId}</Table.Cell>
										<Table.Cell>
											<span
												onClick={() => {
													setShowModal(true);
													setCommentIdToDelete(comment._id);
												}}
												className="font-medium text-red-500 hover:underline cursor-pointer"
											>
												Delete
											</span>
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
				<p>You have no comments yet</p>
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
							Are you sure you want to delete this comment?
						</h3>
						<div className="flex gap-5 justify-center">
							<Button color="failure" onClick={handleDeleteComment}>
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

export default DashComments;
