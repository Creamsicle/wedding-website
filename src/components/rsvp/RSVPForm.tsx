'use client';

import { useState, FormEvent } from 'react';
import { searchGuests, submitRSVP } from '@/lib/firebase/rsvp';
import type { GuestParty, Guest, RSVPResponse } from '@/lib/firebase/rsvp';

type ResponseFieldValue = string | boolean;

interface FormData {
  firstName: string;
  lastName: string;
  partyId: string;
  rsvpResponse: RSVPResponse;
}

export function RSVPForm() {
  const [searchName, setSearchName] = useState('');
  const [searchResults, setSearchResults] = useState<GuestParty[]>([]);
  const [selectedParty, setSelectedParty] = useState<GuestParty | null>(null);
  const [responses, setResponses] = useState<{ [key: string]: RSVPResponse }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchError, setSearchError] = useState('');

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
    <div className="space-y-8">
      {!selectedParty ? (
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-lg bg-[var(--navy-secondary)] text-white border border-[var(--rust-light)] focus:outline-none focus:ring-2 focus:ring-[var(--rust-primary)]"
              min={2}
            />
            {searchError && (
              <p className="mt-2 text-red-500">{searchError}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-[var(--rust-primary)] hover:bg-[var(--rust-secondary)] text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Search
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="card-hover p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">RSVP for Your Party</h3>
            {selectedParty.partyMembers.map((guest) => (
              <div key={guest.id} className="mb-8 p-4 border border-[var(--rust-light)] rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-4">
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

          <div className="flex justify-between">
            <button
              onClick={() => {
                setSelectedParty(null);
                setSearchResults([]);
              }}
              className="bg-[var(--navy-secondary)] hover:bg-[var(--navy-light)] text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Back to Search
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[var(--rust-primary)] hover:bg-[var(--rust-secondary)] text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
            </button>
          </div>
        </div>
      )}

      {searchResults.length > 0 && !selectedParty && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-white mb-4">Search Results</h3>
          <div className="space-y-4">
            {searchResults.map((party) => (
              <button
                key={party.id}
                onClick={() => handlePartySelect(party)}
                className="w-full text-left p-4 card-hover hover:bg-[var(--navy-light)] rounded-lg transition-colors"
              >
                <div className="text-white">
                  <strong>Party Members:</strong>
                  <div className="ml-4">
                    {party.partyMembers.map((member) => (
                      <div key={member.id}>
                        {member.firstName} {member.lastName}
                      </div>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 