'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Guest, RSVPResponse } from '@/lib/firebase/rsvp';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface GuestWithResponse extends Guest {
  rsvpResponse?: RSVPResponse;
}

interface PartyStats {
  totalGuests: number;
  responded: number;
  hinduCeremonyAttending: number;
  weddingReceptionAttending: number;
  mealPreferences: {
    Chicken: number;
    Steak: number;
    'Vegetarian Risotto': number;
  };
  needsTransportation: {
    hinduCeremony: number;
    weddingReception: number;
  };
  canOfferRide: number;
}

interface Filters {
  name: string;
  party: string;
  hinduCeremony: string;
  wedding: string;
  meal: string;
  transportation: string;
  sortBy: 'name' | 'party' | 'responseDate' | 'none';
  sortDirection: 'asc' | 'desc';
  dateRange: {
    start: string;
    end: string;
  };
}

export default function Dashboard() {
  const [guests, setGuests] = useState<GuestWithResponse[]>([]);
  const [filteredGuests, setFilteredGuests] = useState<GuestWithResponse[]>([]);
  const [filters, setFilters] = useState<Filters>({
    name: '',
    party: '',
    hinduCeremony: 'all',
    wedding: 'all',
    meal: 'all',
    transportation: 'all',
    sortBy: 'none',
    sortDirection: 'desc',
    dateRange: {
      start: '',
      end: ''
    }
  });
  const [stats, setStats] = useState<PartyStats>({
    totalGuests: 0,
    responded: 0,
    hinduCeremonyAttending: 0,
    weddingReceptionAttending: 0,
    mealPreferences: {
      Chicken: 0,
      Steak: 0,
      'Vegetarian Risotto': 0
    },
    needsTransportation: {
      hinduCeremony: 0,
      weddingReception: 0
    },
    canOfferRide: 0
  });

  useEffect(() => {
    const guestsRef = collection(db, 'guests');
    const q = query(guestsRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const guestList: GuestWithResponse[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.firstName?.trim() || data.lastName?.trim()) {
          const guest = { 
            id: doc.id, 
            ...data,
            firstName: data.firstName?.trim() || '',
            lastName: data.lastName?.trim() || '',
            partyId: data.partyId || 'Unassigned'
          } as GuestWithResponse;
          guestList.push(guest);
        }
      });
      setGuests(guestList);
    });

    return () => unsubscribe();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...guests];

    // Apply date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter(guest => {
        if (!guest.rsvpResponse?.timestamp) return false;
        const responseDate = new Date(guest.rsvpResponse.timestamp);
        const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : new Date(0);
        const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : new Date(8640000000000000);
        return responseDate >= startDate && responseDate <= endDate;
      });
    }

    // Apply text filters
    if (filters.name) {
      const searchTerm = filters.name.toLowerCase();
      filtered = filtered.filter(guest => 
        `${guest.firstName} ${guest.lastName}`.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.party) {
      const searchTerm = filters.party.toLowerCase();
      filtered = filtered.filter(guest => 
        guest.partyId.toLowerCase().includes(searchTerm)
      );
    }

    // Apply dropdown filters
    if (filters.hinduCeremony !== 'all') {
      filtered = filtered.filter(guest => {
        if (filters.hinduCeremony === 'attending') return guest.rsvpResponse?.hinduCeremonyAttending;
        if (filters.hinduCeremony === 'not-attending') return guest.rsvpResponse?.hinduCeremonyAttending === false;
        return !guest.rsvpResponse;
      });
    }

    if (filters.wedding !== 'all') {
      filtered = filtered.filter(guest => {
        if (filters.wedding === 'attending') return guest.rsvpResponse?.weddingReceptionAttending;
        if (filters.wedding === 'not-attending') return guest.rsvpResponse?.weddingReceptionAttending === false;
        return !guest.rsvpResponse;
      });
    }

    if (filters.meal !== 'all') {
      filtered = filtered.filter(guest => guest.rsvpResponse?.mealPreference === filters.meal);
    }

    if (filters.transportation !== 'all') {
      filtered = filtered.filter(guest => {
        switch (filters.transportation) {
          case 'needs-hindu':
            return guest.rsvpResponse?.needsRideToHinduCeremony;
          case 'needs-wedding':
            return guest.rsvpResponse?.needsRideToWedding;
          case 'offering':
            return guest.rsvpResponse?.canOfferRide;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    if (filters.sortBy !== 'none') {
      filtered.sort((a, b) => {
        let comparison = 0;
        switch (filters.sortBy) {
          case 'name':
            comparison = `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`);
            break;
          case 'party':
            comparison = a.partyId.localeCompare(b.partyId);
            break;
          case 'responseDate':
            const dateA = a.rsvpResponse?.timestamp?.getTime() || 0;
            const dateB = b.rsvpResponse?.timestamp?.getTime() || 0;
            comparison = dateA - dateB;
            break;
        }
        return filters.sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    setFilteredGuests(filtered);

    // Update stats based on filtered guests
    const newStats: PartyStats = {
      totalGuests: filtered.length,
      responded: filtered.filter(g => g.rsvpResponse).length,
      hinduCeremonyAttending: filtered.filter(g => g.rsvpResponse?.hinduCeremonyAttending).length,
      weddingReceptionAttending: filtered.filter(g => g.rsvpResponse?.weddingReceptionAttending).length,
      mealPreferences: {
        Chicken: filtered.filter(g => g.rsvpResponse?.mealPreference === 'Chicken').length,
        Steak: filtered.filter(g => g.rsvpResponse?.mealPreference === 'Steak').length,
        'Vegetarian Risotto': filtered.filter(g => g.rsvpResponse?.mealPreference === 'Vegetarian Risotto').length
      },
      needsTransportation: {
        hinduCeremony: filtered.filter(g => g.rsvpResponse?.needsRideToHinduCeremony).length,
        weddingReception: filtered.filter(g => g.rsvpResponse?.needsRideToWedding).length
      },
      canOfferRide: filtered.filter(g => g.rsvpResponse?.canOfferRide).length
    };
    setStats(newStats);
  }, [guests, filters]);

  const exportToCSV = () => {
    const headers = [
      'First Name',
      'Last Name',
      'Party',
      'Hindu Ceremony',
      'Wedding Reception',
      'Meal Preference',
      'Dietary Restrictions',
      'Needs Ride (Hindu)',
      'Needs Ride (Wedding)',
      'Can Offer Ride',
      'Response Date'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredGuests.map(guest => [
        guest.firstName,
        guest.lastName,
        guest.partyId,
        guest.rsvpResponse?.hinduCeremonyAttending ? 'Yes' : guest.rsvpResponse ? 'No' : 'No Response',
        guest.rsvpResponse?.weddingReceptionAttending ? 'Yes' : guest.rsvpResponse ? 'No' : 'No Response',
        guest.rsvpResponse?.mealPreference || 'Not Selected',
        `"${guest.rsvpResponse?.dietaryRestrictions || ''}"`,
        guest.rsvpResponse?.needsRideToHinduCeremony ? 'Yes' : 'No',
        guest.rsvpResponse?.needsRideToWedding ? 'Yes' : 'No',
        guest.rsvpResponse?.canOfferRide ? 'Yes' : 'No',
        guest.rsvpResponse?.timestamp ? new Date(guest.rsvpResponse.timestamp).toLocaleDateString() : 'No Response'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `wedding-rsvps-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    // Open a new window with a printable version of the dashboard
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const styles = `
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; }
        h1, h2 { color: #333; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
        @media print {
          body { margin: 0; }
          button { display: none; }
        }
      </style>
    `;

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Wedding RSVP Dashboard - ${new Date().toLocaleDateString()}</title>
          ${styles}
        </head>
        <body>
          <h1>Wedding RSVP Dashboard</h1>
          <p>Generated on ${new Date().toLocaleString()}</p>
          
          <h2>Overall Statistics</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <h3>Total Guests</h3>
              <p>${stats.totalGuests} (${stats.responded} responded)</p>
            </div>
            <div class="stat-card">
              <h3>Hindu Ceremony</h3>
              <p>${stats.hinduCeremonyAttending} attending</p>
            </div>
            <div class="stat-card">
              <h3>Wedding Reception</h3>
              <p>${stats.weddingReceptionAttending} attending</p>
            </div>
            <div class="stat-card">
              <h3>Transportation</h3>
              <p>${stats.needsTransportation.hinduCeremony + stats.needsTransportation.weddingReception} need rides</p>
              <p>${stats.canOfferRide} can offer rides</p>
            </div>
          </div>

          <h2>Meal Preferences</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <h3>Chicken</h3>
              <p>${stats.mealPreferences.Chicken}</p>
            </div>
            <div class="stat-card">
              <h3>Steak</h3>
              <p>${stats.mealPreferences.Steak}</p>
            </div>
            <div class="stat-card">
              <h3>Vegetarian Risotto</h3>
              <p>${stats.mealPreferences['Vegetarian Risotto']}</p>
            </div>
          </div>

          <h2>Guest List</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Party</th>
                <th>Hindu Ceremony</th>
                <th>Wedding</th>
                <th>Meal</th>
                <th>Dietary Restrictions</th>
                <th>Transportation</th>
                <th>Response Date</th>
              </tr>
            </thead>
            <tbody>
              ${filteredGuests.map(guest => `
                <tr>
                  <td>${guest.firstName} ${guest.lastName}</td>
                  <td>${guest.partyId}</td>
                  <td>${guest.rsvpResponse ? (guest.rsvpResponse.hinduCeremonyAttending ? '✓' : '✗') : '-'}</td>
                  <td>${guest.rsvpResponse ? (guest.rsvpResponse.weddingReceptionAttending ? '✓' : '✗') : '-'}</td>
                  <td>${guest.rsvpResponse?.mealPreference || '-'}</td>
                  <td>${guest.rsvpResponse?.dietaryRestrictions || '-'}</td>
                  <td>${[
                    guest.rsvpResponse?.needsRideToHinduCeremony ? 'Hindu: Needs Ride' : '',
                    guest.rsvpResponse?.needsRideToWedding ? 'Wedding: Needs Ride' : '',
                    guest.rsvpResponse?.canOfferRide ? 'Can Offer Ride' : ''
                  ].filter(Boolean).join(', ') || '-'}</td>
                  <td>${guest.rsvpResponse?.timestamp ? new Date(guest.rsvpResponse.timestamp).toLocaleDateString() : '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            window.onload = () => window.print();
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
  };

  // Chart configurations
  const attendanceChartData = {
    labels: ['Hindu Ceremony', 'Wedding Reception'],
    datasets: [
      {
        label: 'Attending Guests',
        data: [stats.hinduCeremonyAttending, stats.weddingReceptionAttending],
        backgroundColor: [
          'rgba(212, 132, 106, 0.8)', // rust-primary with opacity
          'rgba(194, 107, 77, 0.8)',  // rust-secondary with opacity
        ],
        borderColor: [
          'rgba(212, 132, 106, 1)',
          'rgba(194, 107, 77, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const mealPreferencesChartData = {
    labels: ['Chicken', 'Steak', 'Vegetarian Risotto'],
    datasets: [
      {
        data: [
          stats.mealPreferences.Chicken,
          stats.mealPreferences.Steak,
          stats.mealPreferences['Vegetarian Risotto'],
        ],
        backgroundColor: [
          'rgba(227, 156, 134, 0.8)', // rust-light with opacity
          'rgba(212, 132, 106, 0.8)', // rust-primary with opacity
          'rgba(194, 107, 77, 0.8)',  // rust-secondary with opacity
        ],
        borderColor: [
          'rgba(227, 156, 134, 1)',
          'rgba(212, 132, 106, 1)',
          'rgba(194, 107, 77, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const transportationChartData = {
    labels: ['Hindu Ceremony', 'Wedding Reception', 'Can Offer Rides'],
    datasets: [
      {
        label: 'Transportation Needs',
        data: [
          stats.needsTransportation.hinduCeremony,
          stats.needsTransportation.weddingReception,
          stats.canOfferRide,
        ],
        backgroundColor: [
          'rgba(30, 58, 117, 0.8)',  // navy-light with opacity
          'rgba(21, 42, 84, 0.8)',   // navy-secondary with opacity
          'rgba(10, 26, 59, 0.8)',   // navy-primary with opacity
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'white',
        },
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-[var(--navy-primary)] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">RSVP Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={exportToCSV}
              className="bg-[var(--rust-primary)] hover:bg-[var(--rust-secondary)] text-white px-4 py-2 rounded"
            >
              Export CSV
            </button>
            <button
              onClick={exportToPDF}
              className="bg-[var(--rust-primary)] hover:bg-[var(--rust-secondary)] text-white px-4 py-2 rounded"
            >
              Print PDF
            </button>
            <select 
              className="bg-[var(--navy-secondary)] text-white border border-[var(--rust-light)] rounded px-3 py-1"
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as Filters['sortBy'] }))}
            >
              <option value="none">Sort by...</option>
              <option value="name">Name</option>
              <option value="party">Party</option>
              <option value="responseDate">Response Date</option>
            </select>
            <select 
              className="bg-[var(--navy-secondary)] text-white border border-[var(--rust-light)] rounded px-3 py-1"
              value={filters.sortDirection}
              onChange={(e) => setFilters(prev => ({ ...prev, sortDirection: e.target.value as 'asc' | 'desc' }))}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-[var(--navy-secondary)] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Event Attendance</h2>
            <div className="h-64">
              <Bar data={attendanceChartData} options={barChartOptions} />
            </div>
          </div>
          
          <div className="bg-[var(--navy-secondary)] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Meal Preferences</h2>
            <div className="h-64">
              <Pie data={mealPreferencesChartData} options={chartOptions} />
            </div>
          </div>
          
          <div className="bg-[var(--navy-secondary)] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Transportation</h2>
            <div className="h-64">
              <Bar data={transportationChartData} options={barChartOptions} />
            </div>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Guests"
            value={stats.totalGuests}
            subtext={`${stats.responded} responded`}
          />
          <StatCard
            title="Hindu Ceremony"
            value={stats.hinduCeremonyAttending}
            subtext={`${((stats.hinduCeremonyAttending / stats.responded) * 100).toFixed(1)}% of responses`}
          />
          <StatCard
            title="Wedding Reception"
            value={stats.weddingReceptionAttending}
            subtext={`${((stats.weddingReceptionAttending / stats.responded) * 100).toFixed(1)}% of responses`}
          />
          <StatCard
            title="Need Transportation"
            value={stats.needsTransportation.hinduCeremony + stats.needsTransportation.weddingReception}
            subtext={`${stats.canOfferRide} can offer rides`}
          />
        </div>

        {/* Meal Preferences */}
        <div className="bg-[var(--navy-secondary)] rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Meal Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Chicken"
              value={stats.mealPreferences.Chicken}
              subtext={`${((stats.mealPreferences.Chicken / stats.responded) * 100).toFixed(1)}%`}
            />
            <StatCard
              title="Steak"
              value={stats.mealPreferences.Steak}
              subtext={`${((stats.mealPreferences.Steak / stats.responded) * 100).toFixed(1)}%`}
            />
            <StatCard
              title="Vegetarian Risotto"
              value={stats.mealPreferences['Vegetarian Risotto']}
              subtext={`${((stats.mealPreferences['Vegetarian Risotto'] / stats.responded) * 100).toFixed(1)}%`}
            />
          </div>
        </div>

        {/* Guest List */}
        <div className="bg-[var(--navy-secondary)] rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Guest Responses</h2>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by name..."
              className="bg-[var(--navy-light)] text-white border border-[var(--rust-light)] rounded px-3 py-1"
              value={filters.name}
              onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Search by party..."
              className="bg-[var(--navy-light)] text-white border border-[var(--rust-light)] rounded px-3 py-1"
              value={filters.party}
              onChange={(e) => setFilters(prev => ({ ...prev, party: e.target.value }))}
            />
            <select
              className="bg-[var(--navy-light)] text-white border border-[var(--rust-light)] rounded px-3 py-1"
              value={filters.hinduCeremony}
              onChange={(e) => setFilters(prev => ({ ...prev, hinduCeremony: e.target.value }))}
            >
              <option value="all">Hindu Ceremony - All</option>
              <option value="attending">Attending</option>
              <option value="not-attending">Not Attending</option>
              <option value="no-response">No Response</option>
            </select>
            <select
              className="bg-[var(--navy-light)] text-white border border-[var(--rust-light)] rounded px-3 py-1"
              value={filters.wedding}
              onChange={(e) => setFilters(prev => ({ ...prev, wedding: e.target.value }))}
            >
              <option value="all">Wedding - All</option>
              <option value="attending">Attending</option>
              <option value="not-attending">Not Attending</option>
              <option value="no-response">No Response</option>
            </select>
            <select
              className="bg-[var(--navy-light)] text-white border border-[var(--rust-light)] rounded px-3 py-1"
              value={filters.meal}
              onChange={(e) => setFilters(prev => ({ ...prev, meal: e.target.value }))}
            >
              <option value="all">Meal - All</option>
              <option value="Chicken">Chicken</option>
              <option value="Steak">Steak</option>
              <option value="Vegetarian Risotto">Vegetarian Risotto</option>
            </select>
            <select
              className="bg-[var(--navy-light)] text-white border border-[var(--rust-light)] rounded px-3 py-1"
              value={filters.transportation}
              onChange={(e) => setFilters(prev => ({ ...prev, transportation: e.target.value }))}
            >
              <option value="all">Transportation - All</option>
              <option value="needs-hindu">Needs Ride (Hindu)</option>
              <option value="needs-wedding">Needs Ride (Wedding)</option>
              <option value="offering">Offering Rides</option>
            </select>
            
            {/* Date Range Filters */}
            <div className="col-span-2 flex gap-2 items-center">
              <input
                type="date"
                className="bg-[var(--navy-light)] text-white border border-[var(--rust-light)] rounded px-3 py-1"
                value={filters.dateRange.start}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  dateRange: { ...prev.dateRange, start: e.target.value }
                }))}
              />
              <span>to</span>
              <input
                type="date"
                className="bg-[var(--navy-light)] text-white border border-[var(--rust-light)] rounded px-3 py-1"
                value={filters.dateRange.end}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  dateRange: { ...prev.dateRange, end: e.target.value }
                }))}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-[var(--rust-light)]">
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Party</th>
                  <th className="py-2 px-4">Hindu Ceremony</th>
                  <th className="py-2 px-4">Wedding</th>
                  <th className="py-2 px-4">Meal</th>
                  <th className="py-2 px-4">Dietary Restrictions</th>
                  <th className="py-2 px-4">Transportation</th>
                  <th className="py-2 px-4">Response Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.map((guest) => (
                  <tr key={guest.id} className="border-b border-[var(--navy-light)]">
                    <td className="py-2 px-4">{guest.firstName} {guest.lastName}</td>
                    <td className="py-2 px-4">{guest.partyId}</td>
                    <td className="py-2 px-4">
                      {guest.rsvpResponse ? (guest.rsvpResponse.hinduCeremonyAttending ? '✓' : '✗') : '-'}
                    </td>
                    <td className="py-2 px-4">
                      {guest.rsvpResponse ? (guest.rsvpResponse.weddingReceptionAttending ? '✓' : '✗') : '-'}
                    </td>
                    <td className="py-2 px-4">{guest.rsvpResponse?.mealPreference || '-'}</td>
                    <td className="py-2 px-4">{guest.rsvpResponse?.dietaryRestrictions || '-'}</td>
                    <td className="py-2 px-4">
                      {guest.rsvpResponse?.needsRideToHinduCeremony && 'Hindu: Needs Ride'}
                      {guest.rsvpResponse?.needsRideToWedding && 'Wedding: Needs Ride'}
                      {guest.rsvpResponse?.canOfferRide && 'Can Offer Ride'}
                      {!guest.rsvpResponse?.needsRideToHinduCeremony && 
                       !guest.rsvpResponse?.needsRideToWedding && 
                       !guest.rsvpResponse?.canOfferRide && '-'}
                    </td>
                    <td className="py-2 px-4">
                      {guest.rsvpResponse?.timestamp ? 
                        new Date(guest.rsvpResponse.timestamp).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtext }: { title: string; value: number; subtext: string }) {
  return (
    <div className="bg-[var(--navy-light)] rounded-lg p-4">
      <h3 className="text-lg font-semibold text-[var(--rust-light)]">{title}</h3>
      <div className="text-3xl font-bold mt-2">{value}</div>
      <div className="text-sm text-[var(--rust-light)] mt-1">{subtext}</div>
    </div>
  );
} 