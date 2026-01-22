import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  category: 'room',
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

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ FIXED
  const [formData, setFormData] = useState(defaultFormData);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ================= FETCH LISTING =================
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/property/getPropertyDetail/${id}`);
        if (!res.ok) throw new Error('Failed to fetch listing');
        const data = await res.json();

        setFormData({
          ...defaultFormData,
          ...data,
          subtitle: data.subtitle || data.name || '',
          listingRating: data.rating || 0,
          quantity: data.quantity || 1,
          category: 'room',
        });
      } catch (err) {
        console.error(err);
        alert('Error fetching listing');
      }
    };

    if (id) fetchListing();
  }, [id]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      let updated = {
        ...prev,
        [name]:
          type === 'checkbox'
            ? checked
            : [
                'guest','bedroom','bed','bathroom','price','rating','listingRating',
                'quantity','defaultAllowedPersons','allowedPersonsPerRoom',
                'extraPersonCharge','smokingRoomCharge','allowedPets','petFeePerPet',
              ].includes(name)
            ? Number(value) || 0
            : value,
      };

      // Subtitle mirrors Name
      if (name === 'name') updated.subtitle = value;

      // Listing Rating mirrors Rating
      if (name === 'rating') updated.listingRating = Number(value) || 0;

      return updated;
    });
  };

  // ================= IMAGE =================
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formPayload = new FormData();
    Object.keys(formData).forEach((key) => {
      formPayload.append(key, formData[key]);
    });

    if (imageFile) formPayload.append('imageFile', imageFile);

    try {
      const res = await fetch(`${BASE_URL}/api/property/update-property/${id}`, {
        method: 'PUT',
        body: formPayload,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Update failed');
        return;
      }

      alert('Listing updated successfully!');
      navigate('/products'); // ✅ REDIRECT
    } catch (err) {
      console.error('Network error:', err);
      alert('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= UI =================
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Edit Listing</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {['name','title','subtitle','location','description','badge','roomType'].map((key) => (
          <div key={key}>
            <label className="font-semibold capitalize">{key}</label>
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              disabled={key === 'subtitle'}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        ))}

        <div>
          <label className="font-semibold">Category</label>
          <input value="room" readOnly className="w-full border p-2 rounded bg-gray-100" />
        </div>

        <div>
          <label className="font-semibold">Image</label>
          <input type="file" onChange={handleImageChange} />
        </div>

        {[
          'guest','bedroom','bed','bathroom','price','rating','listingRating',
          'quantity','defaultAllowedPersons','allowedPersonsPerRoom',
          'extraPersonCharge','smokingRoomCharge','allowedPets','petFeePerPet'
        ].map((key) => (
          <div key={key}>
            <label className="font-semibold capitalize">{key}</label>
            <input
              type="number"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              disabled={key === 'listingRating'}
              className="w-full border p-2 rounded"
            />
          </div>
        ))}

        {[
          'inStock','updateCard','updateListing',
          'keepExistingImages','isSmokingAllowed','isPetFriendly'
        ].map((key) => (
          <label key={key} className="flex gap-2 items-center">
            <input
              type="checkbox"
              name={key}
              checked={formData[key]}
              onChange={handleChange}
            />
            {key}
          </label>
        ))}

        <button
          type="submit"
          disabled={isSubmitting}
          className="md:col-span-2 bg-blue-600 text-white py-2 rounded"
        >
          {isSubmitting ? 'Updating...' : 'Update Listing'}
        </button>
      </form>
    </div>
  );
};

export default Update;
