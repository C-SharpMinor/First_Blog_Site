import { Alert, Button, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
	updateStart,
	updateSuccess,
	updateFailure,
} from "../redux/User/UserSlice";
import { useDispatch } from "react-redux";

const DashProfile = () => {
	const { currentUser } = useSelector((state) => state.user);
	const [imgFile, setImgFile] = useState(null); //the browser can't read this to show it so we haev to make an img url, that's what the next line is for
	const [imgFileUrl, setImgFileUrl] = useState(null); //but just cuz the file is saved in this variable does not mean it is saved in the db. Also the db cannot use this
	const [imageFileUploadProgress, setImageFileUploadProgress] = useState(0);
	const [imageFileUploadError, setImageFileUploadError] = useState(null);
	console.log(imageFileUploadProgress, imageFileUploadError);
	const filePickerRef = useRef(null);
	const [formData, setFormData] = useState({}); //now to collect the info from the form for the backend to use
	const [imgFileUploading, setImgFileUploading] = useState(false); // a user might press the update button before the image is fully uploaded so we need to set this variable to check and make sure the img is fully uploaded before the upload button can work
	const [updateUserSuccess, setUpdateUserSuccess] = useState(null); //there are notification messages in the server for if an upload was successful or not
	const [updateUserError, setUpdateUserError] = useState(null);

	const dispatch = useDispatch();
	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImgFile(file);
			setImgFileUrl(URL.createObjectURL(file));
		}
	};

	console.log(imgFile, imgFileUrl);
	useEffect(() => {
		if (imgFile) {
			uploadImg();
		}
	}, [imgFile]); //the imgFile being in the array [] means the effect only runs if there is an img file
	//this useEffect is to give the loading effect when you upload an img in the profile

	const uploadImg = async () => {
		//why can we define this uploadImg fuction after the useEffect that uses it? because of hoisting. What does hoisting mean? it means that the function is moved to the top of the file before the code is executed. WHy does useEffect do hoisting? because it is a react hook and react hooks are called in a specific order. I used copilot to generate this, undertand it
		// console.log("Uploading Image..."); first used to see that the func was working

		setImgFileUploading(true);
		setImageFileUploadError(null); //this is to remove the error message that might have been there before when we are starting a new upload
		const storage = getStorage(app); //this was the app created in firebase.js
		const fileName = new Date().getTime() + imgFile.name; // this stores the file(that's to be saved in the db) but the profile pic in the db is unique so it will give an error if the same file is uploaded twice, which is why we added the time to it so that even if the same img is uploaded an eror does not come up as thier times will be diff
		const storageRef = ref(storage, fileName);
		const uploadTask = uploadBytesResumable(storageRef, imgFile); //we wanna use this to monitor the progress rate of the byte upload
		uploadTask.on(
			//this is used to get the info eg the no of bites, errors
			"state_changed", //tracks the info changed
			(snapshot) => {
				//snapshot is the info we get (from the uploadTask) byte by byte
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				//the progress variable will have some decimals so we round it up using toFixed(0). 0 means no decimals

				setImageFileUploadProgress(progress.toFixed(0));
			},
			(error) => {
				setImageFileUploadError(
					"Couldn't upload image, (image must be less than 2MB)"
				); //we are not saying file size is always gonna be the error but that's the most probable reason. Remeber we set the limit in the firebase storage page online
				setImageFileUploadProgress(null); //so that if there is an error eg the big file size the loading progress bar will disappear
				setImgFile(null); //so the previous (ie default) img details are put if there is a wrong file uploaded
				setImgFileUrl(null);
				setImgFileUploading(false);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					console.log("File available at", downloadURL);
					setImgFileUrl(downloadURL);
					setFormData({ ...formData, profilePic: downloadURL }); //the inputs to these stes are tracked by onChnage event listeners
					setImgFileUploading(false);
				});
			}
		);
	};
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value }); //doing ...formData to keep the previous information is important so ONLY the info that is changed in frontend is modified in backend
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setUpdateUserError(null);
		setUpdateUserSuccess(null);
		if (Object.keys(formData).length === 0) {
			//this is the check to see if when the user submits the form, it is sending some empty info. We don't allow that and have it not even submit
			setUpdateUserError("No changes made");
			return;
		}
		if (imgFileUploading) {
			setUpdateUserError("Please wait for the image to upload");
			return;
		}
		try {
			dispatch(updateStart());
			console.log(currentUser);
			console.log(formData); //so you see the data you are sending to backend, but I commented it cuz it made google give alert of a security breach since it'll show the password in the console. the code would still work regardless
			const res = await fetch(`/api/user/update/${currentUser._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (!res.ok) {
				dispatch(updateFailure(data.message));
				setUpdateUserError(data.message);
			} else {
				dispatch(updateSuccess(data));
				setUpdateUserSuccess("Profile updated successfully");
			}
		} catch (error) {
			dispatch(updateFailure(error.message)); //we wanna be able to dispatch the errors so we have to make reducers for that
			setUpdateUserError(data.message);
		}
	};
	return (
		<div className="max-w-lg mx-auto p-3 w-full">
			<h1 className="my-7 text-center font-semiiteold text-3xl">Profile</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-5">
				<input
					type="file"
					accept="image/*"
					onChange={handleImgChange}
					ref={filePickerRef}
					hidden
				/>
				{/*  self-center doesn't work without display flex */}
				<div
					className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
					onClick={() => filePickerRef.current.click()}
				>
					{imageFileUploadProgress && (
						<CircularProgressbar
							value={imageFileUploadProgress || 0}
							text={`${imageFileUploadProgress}%`}
							strokeWidth={5}
							styles={{
								root: {
									width: "100%",
									height: "100%",
									position: "absolute",
									top: 0,
									left: 0,
								},
								path: {
									stroke: `rgba(62, 152, 199), ${
										imageFileUploadProgress / 100
									} `,
								},
							}}
						/>
					)}

					<img
						src={imgFileUrl || currentUser.profilePic}
						alt="user"
						className={`rounded-full h-full w-full object-cover border-8 border-[lightgray] 
                            ${
															imageFileUploadProgress &&
															imageFileUploadProgress < 100 &&
															"opacity-60"
														}`}
					/>
				</div>
				{imageFileUploadError && (
					<Alert color="failure"> {imageFileUploadError} </Alert>
				)}

				<TextInput
					type="text"
					id="username"
					placeholder="username"
					defaultValue={currentUser.username}
					onChange={handleChange}
				/>
				<TextInput
					type="email"
					id="email"
					placeholder="email"
					defaultValue={currentUser.email}
					onChange={handleChange}
				/>
				<TextInput
					type="password"
					id="password"
					placeholder="password"
					onChange={handleChange}
				/>
				{/* the id defines what we'll be getting the info later as(what it'll be saved as, and what we can call it as) */}
				<Button type="submit" gradientDuoTone="purpleToBlue" outline>
					Update
				</Button>
			</form>
			<div className="text-red-500 flex justify-between mt-5">
				<span className="cursor-pointer"> Delete Account </span>
				<span className="cursor-pointer"> Sign Out </span>
			</div>
			{updateUserSuccess && ( //ot's cuz we knew we'd be using the updateUserSuccess state as an if statement here(we are saying if this variable exists, then ...) that when setting the state, we set the initial value to null not false, cuz false would mean it still exists and this code would run immediately you open the page
				<Alert color="success" className="mt-5">
					{updateUserSuccess}
				</Alert>
			)}
			{updateUserError && (
				<Alert color="failure" className="mt-5">
					{updateUserError}
				</Alert>
			)}
		</div>
	);
};

export default DashProfile;
