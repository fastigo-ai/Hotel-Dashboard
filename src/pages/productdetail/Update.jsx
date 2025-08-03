// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { BASE_URL } from '../../api/Api';

// const defaultFormData = {
//   name: '',
//   title: '',
//   subtitle: '',
//   image: '',
//   location: '',
//   guest: 0,
//   bedroom: 0,
//   bed: 0,
//   bathroom: 0,
//   listingRating: 0,
//   description: '',
//   price: 0,
//   rating: 0,
//   badge: '',
//   inStock: false,
//   category: '',
//   updateCard: false,
//   updateListing: false,
//   keepExistingImages: false,
// };

// const CreateListingForm = () => {
//   const { id } = useParams();
//   const [formData, setFormData] = useState(defaultFormData);

//   useEffect(() => {
//     const fetchListing = async () => {
//       try {
//         const res = await fetch(`${BASE_URL}/api/property/getPropertyDetail/${id}`);
//         if (!res.ok) throw new Error('Failed to fetch listing');
//         const data = await res.json();

//         // Ensure all fields from defaultFormData exist
//         const formattedData = { ...defaultFormData, ...data };
//         setFormData(formattedData);
//       } catch (err) {
//         console.error(err);
//         alert('Error fetching listing');
//       }
//     };

//     if (id) fetchListing();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]:
//         type === 'checkbox'
//           ? checked
//           : ['guest', 'bedroom', 'bed', 'bathroom', 'price', 'listingRating', 'rating'].includes(name)
//           ? Number(value)
//           : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (!id) {
//     alert('No listing ID provided. Cannot update.');
//     return;
//   }

//   try {
//     const endpoint = `${BASE_URL}/api/property/update-property/${id}`;

//     const res = await fetch(endpoint, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(formData),
//     });

//     if (!res.ok) throw new Error('Failed to update listing');

//     const data = await res.json();
//     alert('Listing updated successfully!');
//     console.log('Response:', data);
//   } catch (err) {
//     console.error(err);
//     alert('Error updating listing');
//   }
// };

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md">
//       <h2 className="text-2xl font-bold mb-6">{id ? 'Edit' : 'Create'} Listing</h2>
//       <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {[
//           ['name', 'Name'],
//           ['title', 'Title'],
//           ['subtitle', 'Subtitle'],
//           ['image', 'Image URL'],
//           ['location', 'Location'],
//           ['description', 'Description'],
//           ['category', 'Category'],
//           ['badge', 'Badge'],
//         ].map(([key, label]) => (
//           <div key={key}>
//             <label className="block text-sm font-semibold mb-1">{label}</label>
//             <input
//               type="text"
//               name={key}
//               value={formData[key]}
//               onChange={handleChange}
//               className="w-full border border-gray-300 p-2 rounded"
//               required
//             />
//           </div>
//         ))}

//         {[
//           ['guest', 'Guest'],
//           ['bedroom', 'Bedroom'],
//           ['bed', 'Bed'],
//           ['bathroom', 'Bathroom'],
//           ['price', 'Price'],
//           ['listingRating', 'Listing Rating'],
//           ['rating', 'Rating'],
//         ].map(([key, label]) => (
//           <div key={key}>
//             <label className="block text-sm font-semibold mb-1">{label}</label>
//             <input
//               type="number"
//               name={key}
//               value={formData[key]}
//               onChange={handleChange}
//               className="w-full border border-gray-300 p-2 rounded"
//               required
//             />
//           </div>
//         ))}

//         {[
//           ['inStock', 'In Stock'],
//           ['updateCard', 'Update Card'],
//           ['updateListing', 'Update Listing'],
//           ['keepExistingImages', 'Keep Existing Images'],
//         ].map(([key, label]) => (
//           <div key={key} className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               name={key}
//               checked={formData[key]}
//               onChange={handleChange}
//               className="h-5 w-5"
//             />
//             <label className="text-sm font-semibold">{label}</label>
//           </div>
//         ))}

//         <div className="md:col-span-2 mt-4">
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
//           >
//             {id ? 'Update Listing' : 'Submit Listing'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateListingForm;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../api/Api';

