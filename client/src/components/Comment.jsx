import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux"; // we need this cuz we need currentUser so we'll use this to get it
import { Button, Textarea } from "flowbite-react";

const Comment = ({ comment, onLike, onEdit, onDelete }) => {
	//we need to import the onLike function from the commentSectin where it was defined so we are putting it in the props

	const [user, setUser] = useState({}); //it seems a good way to knwo whent o use {} is whenthe variable is to containa lot of info so will have sto be stored in an object form
	//this user variable will have to contain lots of info on the user like the userimgae, userID and all that so it is best as an object
	const { currentUser } = useSelector((state) => state.user);
	const [isEditing, setIsEditing] = useState(false);
	const [editedContent, setEditedContent] = useState(comment.content);
	useEffect(() => {
		const getUser = async () => {
			try {
				const res = await fetch(`/api/user/${comment.userId}`);
				const data = await res.json();

				if (res.ok) {
					setUser(data);
				}
			} catch (error) {
				console.log(error.message);
			}
		};
		getUser();
	}, [comment]);

	const handleEdit = async () => {
		setIsEditing(true);
		setEditedContent(comment.content); //why are we doing this whenwe have already set the initial value of editedComment to that
	};

	const handleSave = async () => {
		try {
			const res = await fetch(`/api/comment/editComment/${comment._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					content: editedContent,
				}),
			});
			if (res.ok) {
				setIsEditing(false);
				onEdit(comment, editedContent); //i do not get this concept of onEdit. Where was it defined? how do i know what it's argumwnts are. how is it being used both in the comment.jsx and commentSection.jsx
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div className="flex p-4 border-b dark:border-gray-600 text-sm">
			<div className="flex-shrink-0 mr-3">
				<img
					src={user.profilePic}
					alt={user.username}
					className="w-10 h-10 rounded-full bg-gray-200"
				/>
			</div>
			<div className="flex-1">
				<div className="flex item-center mb-1">
					<span className="font-bold mr-1 test-xs truncate">
						{" "}
						{user ? `@${user.username}` : "anonymous user"}
						{/* we did that conditional statement cuz it's possibel that the user had been deleted after making that comment. so if the user is not found, we say anonymous user */}
						{/* at this point we had to install the moment package to show the time of the posting of the comment by the user */}
					</span>
					<span className="text-gray-500 text-xs">
						{moment(comment.createdAt).fromNow()}
					</span>
				</div>

				{isEditing ? (
					<>
						<Textarea
							className="mb-2"
							value={editedContent}
							onChange={(e) => setEditedContent(e.target.value)}
						/>
						<div className="flex justify-end gap-2 text-sm">
							<Button
								type="button"
								size="sm"
								gradientDuoTone="purpleToBlue"
								onClick={handleSave}
							>
								Save
							</Button>
							<Button
								type="button"
								size="sm"
								gradientDuoTone="purpleToBlue"
								outline
								onClick={() => setIsEditing(false)}
							>
								Cancel
							</Button>
						</div>
					</>
				) : (
					//notice, no rows were specified in this textarea so the t.area is arranged based on the no of text

					<>
						<p className="text-gray-500 mb-2">{comment.content}</p>
						<div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
							<button
								type="button"
								onClick={() => onLike(comment._id)}
								className={`text-sm text-gray-400 hover:text-blue-500 ${
									currentUser &&
									comment.likes.includes(currentUser._id) &&
									"!text-blue-500"
								}`}
								// for the blue color to overrule the grey color when the button is clicked, the blue was given important by '!'
							>
								<FaThumbsUp />{" "}
							</button>
							<p className="text-gray-400">
								{comment.numberOfLikes > 0 &&
									comment.numberOfLikes +
										" " +
										(comment.numberOfLikes === 1 ? "Like" : "Likes")}
							</p>
							{currentUser &&
								(currentUser._id === comment.userId || currentUser.isAdmin) && (
									<>
										<button
											type="button"
											onClick={handleEdit}
											className="text-gray-400 hover:text-blue-500"
										>
											Edit
										</button>
										<button
											type="button"
											onClick={() => onDelete(comment._id)}
											className="text-red-400 hover:text-red-500"
										>
											Delete
										</button>
									</>
								)}
						</div>
					</>
				)}
			</div>
		</div>
	);
	//we could either have made the handle element funvtion in the commentSection.jsx or her but we chose here cuz you don't need to rename all comments you just need to rename each one
};

export default Comment;
