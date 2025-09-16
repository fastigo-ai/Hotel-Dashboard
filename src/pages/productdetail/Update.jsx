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
  quantity: 1, // Make sure default is 1, not 0
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
        
        // Ensure quantity is preserved from the fetched data or use default
        const formattedData = { 
          ...defaultFormData, 
          ...data,
          quantity: data.quantity || defaultFormData.quantity // Explicitly preserve quantity
        };
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
          ? Number(value) || 0 // Add fallback to 0 if NaN
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

    // Create a regular object first to ensure proper data types
    const dataToSend = {
      ...formData,
      // Explicitly ensure numbers are properly converted
      guest: Number(formData.guest) || 0,
      bedroom: Number(formData.bedroom) || 0,
      bed: Number(formData.bed) || 0,
      bathroom: Number(formData.bathroom) || 0,
      price: Number(formData.price) || 0,
      listingRating: Number(formData.listingRating) || 0,
      rating: Number(formData.rating) || 0,
      quantity: Number(formData.quantity) || 1, // Ensure quantity is never 0
      defaultAllowedPersons: Number(formData.defaultAllowedPersons) || 1,
      allowedPersonsPerRoom: Number(formData.allowedPersonsPerRoom) || 1,
      extraPersonCharge: Number(formData.extraPersonCharge) || 0,
      smokingRoomCharge: Number(formData.smokingRoomCharge) || 0,
      allowedPets: Number(formData.allowedPets) || 0,
      petFeePerPet: Number(formData.petFeePerPet) || 0,
    };

    const formPayload = new FormData();

    // Append all form data
    Object.keys(dataToSend).forEach((key) => {
      formPayload.append(key, dataToSend[key]);
    });

    if (imageFile) {
      formPayload.append('imageFile', imageFile);
    }

    // Debug log FormData
    console.log('Form Data Object:', dataToSend);
    for (let pair of formPayload.entries()) {
      console.log(`${pair[0]}: ${pair[1]} (type: ${typeof pair[1]})`);
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
              min={key === 'quantity' || key === 'defaultAllowedPersons' || key === 'allowedPersonsPerRoom' ? '1' : '0'}
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