const defaultFormData = {
  name: '',
  title: '',
  subtitle: '',
  image: '',
  location: '',
  guest: 0,
  bedroom: 0,
  bed: 0,
  bathroom: 0,
  listingRating: 0,
  description: '',
  price: 0,
  rating: 0,
  badge: '',
  inStock: false,
  category: '',
  updateCard: false,
  updateListing: false,
  keepExistingImages: false,
  roomType: '',
  quantity: 1,
  defaultAllowedPersons: 1,
  allowedPersonsPerRoom: 1,
  extraPersonCharge: 0,
  isSmokingAllowed: false,
  smokingRoomCharge: 0,
  isPetFriendly: false,
  allowedPets: 0,
  petFeePerPet: 0,
};

const CreateListingForm = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState(defaultFormData);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/property/getPropertyDetail/${id}`);
        if (!res.ok) throw new Error('Failed to fetch listing');
        const data = await res.json();
        const formattedData = { ...defaultFormData, ...data };
        setFormData(formattedData);
      } catch (err) {
        console.error(err);
        alert('Error fetching listing');
      }
    };

    if (id) fetchListing();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : [
              'guest', 'bedroom', 'bed', 'bathroom', 'price', 'listingRating', 'rating',
              'quantity', 'defaultAllowedPersons', 'allowedPersonsPerRoom',
              'extraPersonCharge', 'smokingRoomCharge', 'allowedPets', 'petFeePerPet',
            ].includes(name)
          ? Number(value)
          : value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id) {
      alert('No listing ID provided. Cannot update.');
      return;
    }

    setIsSubmitting(true);

    const formPayload = new FormData();

    Object.keys(formData).forEach((key) => {
      formPayload.append(key, formData[key]);
    });

    if (imageFile) {
      formPayload.append('imageFile', imageFile);
    }

    // Debug log FormData
    for (let pair of formPayload.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const endpoint = `${BASE_URL}/api/property/update-property/${id}`;

      const res = await fetch(endpoint, {
        method: 'PUT',
        body: formPayload,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Server error:', data);
        alert(data.message || 'Something went wrong while updating the listing.');
        return;
      }

      alert('Listing updated successfully!');
      console.log('Updated Listing Response:', data);
    } catch (err) {
      console.error('Network error:', err);
      alert('Error updating listing. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">{id ? 'Edit' : 'Create'} Listing</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ['name', 'Name'],
          ['title', 'Title'],
          ['subtitle', 'Subtitle'],
          ['location', 'Location'],
          ['description', 'Description'],
          ['category', 'Category'],
          ['badge', 'Badge'],
          ['roomType', 'Room Type'],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="block text-sm font-semibold mb-1">{label}</label>
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-semibold mb-1">Card Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        {[
          ['guest', 'Guest'],
          ['bedroom', 'Bedroom'],
          ['bed', 'Bed'],
          ['bathroom', 'Bathroom'],
          ['price', 'Price'],
          ['listingRating', 'Listing Rating'],
          ['rating', 'Rating'],
          ['quantity', 'Quantity'],
          ['defaultAllowedPersons', 'Default Allowed Persons'],
          ['allowedPersonsPerRoom', 'Allowed Persons Per Room'],
          ['extraPersonCharge', 'Extra Person Charge'],
          ['smokingRoomCharge', 'Smoking Room Charge'],
          ['allowedPets', 'Allowed Pets'],
          ['petFeePerPet', 'Pet Fee Per Pet'],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="block text-sm font-semibold mb-1">{label}</label>
            <input
              type="number"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
        ))}

        {[
          ['inStock', 'In Stock'],
          ['updateCard', 'Update Card'],
          ['updateListing', 'Update Listing'],
          ['keepExistingImages', 'Keep Existing Images'],
          ['isSmokingAllowed', 'Smoking Allowed'],
          ['isPetFriendly', 'Pet Friendly'],
        ].map(([key, label]) => (
          <div key={key} className="flex items-center space-x-2">
            <input
              type="checkbox"
              name={key}
              checked={formData[key]}
              onChange={handleChange}
              className="h-5 w-5"
            />
            <label className="text-sm font-semibold">{label}</label>
          </div>
        ))}

        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : id ? 'Update Listing' : 'Submit Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListingForm;
