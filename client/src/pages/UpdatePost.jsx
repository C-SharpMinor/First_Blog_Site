//to write this we just copied the creatpost file exactly and changed the small diff in words like Create post becomes Update Post
//made the navigation route in the app.jsx
//then next was to get the id of the post from the address at the url
//we had to add useParams for this and sed it for the postId variable. THen we used that in the useEffect

//THIS CODE IS STILL NOT WORKING BECAUSE FORMDATA REFUSES TO ADD postID AFOR THE UPDATE ROUTE TO WORK. I don tire
import { TextInput, Select, FileInput, Button, Alert } from "flowbite-react";
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
	getStorage,
	ref,
	getDownloadURL,
	uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

//I HAVE NOT BEEN ABLE TO FIGURE OUT THE PROBLEM WITH MY UPDATEPOST CODE.

const UpdatePost = () => {
	const [file, setFile] = useState(null);
	const [imgUploadProgress, setImgUploadProgress] = useState(null);
	const [imgUploadError, setImgUploadError] = useState(null);
	const [formData, setFormData] = useState({});
	const [publishError, setPublishError] = useState(null);
	const { postId } = useParams();
	const currentUser = useSelector((state) => state.user);

	const navigate = useNavigate();

	useEffect(() => {
		//we need to get the posts fromt he db using useEffect, but just like I've said b4, we can't use async on useEffect so use it in a function inside useEffect
		try {
			const fetchPosts = async () => {
				const res = await fetch(`/api/post/getposts?postId=${postId}`);
				const data = await res.json();
				if (!res.ok) {
					console.log(data.message);
					setPublishError(data.message);
					return;
				}
				if (res.ok) {
					setPublishError(null);
					setFormData(data.posts[0]);
				}
			};
			fetchPosts();
		} catch (error) {
			console.log(error.message);
		}
	}, [postId]); //after doing this, we used this info to fill the forms down there

	const handleUploadImg = async () => {
		try {
			if (!file) {
				setImgUploadError("Please select an image");
				return; // Added return to prevent further execution
			}

			setImgUploadError(null);
			//this is just the same firebase implementation as the one used in the DashProfile file
			const storage = getStorage(app); //this  Initializes a connection to your Firebase Storage, using the app (your Firebase app configuration). now you have created a storage object WHERE you can put the files that you upload
			const fileName = new Date().getTime() + "-" + file.name; //making the fileName variable cuz your'll put it in the mothod below detailing how you want the files to be named
			const storageRef = ref(storage, fileName); //we had already made the storage for the files before, so this is to tell Firebase Where to store the file(ie in the storage. sth like 'It's that storage i mafde before that you should store it in ooo') and it states the file nomenclature as well
			const uploadTask = uploadBytesResumable(storageRef, file);
			uploadTask.on(
				"state.changed",
				(snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					setImgUploadProgress(progress.toFixed(0));
				},
				(error) => {
					setImgUploadError("Image upload failed");
					setImgUploadProgress(null);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						setImgUploadProgress(null);
						setImgUploadError(null);
						setFormData({ ...formData, image: downloadURL });
					});
				}
			);
		} catch (error) {
			console.log(error);
			setImgUploadError("Image upload failed");
			setImgUploadProgress(null);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setFormData({ ...formData, _id: postId });
			console.log(formData, currentUser);
			const res = await fetch(
				`/api/post/updatepost/${formData._id}/${currentUser._id}`, //we could've use the useParam as well to get the postId
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
				}
			);
			const data = await res.json();
			//at this point we now had to make the pucblishError state for the error
			if (!res.ok) {
				setPublishError(data.message);
				return;
			}

			if (res.ok) {
				setPublishError(null);
				setTimeout(() => {
					navigate(`/post/${data.slug}`);
				}, 2000);
			}
		} catch (error) {
			setPublishError("Something went wrong");
		}
	};

	return (
		<div className="p3 max-w-3xl mx-auto min-h-screen">
			<h1 className="text-center text-3xl my-7 font-semibold">Update Post</h1>
			<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
				<div className="flex flex-col gap-4 sm:flex-row justify-between outline">
					{/* don't forget the styling convention, the flex-sol is the default meaning for screens generally, the children are stacked in a col. but after that we said that screens from sm and above should be stacked in a row this would mean that only screens smaller than 'sm' would be stacked ina column now */}
					<TextInput
						type="text"
						placeholder="Title"
						required
						id="title"
						className="flex-1"
						onChange={(e) =>
							setFormData({ ...formData, title: e.target.value })
						}
						value={formData.title}
					/>
					<Select
						onChange={(e) =>
							setFormData({ ...formData, category: e.target.value })
						}
						value={formData.category}
					>
						<option value="uncategorized">Select a category</option>
						<option value="javascript"> Javascript </option>
						<option value="reactjs"> React </option>
						<option value="nextjs"> Next.js </option>
					</Select>
				</div>
				<div className="flex gap-4 items-center justify-between border-4 border-dotted p-3">
					<FileInput
						type="file"
						accept="image/*"
						onChange={(e) => setFile(e.target.files[0])}
					/>
					<Button
						type="button"
						gradientDuoTone="purpleToBlue"
						size="sm"
						outline
						onClick={handleUploadImg}
						disabled={imgUploadProgress !== null}
					>
						{/* Upload Image 
						instead of the button just showing upload img, we want it to show the progrees bar when uploading so we made that condition*/}
						{imgUploadProgress ? (
							<div className="w-16 h-16">
								<CircularProgressbar
									value={imgUploadProgress}
									text={`${imgUploadProgress || 0}%`}
								/>
							</div>
						) : (
							"Upload Image"
						)}
					</Button>
				</div>
				{imgUploadError && <Alert color="failure"> {imgUploadError} </Alert>}
				{formData.image && (
					<img
						src={formData.image}
						alt="Uploaded Image"
						className="h-72 mb-12"
					/>
				)}
				<ReactQuill
					theme="snow"
					placeholder="Write something..."
					value={formData.content}
					className="h-72 mb-12"
					required
					onChange={(value) => {
						setFormData({ ...formData, content: value });
					}}
				/>
				<Button type="submit" gradientDuoTone="purpleToPink">
					{" "}
					Update Post{" "}
				</Button>
				{publishError && <Alert color="failure"> {publishError} </Alert>}
				{!publishError && (
					<Alert color="success">Post updated successfully</Alert>
				)}
				{/* we have to put that condition first of 'if there is a publish error...' (yes, it's AND but in this case it is functioning just like an IF), or else, the ALert will always show */}
			</form>
		</div>
	);
};

export default UpdatePost;
