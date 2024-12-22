import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Textarea, Button, Alert, Modal } from "flowbite-react";
import { useState, useEffect } from "react";
import { HiOutlineExclamation } from "react-icons/hi";

import Comment from "./Comment";

const CommentSection = ({ postId }) => {
	const { currentUser } = useSelector((state) => state.user);
	const [comment, setComment] = useState("");
	const [commentError, setCommentError] = useState(null);
	const [postedComments, setPostedComments] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [commentToDelete, setCommentToDelete] = useState(null);

	const navigate = useNavigate();
	console.log(postedComments);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (comment.length > 200) {
			return;
		}
		try {
			const res = await fetch("/api/comment/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					content: comment,
					postId,
					userId: currentUser._id,
				}),
			});
			const data = await res.json();
			if (res.ok) {
				setComment("");
				setCommentError(null);
				setPostedComments({ data, ...comments }); //ie keep previous comments and add the data(the new commment) at the beginning
			}
		} catch (error) {
			setCommentError(error.message);
		}
	};

	useEffect(() => {
		const getPostedComments = async () => {
			try {
				const res = await fetch(`/api/comment/getPostedComments/${postId}`);
				if (res.ok) {
					const data = await res.json();
					setPostedComments(data);
				}
			} catch (error) {
				console.log(error.message);
			}
		};
		getPostedComments();
	}, [postId]);

	const handleLike = async (commentId) => {
		try {
			if (!currentUser) {
				navigate("/sign-in");
				return;
			}
			const res = await fetch(`/api/likeComment/${comment.id}`, {
				//we are getting the comment.id from the input of the function
				method: "PUT",
				// headers: {
				//     'Content-Type': "application/json"
				// },
				// body: JSON.stringify({
				//     userID: currentUser._id
				// })

				//usually we'd have to put the above so we can provide the currentUser._id  but we don't need to this time since that info will be in the co okie
			});
			if (res.ok) {
				const data = res.json();
				//after thi. we are updating the comments based on the new data
				setPostedComments(
					postedComments.map((comment) => {
						comment._id === commentId
							? {
									...comment,
									likes: data.likes,
									numberOfLikes: data.numberOfLikes, //or we coulda done data.likes.length
							  }
							: comment;
						//I have just observed that when making the ? conditional in the jsx part of the code, we use ?():() since the () will house html tags but when using the conditional in actual js code, we use ? {}:{} just like here
					})
				);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleEdit = async (comment, editedContent) => {
		setPostedComments(
			postedComments.map(
				(
					c //this c is still to get the comments but we don't wanna mix it with the other comment variable.
				) => (c._id === comment._id ? { ...c, content: editedContent } : c)
			)
		);
	};

	const handleDelete = async (commentId) => {
		setShowModal(false);
		try {
			if (!currentUser) {
				navigate("/sign-in");
				return;
			}
			const res = await fetch(`/api/comment/deleteComment/${commentToDelete}`, {
				method: "DELETE",
			});
			if (res.ok) {
				const data = res.json();
				setPostedComments(
					postedComments.filter((comment) => comment._id !== commentId)
				);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div className="max-w-2xl mx-auto w-full p-3">
			{currentUser ? (
				<div className="flex item-center gap-1 my-5 text-grey-500 text-sm">
					<p> Signed in as: </p>
					<img
						className="h-5 w-5 object-cover rounded-full"
						src={currentUser.profilePic}
						alt=""
					/>
					<Link
						to={"/dashboard?tab=profile"}
						className="text-xs text-cyan-600 hover:underline"
					>
						@{currentUser.username}
					</Link>
					{/* we noticed a problem with this link(it's not actuaaly a problem, but we don't want it to act that way), when it is clicked, it goes to
					the bottom of the new page{since we were at the bottom of the pg that the link was clicked} instead of starting at the top. We had to
					make ScrollToTOp.jsx to fix this */}
				</div>
			) : (
				<div className="text-sm text-teal-500 my-5 flex gap-1">
					You must be logged in to comment.
					<Link to={"/sign-in"} className="text-blue-500 hover:underline">
						{" "}
						Sign In.
					</Link>
				</div>
			)}
			{currentUser && (
				<>
					<form
						onSubmit={handleSubmit}
						className="border border-teal-500 rounded-md p-3"
					>
						<Textarea
							placeholder="Add a comment..."
							rows="3"
							maxLength="200"
							onChange={(e) => setComment(e.target.value)}
							value={comment}
						/>
						<div className="flex justify-between ite m-center mt-5">
							<p className="text-gray-500 text-xs">
								{200 - comment.length} charcaters remaining
							</p>
							<Button outline gradientDuoTone="purpleToBlue" type="submit">
								Submit
							</Button>
						</div>
					</form>
					{commentError && (
						<Alert color="failure" className="mt-5">
							{commentError}
						</Alert>
					)}
					{postedComments.length == 0 ? (
						<p className="texyt-sm my-5"> No comments yet. </p>
					) : (
						<>
							<div className="text-sm my-5 flex items-center gap-2">
								<p>Comments</p>
								<div className="border border-gray-400 py-1 px-2">
									<p>{postedComments.length}</p>
								</div>
							</div>
							{postedComments.map((comment) => {
								return (
									<Comment
										key={comment._id}
										comment={comment}
										onLike={handleLike}
										onEdit={handleEdit}
										// onDelete={handleDelete}
										//the above was the code we decide we'd use to rep the handle delete initially
										//but since we're using a modal, it is smarter to set the modal state to true here, then call the handleDelete from inside the code of the modal
										//so we switched to the below:
										onDelete={(commentId) => {
											setShowModal(true);
											setCommentToDelete(commentId);
										}}
									/>
								);
							})}
						</>
					)}
				</>
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
							Are you sure you want to delete this comment
						</h3>
						<div className="flex gap-5 justify-center">
							<Button
								color="failure"
								onClick={() => handleDelete(commentToDelete)}
							>
								{/* initially, we didn't put the ()=> in the onclick function, but when we realized we had to pass the commentToDelete in it for the function, we added the ()=> */}
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

export default CommentSection;
