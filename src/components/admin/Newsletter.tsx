import React, { useState, useEffect } from 'react';
import { Mail, Send, Trash2, Download, Filter } from 'lucide-react';
import { getNewsletterSubscribers, deleteNewsletterSubscriber } from '../../lib/supabase';

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
  confirmed: boolean;
  last_sent_at: string | null;
}

export default function Newsletter() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'unconfirmed'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      const data = await getNewsletterSubscribers();
      setSubscribers(data);
    } catch (err) {
      setError('Erreur lors du chargement des abonnés');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedEmails(filteredSubscribers.map(sub => sub.email));
    } else {
      setSelectedEmails([]);
    }
  };

  const handleSelectSubscriber = (email: string) => {
    setSelectedEmails(prev =>
      prev.includes(email)
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  const handleSendNewsletter = () => {
    const emailList = selectedEmails.join(',');
    const subject = encodeURIComponent('Newsletter Avolta Belgique');
    const body = encodeURIComponent(
      'Bonjour,\n\nVoici les dernières actualités d\'Avolta Belgique...'
    );
    window.location.href = `mailto:${emailList}?subject=${subject}&body=${body}`;
  };

  const handleDeleteSubscriber = async (id: string) => {
    try {
      await deleteNewsletterSubscriber(id);
      setSubscribers(prev => prev.filter(sub => sub.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression de l\'abonné');
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Email', 'Date d\'inscription', 'Statut', 'Dernier envoi'].join(','),
      ...subscribers.map(sub => [
        sub.email,
        new Date(sub.created_at).toLocaleDateString('fr-BE'),
        sub.confirmed ? 'Confirmé' : 'Non confirmé',
        sub.last_sent_at ? new Date(sub.last_sent_at).toLocaleDateString('fr-BE') : '-'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredSubscribers = subscribers.filter(sub => {
    switch (filter) {
      case 'confirmed':
        return sub.confirmed;
      case 'unconfirmed':
        return !sub.confirmed;
      default:
        return true;
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(n => (
              <div key={n} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Gestion de la Newsletter
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="h-5 w-5 mr-2" />
                Exporter CSV
              </button>
              <button
                onClick={handleSendNewsletter}
                disabled={selectedEmails.length === 0}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6A0DAD] hover:bg-[#5a0b91] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5 mr-2" />
                Envoyer la newsletter
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#6A0DAD] focus:ring-[#6A0DAD] sm:text-sm"
              >
                <option value="all">Tous les abonnés</option>
                <option value="confirmed">Confirmés</option>
                <option value="unconfirmed">Non confirmés</option>
              </select>
            </div>
            <p className="text-sm text-gray-500">
              {filteredSubscribers.length} abonné{filteredSubscribers.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedEmails.length === filteredSubscribers.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-[#6A0DAD] focus:ring-[#6A0DAD] border-gray-300 rounded"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'inscription
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernier envoi
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedEmails.includes(subscriber.email)}
                      onChange={() => handleSelectSubscriber(subscriber.email)}
                      className="h-4 w-4 text-[#6A0DAD] focus:ring-[#6A0DAD] border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {subscriber.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(subscriber.created_at).toLocaleDateString('fr-BE')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      subscriber.confirmed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {subscriber.confirmed ? 'Confirmé' : 'Non confirmé'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subscriber.last_sent_at
                      ? new Date(subscriber.last_sent_at).toLocaleDateString('fr-BE')
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteSubscriber(subscriber.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Supprimer"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Newsletter