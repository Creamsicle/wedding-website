'use client';

import { useState, FormEvent } from 'react';
import { searchGuests, submitRSVP } from '@/lib/firebase/rsvp';
import type { GuestParty, RSVPResponse } from '@/lib/firebase/rsvp';
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchName.length < 2) {
      setSearchError('Please enter at least 2 characters');
      return;
    }
    
    try {
      setSearchError('');
      const results = await searchGuests(searchName);
      setSearchResults(results);
      if (results.length === 0) {
        setSearchError('No matches found. Please try a different name.');
      }
    } catch (error) {
      setSearchError('An error occurred while searching. Please try again.');
      console.error('Search error:', error);
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
        needsRideToWedding: false,
        canOfferRide: false,
      }
    }), {});
    setResponses(initialResponses);
    setCurrentGuestCardIndex(0); // Reset to first guest when a new party is selected
  };

  const handleResponseChange = (guestId: string, field: keyof RSVPResponse, value: ResponseFieldValue) => {
    setResponses(prev => ({
      ...prev,
      [guestId]: {
        ...prev[guestId],
        [field]: value
      }
    }));
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
      <div className="text-center card-hover p-8 rounded-lg shadow-lg">
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
    <div className="space-y-8 rsvp-form-container">
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
            />
            {searchError && (
              <p className="mt-2 text-sm text-red-400">{searchError}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-rust-500 hover:bg-rust-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-150 shadow-lg"
          >
            Search
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Scrollable container for all guest cards */}
          <div className="bg-gray-800/80 p-4 md:p-6 rounded-xl shadow-xl max-h-[70vh] overflow-y-auto styled-scrollbar space-y-6">
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
                    <>
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
                    </>
                  )}

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
                        placeholder="Please provide details on where you're coming from"
                        className="mt-2 w-full px-3 py-2 bg-[var(--navy-primary)] text-white rounded border border-[var(--rust-light)]"
                        rows={3}
                      />
                    )}
                  </div>

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
                        placeholder="Please provide details on where you're coming from and which event(s) you can offer rides to"
                        className="mt-2 w-full px-3 py-2 bg-[var(--navy-primary)] text-white rounded border border-[var(--rust-light)]"
                        rows={3}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Navigation for Guest Cards - now for all views if multiple guests */}
          {selectedParty.partyMembers.length > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentGuestCardIndex(prev => Math.max(0, prev - 1))}
                disabled={currentGuestCardIndex === 0}
                className="bg-navy-600 hover:bg-navy-500 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 transition-colors"
              >
                Previous Guest
              </button>
              <button
                onClick={() => setCurrentGuestCardIndex(prev => Math.min(selectedParty.partyMembers.length - 1, prev + 1))}
                disabled={currentGuestCardIndex === selectedParty.partyMembers.length - 1}
                className="bg-navy-600 hover:bg-navy-500 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 transition-colors"
              >
                Next Guest
              </button>
            </div>
          )}

          {/* Buttons outside the scrollable area */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
            <button
              onClick={() => {
                setSelectedParty(null);
                onPartySelectStateChange(false);
                setSearchResults([]);
                setCurrentGuestCardIndex(0);
              }}
              className="bg-[var(--navy-secondary)] hover:bg-[var(--navy-light)] text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Back to Search
            </button>
            <button
              onClick={handleSubmitClick}
              disabled={isSubmitting}
              className="bg-[var(--rust-primary)] hover:bg-[var(--rust-secondary)] text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
            </button>
          </div>
        </div>
      )}

      {/* Display search results - styled like mockup cards, now in a scrollable container */}
      {searchResults.length > 0 && !selectedParty && (
        <div className="max-w-md mx-auto"> {/* Container for centering the scroll box */}
          <div className="max-h-72 overflow-y-auto border border-gray-600 rounded-lg p-2 bg-gray-800/50 styled-scrollbar"> {/* Scrollable container */}
            <div className="space-y-3 pr-1"> {/* Inner spacing for items and scrollbar gap */}
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