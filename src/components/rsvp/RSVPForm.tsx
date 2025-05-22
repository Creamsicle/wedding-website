'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import { searchGuests, submitRSVP } from '@/lib/firebase/rsvp';
import type { GuestParty, RSVPResponse } from '@/lib/firebase/rsvp';
import Image from 'next/image';
type ResponseFieldValue = string | boolean;

interface RSVPFormProps {
  onPartySelectStateChange: (isPartySelected: boolean) => void;
}

export function RSVPForm({ onPartySelectStateChange }: RSVPFormProps) {
  const [searchName, setSearchName] = useState('');
  const [searchResults, setSearchResults] = useState<GuestParty[]>([]);
  const [selectedParty, setSelectedParty] = useState<GuestParty | null>(null);
  const [responses, setResponses] = useState<{ [key: string]: RSVPResponse }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [currentGuestCardIndex, setCurrentGuestCardIndex] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchName.length < 2) {
      setSearchError('Please enter at least 2 characters');
      return;
    }
    
    setIsSearching(true);
    setSearchError('');
    setSearchResults([]);

    try {
      const results = await searchGuests(searchName);
      setSearchResults(results);
      if (results.length === 0) {
        setSearchError('No matches found. Please try a different name.');
      }
    } catch (error) {
      setSearchError('An error occurred while searching. Please try again.');
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePartySelect = (party: GuestParty) => {
    setSelectedParty(party);
    onPartySelectStateChange(true);
    const initialResponses = party.partyMembers.reduce((acc, guest) => ({
      ...acc,
      [guest.id]: {
        hinduCeremonyAttending: false,
        weddingReceptionAttending: false,
        mealPreference: 'Chicken' as const,
        dietaryRestrictions: '',
        needsRideToHinduCeremony: false,
        hinduCeremonyRideDetails: '',
        needsRideToWedding: false,
        weddingRideDetails: '',
        canOfferRide: false,
        rideOfferDetails: '',
        email: '',
        physicalAddress: {
          street: '',
          city: '',
          province: '',
          postalCode: '',
          country: ''
        },
        otherComments: ''
      }
    }), {});
    setResponses(initialResponses);
    setCurrentGuestCardIndex(0);

    // Scroll logic will be handled by useEffect now
    // if (typeof window !== 'undefined') {
    //   window.scrollTo({ top: 0, behavior: 'instant' });
    // }
  };

  useEffect(() => {
    if (selectedParty && formRef.current) {
      formRef.current.scrollTo({ top: 0, behavior: 'instant' });
    } else if (selectedParty && typeof window !== 'undefined') {
      // Fallback if formRef somehow isn't set but a party is selected
      // This might indicate the main page itself needs scrolling if formRef isn't the primary scroller for the view.
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [selectedParty]); // Run when selectedParty changes

  const handleResponseChange = (guestId: string, field: keyof RSVPResponse, value: ResponseFieldValue) => {
    setResponses(prev => {
      const newResponses = {
        ...prev,
        [guestId]: {
          ...prev[guestId],
          [field]: value
        }
      };
      return newResponses;
    });
  };

  const handleAddressChange = (guestId: string, field: keyof NonNullable<RSVPResponse['physicalAddress']>, value: string) => {
    setResponses(prev => {
      const newResponses = { ...prev };
      const currentGuestResponse = newResponses[guestId];
      const existingAddress = currentGuestResponse.physicalAddress || { street: '', city: '', province: '', postalCode: '', country: '' };
      
      newResponses[guestId] = {
        ...currentGuestResponse,
        physicalAddress: {
          ...existingAddress,
          [field]: value
        }
      };
      return newResponses;
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedParty) return;
    
    setIsSubmitting(true);
    try {
      await Promise.all(
        selectedParty.partyMembers.map(guest =>
          submitRSVP(guest.id, responses[guest.id])
        )
      );
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submit error:', error);
      alert('An error occurred while submitting your RSVP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitClick = () => {
    const formEvent = new Event('submit', { bubbles: true, cancelable: true }) as unknown as FormEvent<HTMLFormElement>;
    handleSubmit(formEvent);
  };

  const handleNextGuest = () => {
    if (selectedParty && currentGuestCardIndex < selectedParty.partyMembers.length - 1) {
      const currentGuestId = selectedParty.partyMembers[currentGuestCardIndex].id;
      const nextGuestId = selectedParty.partyMembers[currentGuestCardIndex + 1].id;

      setResponses(prevResponses => {
        const newResponses = { ...prevResponses };
        const currentGuestData = newResponses[currentGuestId];
        
        if (currentGuestData) {
          newResponses[nextGuestId] = {
            ...newResponses[nextGuestId],
            email: currentGuestData.email,
            physicalAddress: currentGuestData.physicalAddress ? { ...currentGuestData.physicalAddress } : { street: '', city: '', province: '', postalCode: '', country: '' }
          };
        }
        return newResponses;
      });

      setCurrentGuestCardIndex(prevIndex => prevIndex + 1);

      if (formRef.current) {
        formRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevGuest = () => {
    if (currentGuestCardIndex > 0) {
      setCurrentGuestCardIndex(prevIndex => prevIndex - 1);
      if (formRef.current) {
        formRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
         // Fallback for environments where formRef might not be immediately available or in mobile views not using the ref's scrollable parent
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Determine instructional text based on form state
  let instructionalText = "";
  if (!selectedParty) {
    if (searchResults.length > 0) {
      instructionalText = "Please select your party";
    } else {
      instructionalText = "Please enter your name to find your invitation and RSVP for your party.";
    }
  }
  // No specific text needed if a party is selected, as that section has its own heading

  if (isSubmitted) {
    return (
      <div className="text-center card-hover p-8 rounded-lg shadow-lg flex flex-col items-center">
        <div className="mb-8 w-full max-w-md">
          <Image 
            src="/images/rsvp1.png" 
            alt="RSVP Confirmation Image" 
            width={600}
            height={400}
            className="rounded-lg object-contain" 
          />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Thank you for your RSVP!</h2>
        <p className="text-[var(--rust-light)] mb-6">Your response has been recorded.</p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-[var(--rust-primary)] hover:bg-[var(--rust-secondary)] text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 rsvp-form-container flex flex-col flex-grow h-full">
      {instructionalText && (
        <p className="text-center text-white/90 mb-6 max-w-lg mx-auto text-lg font-medium">
          {instructionalText}
        </p>
      )}

      {!selectedParty ? (
        <form onSubmit={handleSearch} className="space-y-6 max-w-md mx-auto">
          <div>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-lg bg-navy-700 text-white placeholder-white border border-navy-500 focus:outline-none focus:ring-2 focus:ring-rust-500 focus:border-rust-500 shadow-md"
              minLength={2}
              disabled={isSearching}
            />
            {searchError && !isSearching && (
              <p className="mt-2 text-sm text-red-400">{searchError}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-rust-500 hover:bg-rust-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-150 shadow-lg"
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
          {isSearching && (
            <p className="text-center text-white/70 mt-4 animate-pulse">Looking for your invitation...</p>
          )}
        </form>
      ) : (
        <div className="space-y-4 flex flex-col flex-1 h-full">
          {/* Scrollable container for all guest cards */}
          <div 
            ref={formRef}
            className="bg-gray-800/80 p-4 md:p-6 rounded-xl shadow-xl overflow-y-auto styled-scrollbar space-y-6 rsvp-guest-cards-container diag-blue flex-1"
          >
            <h3 className="text-2xl font-bold text-white mb-2 text-center">
              RSVP for Your Party
            </h3>
            {/* Guest Counter for Mobile View - now for all views if multiple guests */}
            {selectedParty.partyMembers.length > 1 && (
              <p className="text-center text-white/80 text-sm mb-4">
                Guest {currentGuestCardIndex + 1} of {selectedParty.partyMembers.length}
              </p>
            )}

            {/* Display only the current guest's card */}
            {selectedParty.partyMembers.map((guest, index) => (
              <div 
                key={guest.id} 
                // Show only current card on mobile, add animation, show all on larger screens (md breakpoint)
                className={`${index === currentGuestCardIndex ? 'block animate-subtle-fade-in' : 'hidden'} rsvp-guest-card bg-gray-700/90 p-5 rounded-lg shadow-lg mb-6 last:mb-0`}
              >
                <h4 className="text-xl font-semibold text-white mb-4 border-b border-gray-600 pb-2">
                  {guest.firstName} {guest.lastName}
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[var(--rust-light)] mb-2">
                      Will you attend the Friday Hindu Ceremony?
                    </label>
                    <div className="space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          checked={responses[guest.id]?.hinduCeremonyAttending === true}
                          onChange={() => handleResponseChange(guest.id, 'hinduCeremonyAttending', true)}
                          className="form-radio text-[var(--rust-primary)]"
                        />
                        <span className="ml-2 text-white">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          checked={responses[guest.id]?.hinduCeremonyAttending === false}
                          onChange={() => handleResponseChange(guest.id, 'hinduCeremonyAttending', false)}
                          className="form-radio text-[var(--rust-primary)]"
                        />
                        <span className="ml-2 text-white">No</span>
                      </label>
                    </div>
                  </div>

                  {responses[guest.id]?.hinduCeremonyAttending && (
                    <div className="pl-6 space-y-4 mt-3 border-l-2 border-rust-500/50">
                      <div>
                        <label className="block text-[var(--rust-light)] mb-2">
                          Do you need a ride to the Brampton Hindu ceremony?
                        </label>
                        <div className="space-x-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              checked={responses[guest.id]?.needsRideToHinduCeremony === true}
                              onChange={() => handleResponseChange(guest.id, 'needsRideToHinduCeremony', true)}
                              className="form-radio text-[var(--rust-primary)]"
                            />
                            <span className="ml-2 text-white">Yes</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              checked={responses[guest.id]?.needsRideToHinduCeremony === false}
                              onChange={() => handleResponseChange(guest.id, 'needsRideToHinduCeremony', false)}
                              className="form-radio text-[var(--rust-primary)]"
                            />
                            <span className="ml-2 text-white">No</span>
                          </label>
                        </div>
                        {responses[guest.id]?.needsRideToHinduCeremony && (
                          <textarea
                            value={responses[guest.id]?.hinduCeremonyRideDetails || ''}
                            onChange={(e) => handleResponseChange(guest.id, 'hinduCeremonyRideDetails', e.target.value)}
                            placeholder="Please provide details on where you're coming from"
                            className="mt-2 w-full px-3 py-2 bg-[var(--navy-primary)] text-white rounded border border-[var(--rust-light)]"
                            rows={3}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[var(--rust-light)] mb-2">
                      Will you attend the Saturday Wedding + Reception?
                    </label>
                    <div className="space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          checked={responses[guest.id]?.weddingReceptionAttending === true}
                          onChange={() => handleResponseChange(guest.id, 'weddingReceptionAttending', true)}
                          className="form-radio text-[var(--rust-primary)]"
                        />
                        <span className="ml-2 text-white">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          checked={responses[guest.id]?.weddingReceptionAttending === false}
                          onChange={() => handleResponseChange(guest.id, 'weddingReceptionAttending', false)}
                          className="form-radio text-[var(--rust-primary)]"
                        />
                        <span className="ml-2 text-white">No</span>
                      </label>
                    </div>
                  </div>

                  {responses[guest.id]?.weddingReceptionAttending && (
                    <div className="pl-6 space-y-4 mt-3 border-l-2 border-rust-500/50">
                      <div>
                        <label className="block text-[var(--rust-light)] mb-2">
                          Meal Preference
                        </label>
                        <select
                          value={responses[guest.id]?.mealPreference}
                          onChange={(e) => handleResponseChange(guest.id, 'mealPreference', e.target.value)}
                          className="w-full px-3 py-2 bg-[var(--navy-primary)] text-white rounded border border-[var(--rust-light)]"
                        >
                          <option value="Chicken">Chicken</option>
                          <option value="Steak">Steak</option>
                          <option value="Vegetarian Risotto">Vegetarian Risotto</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[var(--rust-light)] mb-2">
                          Dietary Restrictions or Allergies
                        </label>
                        <textarea
                          value={responses[guest.id]?.dietaryRestrictions || ''}
                          onChange={(e) => handleResponseChange(guest.id, 'dietaryRestrictions', e.target.value)}
                          placeholder="Please list any dietary restrictions or allergies we should be aware of"
                          className="w-full px-3 py-2 bg-[var(--navy-primary)] text-white rounded border border-[var(--rust-light)]"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-[var(--rust-light)] mb-2">
                          Do you need a ride to the Hamilton Wedding/Reception?
                        </label>
                        <div className="space-x-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              checked={responses[guest.id]?.needsRideToWedding === true}
                              onChange={() => handleResponseChange(guest.id, 'needsRideToWedding', true)}
                              className="form-radio text-[var(--rust-primary)]"
                            />
                            <span className="ml-2 text-white">Yes</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              checked={responses[guest.id]?.needsRideToWedding === false}
                              onChange={() => handleResponseChange(guest.id, 'needsRideToWedding', false)}
                              className="form-radio text-[var(--rust-primary)]"
                            />
                            <span className="ml-2 text-white">No</span>
                          </label>
                        </div>
                        {responses[guest.id]?.needsRideToWedding && (
                          <textarea
                            value={responses[guest.id]?.weddingRideDetails || ''}
                            onChange={(e) => handleResponseChange(guest.id, 'weddingRideDetails', e.target.value)}
                            placeholder="Please provide details on where you\'re coming from"
                            className="mt-2 w-full px-3 py-2 bg-[var(--navy-primary)] text-white rounded border border-[var(--rust-light)]"
                            rows={3}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Moved "Can you offer a ride" question here */}
                  <div>
                    <label className="block text-[var(--rust-light)] mb-2">
                      Can you offer a ride to either event?
                    </label>
                    <div className="space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          checked={responses[guest.id]?.canOfferRide === true}
                          onChange={() => handleResponseChange(guest.id, 'canOfferRide', true)}
                          className="form-radio text-[var(--rust-primary)]"
                        />
                        <span className="ml-2 text-white">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          checked={responses[guest.id]?.canOfferRide === false}
                          onChange={() => handleResponseChange(guest.id, 'canOfferRide', false)}
                          className="form-radio text-[var(--rust-primary)]"
                        />
                        <span className="ml-2 text-white">No</span>
                      </label>
                    </div>
                    {responses[guest.id]?.canOfferRide && (
                      <textarea
                        value={responses[guest.id]?.rideOfferDetails || ''}
                        onChange={(e) => handleResponseChange(guest.id, 'rideOfferDetails', e.target.value)}
                        placeholder="Please provide details on where you\'re coming from and which event(s) you can offer rides to"
                        className="mt-2 w-full px-3 py-2 bg-[var(--navy-primary)] text-white rounded border border-[var(--rust-light)]"
                        rows={3}
                      />
                    )}
                  </div>

                  {/* New Fields: Email, Physical Address, Other Comments */}
                  <div>
                    <label htmlFor={`email-${guest.id}`} className="block text-[var(--rust-light)] mb-2">
                      Email Address (for confirmation)
                    </label>
                    <input
                      type="email"
                      id={`email-${guest.id}`}
                      value={responses[guest.id]?.email || ''}
                      onChange={(e) => handleResponseChange(guest.id, 'email', e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-3 py-2 bg-[var(--navy-primary)] text-white rounded border border-[var(--rust-light)]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[var(--rust-light)] mb-2">
                      Physical Address
                    </label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={responses[guest.id]?.physicalAddress?.street || ''}
                        onChange={(e) => handleAddressChange(guest.id, 'street', e.target.value)}
                        placeholder="Street Address"
                        className="w-full px-3 py-2 bg-[var(--navy-primary)] text-white rounded border border-[var(--rust-light)]"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={responses[guest.id]?.physicalAddress?.city || ''}
                          onChange={(e) => handleAddressChange(guest.id, 'city', e.target.value)}
                          placeholder="City"
                          className="w-full px-3 py-2 bg-[var(--navy-primary)] text-white rounded border border-[var(--rust-light)]"
                        />
                        <input
                          type="text"
                          value={responses[guest.id]?.physicalAddress?.province || ''}
                          onChange={(e) => handleAddressChange(guest.id, 'province', e.target.value)}
                          placeholder="Province/State"
                          className="w-full px-3 py-2 bg-[var(--navy-primary)] text-white rounded border border-[var(--rust-light)]"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={responses[guest.id]?.physicalAddress?.postalCode || ''}
                          onChange={(e) => handleAddressChange(guest.id, 'postalCode', e.target.value)}
                          placeholder="Postal/Zip Code"
                          className="w-full px-3 py-2 bg-[var(--navy-primary)] text-white rounded border border-[var(--rust-light)]"
                        />
                        <input
                          type="text"
                          value={responses[guest.id]?.physicalAddress?.country || ''}
                          onChange={(e) => handleAddressChange(guest.id, 'country', e.target.value)}
                          placeholder="Country"
                          className="w-full px-3 py-2 bg-[var(--navy-primary)] text-white rounded border border-[var(--rust-light)]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`otherComments-${guest.id}`} className="block text-[var(--rust-light)] mb-2">
                      Any other comments or notes you&apos;d like to leave for the couple?
                    </label>
                    <textarea
                      id={`otherComments-${guest.id}`}
                      value={responses[guest.id]?.otherComments || ''}
                      onChange={(e) => handleResponseChange(guest.id, 'otherComments', e.target.value)}
                      placeholder="Your notes here..."
                      className="w-full px-3 py-2 bg-[var(--navy-primary)] text-white rounded border border-[var(--rust-light)]"
                      rows={3}
                    />
                  </div>
                  {/* End of New Fields */}
                </div>
              </div>
            ))}
          </div>

          {/* BUTTONS CONTAINER: Handles mobile and desktop layouts */}
          <div className="pt-4 border-t border-gray-600 pb-4">

            {/* --- Mobile Layout (hidden on md and up) --- */}
            <div className="space-y-4 md:hidden">
              {/* Guest Navigation (Mobile: Top Row, if applicable) */}
              {selectedParty.partyMembers.length > 1 && (
                <div className="flex justify-between space-x-2">
                  <button
                    onClick={handlePrevGuest}
                    disabled={currentGuestCardIndex === 0}
                    className="w-1/2 bg-navy-600 hover:bg-navy-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous Guest
                  </button>
                  <button
                    onClick={handleNextGuest}
                    disabled={currentGuestCardIndex === selectedParty.partyMembers.length - 1}
                    className="w-1/2 bg-rust-500 hover:bg-rust-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Guest
                  </button>
                </div>
              )}
              {/* Action Buttons (Mobile: Bottom Row - Back to Search + Submit) */}
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedParty(null);
                    onPartySelectStateChange(false);
                    setSearchResults([]);
                    setCurrentGuestCardIndex(0);
                    setSearchName('');
                    setSearchError('');
                    if (typeof window !== 'undefined') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-150 shadow-md"
                >
                  Back to Search
                </button>
                {(currentGuestCardIndex === selectedParty.partyMembers.length - 1 || selectedParty.partyMembers.length === 1) && (
                  <button
                    onClick={handleSubmitClick}
                    disabled={isSubmitting}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-150 shadow-lg disabled:opacity-70"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
                  </button>
                )}
              </div>
            </div>

            {/* --- Desktop Layout (visible from md upwards) --- */}
            <div className="hidden md:flex md:w-full md:justify-between md:items-center">
              {/* Back to Search Button (Desktop: Left) */}
              <div>
                <button
                  onClick={() => {
                    setSelectedParty(null);
                    onPartySelectStateChange(false);
                    setSearchResults([]);
                    setCurrentGuestCardIndex(0);
                    setSearchName('');
                    setSearchError('');
                    if (typeof window !== 'undefined') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="w-full md:w-auto bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-150 shadow-md"
                >
                  Back to Search
                </button>
              </div>

              {/* Right Aligned Group (Desktop: Guest Nav + Submit) */}
              <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Guest Navigation (Desktop) */}
                {selectedParty.partyMembers.length > 1 && (
                  <div className="flex justify-between sm:justify-end sm:space-x-4">
                    <button
                      onClick={handlePrevGuest}
                      disabled={currentGuestCardIndex === 0}
                      className="w-1/2 sm:w-auto bg-navy-600 hover:bg-navy-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous Guest
                    </button>
                    <button
                      onClick={handleNextGuest}
                      disabled={currentGuestCardIndex === selectedParty.partyMembers.length - 1}
                      className="w-1/2 sm:w-auto bg-rust-500 hover:bg-rust-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next Guest
                    </button>
                  </div>
                )}
                {/* Submit Button (Desktop) */}
                {(currentGuestCardIndex === selectedParty.partyMembers.length - 1 || selectedParty.partyMembers.length === 1) && (
                  <div className="w-full sm:w-auto">
                    <button
                      onClick={handleSubmitClick}
                      disabled={isSubmitting}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-150 shadow-lg disabled:opacity-70"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit RSVP for All Guests'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Display search results - styled like mockup cards, now in a scrollable container */}
      {searchResults.length > 0 && !selectedParty && (
        <div className="w-full mx-auto">
          <div className="max-h-72 overflow-y-auto border border-gray-600 rounded-lg p-2 bg-gray-800/50 styled-scrollbar">
            <div className="space-y-3 pr-1">
              {searchResults.map((party) => (
                <div 
                  key={party.id} 
                  onClick={() => handlePartySelect(party)}
                  className="bg-gray-700 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-600 transition-colors duration-150 text-white"
                >
                  <p className="font-semibold mb-1">Party Members:</p>
                  {party.partyMembers.map(member => (
                    <p key={member.id} className="ml-2">{member.firstName} {member.lastName}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 