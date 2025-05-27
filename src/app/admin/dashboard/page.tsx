'use client';

import { useState, useEffect, useRef } from 'react';
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
import {
  ArrowUpDown, ArrowUp, ArrowDown
} from 'lucide-react';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define the keys that can be sorted
type SortableKey = 
  | 'fullName' 
  | 'physicalAddressPresent'
  | 'responseTimestamp' 
  | 'rsvpResponse.email' 
  | 'rsvpResponse.hinduCeremonyAttending' 
  | 'rsvpResponse.weddingReceptionAttending' 
  | 'rsvpResponse.mealPreference' 
  | 'rsvpResponse.dietaryRestrictions' 
  | 'rsvpResponse.needsRideToHinduCeremony' 
  | 'rsvpResponse.needsRideToWedding' 
  | 'rsvpResponse.canOfferRide' 
  | 'none';

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
  sortBy: SortableKey;
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

  // Refs for synchronized scrolling and table
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const topScrollBarRef = useRef<HTMLDivElement>(null);
  const topScrollBarInnerRef = useRef<HTMLDivElement>(null);

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
        const responseTimestamp = guest.rsvpResponse.timestamp;
        // Ensure timestamp is a Firestore Timestamp and has toDate method
        const responseDate = responseTimestamp && typeof responseTimestamp.toDate === 'function' ? responseTimestamp.toDate() : null;
        if (!responseDate) return false;

        const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : new Date(0);
        const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : new Date(8640000000000000); // Max Date
        
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        
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
        const valA = getSortableValue(a, filters.sortBy);
        const valB = getSortableValue(b, filters.sortBy);

        // Handle nulls consistently: items with null values go to the end for ascending sort.
        if (valA === null && valB === null) {
          comparison = 0;
        } else if (valA === null) {
          comparison = 1; // valA is greater (comes after non-null valB)
        } else if (valB === null) {
          comparison = -1; // valB is greater (comes after non-null valA)
        } else {
          // Actual comparison for non-null values
          if (typeof valA === 'string' && typeof valB === 'string') {
            comparison = valA.localeCompare(valB); // localeCompare handles string sorting well
          } else if (typeof valA === 'number' && typeof valB === 'number') {
            comparison = valA - valB;
          } else if (typeof valA === 'boolean' && typeof valB === 'boolean') {
            // true sorts before false in ascending order
            comparison = (valA === valB) ? 0 : (valA ? -1 : 1); 
          }
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
        Chicken: filtered.filter(g => g.rsvpResponse?.weddingReceptionAttending && g.rsvpResponse?.mealPreference === 'Chicken').length,
        Steak: filtered.filter(g => g.rsvpResponse?.weddingReceptionAttending && g.rsvpResponse?.mealPreference === 'Steak').length,
        'Vegetarian Risotto': filtered.filter(g => g.rsvpResponse?.weddingReceptionAttending && g.rsvpResponse?.mealPreference === 'Vegetarian Risotto').length
      },
      needsTransportation: {
        hinduCeremony: filtered.filter(g => g.rsvpResponse?.needsRideToHinduCeremony).length,
        weddingReception: filtered.filter(g => g.rsvpResponse?.needsRideToWedding).length
      },
      canOfferRide: filtered.filter(g => g.rsvpResponse?.canOfferRide).length
    };
    setStats(newStats);
  }, [guests, filters]);

  // Effect for synchronizing scrollbars and setting top scrollbar width
  useEffect(() => {
    const tableContainer = tableContainerRef.current;
    const topScroll = topScrollBarRef.current;
    const topScrollInner = topScrollBarInnerRef.current;

    if (tableContainer && topScroll && topScrollInner) {
      const setTopScrollWidth = () => {
        if (tableContainer.scrollWidth > tableContainer.clientWidth) {
            topScrollInner.style.width = `${tableContainer.scrollWidth}px`;
            topScroll.style.display = 'block'; // Show scrollbar if needed
        } else {
            topScroll.style.display = 'none'; // Hide if not needed
        }
      };

      setTopScrollWidth(); // Initial set

      const handleTopScroll = () => {
        if (tableContainer.scrollLeft !== topScroll.scrollLeft) {
          tableContainer.scrollLeft = topScroll.scrollLeft;
        }
      };

      const handleTableScroll = () => {
        if (topScroll.scrollLeft !== tableContainer.scrollLeft) {
          topScroll.scrollLeft = tableContainer.scrollLeft;
        }
      };

      topScroll.addEventListener('scroll', handleTopScroll);
      tableContainer.addEventListener('scroll', handleTableScroll);

      const resizeObserver = new ResizeObserver(() => {
        setTopScrollWidth();
      });
      resizeObserver.observe(tableContainer); // Observe the table container for width changes
      // Observe children of table container if direct observation is not enough
      // For example, observe the table element itself if it's a direct child
      if (tableContainer.firstChild) {
        resizeObserver.observe(tableContainer.firstChild as Element);
      }


      return () => {
        topScroll.removeEventListener('scroll', handleTopScroll);
        tableContainer.removeEventListener('scroll', handleTableScroll);
        resizeObserver.disconnect(); // Disconnect observer
      };
    }
  }, [filteredGuests]); // Re-run when filteredGuests changes, as table width might change

  const exportToCSV = () => {
    const headers = [
      'First Name',
      'Last Name',
      'Party ID',
      'Response Date',
      'Email',
      'Physical Address',
      'Hindu Ceremony',
      'Wedding Reception',
      'Meal Preference',
      'Dietary Restrictions',
      'Need Ride (Fri)',
      'Need Ride (Sat)',
      'Can Offer Ride'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredGuests.map(guest => {
        const rsvp = guest.rsvpResponse;
        const physicalAddress = rsvp?.physicalAddress;
        const formattedAddress = physicalAddress ? 
          `${physicalAddress.street || ''}, ${physicalAddress.city || ''}, ${physicalAddress.province || ''}, ${physicalAddress.postalCode || ''}, ${physicalAddress.country || ''}`.replace(/, , /g, ', ').replace(/^, |, $/g, '') : '';
        const responseDateString = rsvp?.timestamp && typeof rsvp.timestamp.toDate === 'function' 
          ? rsvp.timestamp.toDate().toLocaleDateString() 
          : '-';
        const mealPreferenceDisplay = rsvp?.weddingReceptionAttending ? (rsvp?.mealPreference || '-') : 'N/A';
        return [
          guest.firstName,
          guest.lastName,
          guest.partyId,
          responseDateString,
          `"${rsvp?.email || ''}"`,
          `"${formattedAddress}"`,
          rsvp ? (rsvp.hinduCeremonyAttending ? 'Yes' : 'No') : '-',
          rsvp ? (rsvp.weddingReceptionAttending ? 'Yes' : 'No') : '-',
          mealPreferenceDisplay,
          `"${rsvp?.dietaryRestrictions || ''}"`,
          rsvp?.needsRideToHinduCeremony ? 'Yes' : 'No',
          rsvp?.needsRideToWedding ? 'Yes' : 'No',
          rsvp?.canOfferRide ? 'Yes' : 'No'
        ].join(',');
      })
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
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 10px; }
        th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }
        th { background-color: #f5f5f5; }
        h1, h2 { color: #333; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 15px; margin-bottom: 15px; }
        .stat-card { border: 1px solid #ddd; padding: 10px; border-radius: 8px; }
        @media print {
          body { margin: 0; font-size: 9pt; }
          button { display: none; }
          table { font-size: 8pt; }
          th, td { padding: 3px; }
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
                <th>Party ID</th>
                <th>Response Date</th>
                <th>Email</th>
                <th>Physical Address</th>
                <th>Hindu Ceremony</th>
                <th>Wedding</th>
                <th>Meal</th>
                <th>Dietary Restrictions</th>
                <th>Need Ride (Fri)</th>
                <th>Need Ride (Sat)</th>
                <th>Can Offer Ride</th>
              </tr>
            </thead>
            <tbody>
              ${filteredGuests.map(guest => {
                const rsvp = guest.rsvpResponse;
                const physicalAddress = rsvp?.physicalAddress;
                const formattedAddress = physicalAddress ? 
                  `${physicalAddress.street || ''}, ${physicalAddress.city || ''}, ${physicalAddress.province || ''}, ${physicalAddress.postalCode || ''}, ${physicalAddress.country || ''}`.replace(/, , /g, ', ').replace(/^, |, $/g, '') : '';
                const responseDateStringPDF = rsvp?.timestamp && typeof rsvp.timestamp.toDate === 'function'
                  ? rsvp.timestamp.toDate().toLocaleDateString()
                  : '-';
                const mealPreferenceDisplayPDF = rsvp?.weddingReceptionAttending ? (rsvp?.mealPreference || '-') : 'N/A';
                return `
                <tr>
                  <td>${guest.firstName} ${guest.lastName}</td>
                  <td>${guest.partyId}</td>
                  <td>${responseDateStringPDF}</td>
                  <td>${rsvp?.email || '-'}</td>
                  <td>${formattedAddress}</td>
                  <td>${rsvp ? (rsvp.hinduCeremonyAttending ? '✓ Yes' : '✗ No') : '-'}</td>
                  <td>${rsvp ? (rsvp.weddingReceptionAttending ? '✓ Yes' : '✗ No') : '-'}</td>
                  <td>${mealPreferenceDisplayPDF}</td>
                  <td>${rsvp?.dietaryRestrictions || '-'}</td>
                  <td>${rsvp ? (rsvp.needsRideToHinduCeremony ? '✓ Yes' : '✗ No') : '-'}</td>
                  <td>${rsvp ? (rsvp.needsRideToWedding ? '✓ Yes' : '✗ No') : '-'}</td>
                  <td>${rsvp ? (rsvp.canOfferRide ? '✓ Yes' : '✗ No') : '-'}</td>
                </tr>
              `;
              }).join('')}
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
          stepSize: 1, // Ensure integer ticks for counts
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

  const handleSort = (key: SortableKey) => {
    setFilters(prev => {
      if (prev.sortBy === key) {
        // Clicked on the same column
        if (prev.sortDirection === 'asc') {
          // Was ascending, change to descending
          return { ...prev, sortDirection: 'desc' };
        } else {
          // Was descending, change to neutral (none)
          // Reset direction to asc for next sort, or keep as is, user preference. 'asc' is common.
          return { ...prev, sortBy: 'none', sortDirection: 'asc' }; 
        }
      } else {
        // Clicked on a new column, sort ascending by default
        return { ...prev, sortBy: key, sortDirection: 'asc' };
      }
    });
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
          <h2 className="text-xl font-semibold mb-4">Meal Preferences (Wedding Attendees)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Chicken"
              value={stats.mealPreferences.Chicken}
              subtext={`${((stats.mealPreferences.Chicken / stats.weddingReceptionAttending) * 100 || 0).toFixed(1)}%`}
            />
            <StatCard
              title="Steak"
              value={stats.mealPreferences.Steak}
              subtext={`${((stats.mealPreferences.Steak / stats.weddingReceptionAttending) * 100 || 0).toFixed(1)}%`}
            />
            <StatCard
              title="Vegetarian Risotto"
              value={stats.mealPreferences['Vegetarian Risotto']}
              subtext={`${((stats.mealPreferences['Vegetarian Risotto'] / stats.weddingReceptionAttending) * 100 || 0).toFixed(1)}%`}
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
              <option value="N/A">N/A (Not Attending Wedding)</option>
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

          {/* New Top Scrollbar - Placed inside the card, before the table container */}
          <div ref={topScrollBarRef} className="overflow-x-auto styled-scrollbar mb-1" style={{ height: '18px', display: 'none' }}>
            <div ref={topScrollBarInnerRef} style={{ height: '1px' }}></div>
          </div>

          <div ref={tableContainerRef} className="overflow-x-auto styled-scrollbar">
            <table className="min-w-full divide-y divide-[var(--navy-light)]">
              <thead className="bg-[var(--navy-dark)] sticky top-0 z-10"><tr>{/* Table Header Row, sticky, with click handlers and no whitespace before <tr> */}
                  {[
                    { label: 'Name', key: 'fullName' }, 
                    { label: 'Response Date', key: 'responseTimestamp' },
                    { label: 'Email', key: 'rsvpResponse.email' },
                    { label: 'Hindu Ceremony', key: 'rsvpResponse.hinduCeremonyAttending' },
                    { label: 'Wedding Reception', key: 'rsvpResponse.weddingReceptionAttending' },
                    { label: 'Meal', key: 'rsvpResponse.mealPreference' },
                    { label: 'Dietary Restrictions', key: 'rsvpResponse.dietaryRestrictions'},
                    { label: 'Needs Ride (Fri)', key: 'rsvpResponse.needsRideToHinduCeremony'},
                    { label: 'Needs Ride (Sat)', key: 'rsvpResponse.needsRideToWedding'},
                    { label: 'Can Offer Ride', key: 'rsvpResponse.canOfferRide'},
                    { label: 'Address?', key: 'physicalAddressPresent' }
                  ].map((header, index, arr) => (
                    <th 
                      key={header.key}
                      scope="col" 
                      className={`px-4 py-3 text-left text-xs font-medium text-[var(--rust-light)] uppercase tracking-wider cursor-pointer ${
                        index === 0 ? 'sticky left-0 z-20 bg-[var(--navy-dark)]' : ''
                      }`}
                      onClick={() => handleSort(header.key as SortableKey)}
                      style={index === 0 ? { minWidth: '150px' } : (header.key === 'physicalAddressPresent' ? { width: '80px' } : {})}
                    >
                      <div className="flex items-center">
                        {header.label}
                        {filters.sortBy === header.key ? (
                          filters.sortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
                        ) : (
                          <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                        )}
                      </div>
                    </th>
                  ))}
              </tr></thead>{/* End of Table Header Row and Thead without trailing whitespace */}
              <tbody className="bg-[var(--navy-secondary)] divide-y divide-[var(--navy-light)]">
                {filteredGuests.map((guest) => {
                  const rsvp = guest.rsvpResponse;
                  const responseDateDisplay = rsvp?.timestamp && typeof rsvp.timestamp.toDate === 'function' 
                                            ? rsvp.timestamp.toDate().toLocaleDateString() 
                                            : 'No Response';
                  const mealPreferenceDisplay = rsvp?.weddingReceptionAttending ? (rsvp?.mealPreference || 'Not Selected') : 'N/A';
                  const physicalAddress = rsvp?.physicalAddress;
                  const formattedAddress = physicalAddress ? 
                    `${physicalAddress.street || ''}${physicalAddress.street && (physicalAddress.city || physicalAddress.province || physicalAddress.postalCode || physicalAddress.country) ? ', ' : ''}${physicalAddress.city || ''}${physicalAddress.city && (physicalAddress.province || physicalAddress.postalCode || physicalAddress.country) ? ', ' : ''}${physicalAddress.province || ''}${physicalAddress.province && (physicalAddress.postalCode || physicalAddress.country) ? ', ' : ''}${physicalAddress.postalCode || ''}${physicalAddress.postalCode && physicalAddress.country ? ', ' : ''}${physicalAddress.country || ''}`
                    .replace(/ , $/g, '').replace(/, ,/g, ', ').trim() : '';
                  
                  return (
                    <tr key={guest.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm sticky left-0 z-10 bg-[var(--navy-secondary)]">
                        {guest.firstName} {guest.lastName}
                        {guest.isPlusOne && <span className="text-xs text-gray-400 ml-1">(+1)</span>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{responseDateDisplay}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{rsvp?.email || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {rsvp ? (rsvp.hinduCeremonyAttending ? '✓ Yes' : '✗ No') : '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {rsvp ? (rsvp.weddingReceptionAttending ? '✓ Yes' : '✗ No') : '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{mealPreferenceDisplay}</td>
                      <td className="px-4 py-3 text-sm max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={rsvp?.dietaryRestrictions}>
                        {rsvp?.dietaryRestrictions || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {rsvp ? (rsvp.needsRideToHinduCeremony ? '✓ Yes' : '✗ No') : '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {rsvp ? (rsvp.needsRideToWedding ? '✓ Yes' : '✗ No') : '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {rsvp ? (rsvp.canOfferRide ? '✓ Yes' : '✗ No') : '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                        {rsvp?.physicalAddress?.street ? (
                          <span title={formattedAddress}>✓</span>
                        ) : (
                          ''
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtext }: { title: string; value: number | string; subtext?: string }) {
  return (
    <div className="bg-[var(--navy-light)] rounded-lg p-4">
      <h3 className="text-lg font-semibold text-[var(--rust-light)]">{title}</h3>
      <div className="text-3xl font-bold mt-2">{value}</div>
      <div className="text-sm text-[var(--rust-light)] mt-1">{subtext}</div>
    </div>
  );
}

// Helper function to get sortable value from guest object (can be nested)
const getSortableValue = (guest: GuestWithResponse, key: SortableKey): string | number | boolean | null => {
  const rsvp = guest.rsvpResponse;
  switch (key) {
    case 'fullName':
      return `${guest.firstName} ${guest.lastName}`.toLowerCase();
    case 'physicalAddressPresent':
      return !!(rsvp?.physicalAddress?.street);
    case 'responseTimestamp':
      return rsvp?.timestamp ? rsvp.timestamp.toMillis() : null;
    case 'rsvpResponse.email':
      return rsvp?.email?.toLowerCase() || null;
    case 'rsvpResponse.hinduCeremonyAttending':
      return rsvp?.hinduCeremonyAttending ? 1 : 0;
    case 'rsvpResponse.weddingReceptionAttending':
      return rsvp?.weddingReceptionAttending ? 1 : 0;
    case 'rsvpResponse.mealPreference':
      return rsvp?.mealPreference?.toLowerCase() || null;
    case 'rsvpResponse.dietaryRestrictions':
      return rsvp?.dietaryRestrictions?.toLowerCase() || null;
    case 'rsvpResponse.needsRideToHinduCeremony':
      return rsvp?.needsRideToHinduCeremony ? 1 : 0;
    case 'rsvpResponse.needsRideToWedding':
      return rsvp?.needsRideToWedding ? 1 : 0;
    case 'rsvpResponse.canOfferRide':
      return rsvp?.canOfferRide ? 1 : 0;
    default:
      return null;
  }
}; 