// // EditProfileForm.js
// import React, { useState,useEffect } from 'react';

// const EditProfileForm = ({ user, onSave }) => {
//   const [formData, setFormData] = useState({
//     firstName: user.firstName,
//     lastName: user.lastName,
//     location: user.location || '',
//     occupation: user.occupation || '',
//     picture: null,
//   });
//   useEffect(() => {
//     if (user) {
//       setFormData({
//         firstName: user.firstName || '',
//         lastName: user.lastName || '',
//         location: user.location || '',
//         occupation: user.occupation || '',
//         picture: null,
//       });
//     }
//   }, [user]);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === 'picture') {
//       setFormData((prevData) => ({
//         ...prevData,
//         picture: files[0], // Assuming only one file is allowed
//       }));
//     } else {
//       setFormData((prevData) => ({
//         ...prevData,
//         [name]: value,
//       }));
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const formDataToSend = new FormData();
//     formDataToSend.append('firstName', formData.firstName);
//     formDataToSend.append('lastName', formData.lastName);
//     formDataToSend.append('location', formData.location);
//     formDataToSend.append('occupation', formData.occupation);
//     formDataToSend.append('picture', formData.picture);

//     onSave(formDataToSend);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <label>
//         First Name:
//         <input
//           type="text"
//           name="firstName"
//           value={formData.firstName}
//           onChange={handleChange}
//         />
//       </label>
//       <label>
//         Last Name:
//         <input
//           type="text"
//           name="lastName"
//           value={formData.lastName}
//           onChange={handleChange}
//         />
//       </label>
//       <label>
//         Location:
//         <input
//           type="text"
//           name="location"
//           value={formData.location}
//           onChange={handleChange}
//         />
//       </label>
//       <label>
//         Occupation:
//         <input
//           type="text"
//           name="occupation"
//           value={formData.occupation}
//           onChange={handleChange}
//         />
//       </label>
//       <label>
//         Profile Picture:
//         <input type="file" name="picture" onChange={handleChange} />
//       </label>
//       <button type="submit">Save</button>
//     </form>
//   );
// };

// export default EditProfileForm;
