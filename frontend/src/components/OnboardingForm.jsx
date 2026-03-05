import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", 
  "Lakshadweep", "Puducherry"
];

const CATEGORIES = [
  "General", "Other Backward Class (OBC)", "Scheduled Caste (SC)", 
  "Scheduled Tribe (ST)", "Nomadic or Semi-Nomadic Communities"
];

const OnboardingForm = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    dob: '',
    age: '',
    maritalStatus: '',
    state: '',
    areaOfResidence: '',
    category: '',
    isDisabled: '',
    isMinority: '',
    isStudent: '',
    employmentStatus: '',
    isBPL: '',
    annualIncome: '',
    isDistress: ''
  });

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'dob') {
        newData.age = calculateAge(value);
      }
      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Data Submitted:", formData);
    // Here you would typically save to backend
    // For now, save to localStorage to persist state across sessions if needed
    localStorage.setItem('userProfile', JSON.stringify(formData));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl border border-rose-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Tell us about yourself</h2>
          <p className="text-gray-600">Help us find the best financial schemes for you.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                placeholder="First Name"
              />
            </div>
            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                placeholder="Last Name"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                onChange={handleChange}
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                readOnly
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
              />
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
              <select
                name="maritalStatus"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Divorced">Divorced</option>
                <option value="Separated">Separated</option>
              </select>
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <select
                name="state"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                onChange={handleChange}
              >
                <option value="">Select State</option>
                {STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* Area of Residence */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Area of Residence</label>
              <div className="flex gap-4">
                {['Urban', 'Rural'].map((area) => (
                  <label key={area} className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="areaOfResidence"
                      value={area}
                      required
                      className="peer sr-only"
                      onChange={handleChange}
                    />
                    <div className="text-center py-3 rounded-xl border border-gray-200 peer-checked:bg-rose-500 peer-checked:text-white peer-checked:border-rose-500 transition-all">
                      {area}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              name="category"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Yes/No Questions Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <YesNoQuestion 
              label="Do you identify as a person with disability?" 
              name="isDisabled" 
              onChange={handleChange} 
            />
            <YesNoQuestion 
              label="Do you belong to a minority community?" 
              name="isMinority" 
              onChange={handleChange} 
            />
            <YesNoQuestion 
              label="Are you a student?" 
              name="isStudent" 
              onChange={handleChange} 
            />
          </div>

          {/* Conditional Employment Status */}
          {formData.isStudent === 'No' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employment Status</label>
              <select
                name="employmentStatus"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                onChange={handleChange}
              >
                <option value="">Select Employment Status</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Employed">Employed</option>
                <option value="Self Employed">Self Employed</option>
                <option value="Entrepreneur">Entrepreneur</option>
              </select>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <YesNoQuestion 
              label="Do you belong to BPL (Below Poverty Line) category?" 
              name="isBPL" 
              onChange={handleChange} 
            />
            
            {/* Conditional Annual Income */}
            {formData.isBPL === 'No' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Family's Annual Income</label>
                <input
                  type="number"
                  name="annualIncome"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                  placeholder="Enter annual income"
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          {/* Conditional Distress */}
          {formData.isBPL === 'Yes' && (
            <div className="border-t border-gray-100 pt-6">
              <YesNoQuestion 
                label="Are you in any condition of extreme hardship? (Destitute / Penury / Distress)" 
                name="isDistress" 
                onChange={handleChange} 
                fullWidth
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-rose-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2"
          >
            Find My Schemes <ChevronRight size={20} />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const YesNoQuestion = ({ label, name, onChange, fullWidth }) => (
  <div className={fullWidth ? "w-full" : ""}>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="flex gap-4">
      {['Yes', 'No'].map((option) => (
        <label key={option} className="flex-1 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option}
            required
            className="peer sr-only"
            onChange={onChange}
          />
          <div className="text-center py-2.5 rounded-xl border border-gray-200 peer-checked:bg-rose-100 peer-checked:text-rose-700 peer-checked:border-rose-200 hover:bg-gray-50 transition-all text-sm font-medium">
            {option}
          </div>
        </label>
      ))}
    </div>
  </div>
);

export default OnboardingForm;
