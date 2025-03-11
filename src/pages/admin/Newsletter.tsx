import React, { useState, useEffect } from 'react';
import { Mail, Send, Trash2, Download, Filter, AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import { getSubscribers, sendTestEmail, sendNewsletterCampaign } from '../../lib/mailchimp';
import { getPublishedPublications, deleteNewsletterSubscriber } from '../../lib/storage';
import { Post } from '../../types';

interface Subscriber {
  id: string;
  email_address: string;
  status: string;
  merge_fields: {
    FNAME: string;
    LNAME: string;
  };
  timestamp_signup: string;
  last_changed: string;
}

export default function Newsletter() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'unsubscribed'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [publications, setPublications] = useState<Post[]>([]);
  const [selectedPublication, setSelectedPublication] = useState<string>('');
  const [isSendingNewsletter, setIsSendingNewsletter] = useState(false);
  const [showTestEmailForm, setShowTestEmailForm] = useState(false);
  const [showNewsletterForm, setShowNewsletterForm] = useState(false);

  useEffect(() => {
    loadSubscribers();
    loadPublications();
  }, []);

  const loadSubscribers = async () => {
    try {
      setIsLoading(true);
      const data = await getSubscribers();
      setSubscribers(data);
    } catch (err) {
      console.error("Error loading subscribers:", err);
      setError('Erreur lors du chargement des abonnés');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPublications = async () => {
    try {
      const data = await getPublishedPublications();
      setPublications(data);
    } catch (err) {
      console.error('Error loading publications:', err);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedEmails(filteredSubscribers.map(sub => sub.email_address));
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

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail) return;
    
    try {
      setIsSendingTest(true);
      setError(null);
      await sendTestEmail(testEmail);
      setSuccess('Email de test envoyé avec succès !');
      setTestEmail('');
      setShowTestEmailForm(false);
      
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'envoi de l\'email de test');
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPublication) return;
    
    try {
      setIsSendingNewsletter(true);
      setError(null);
      
      const publication = publications.find(p => p.id === selectedPublication);
      if (!publication) {
        throw new Error('Publication non trouvée');
      }
      
      await sendNewsletterCampaign({
        title: publication.title,
        content: publication.content,
        imageUrl: publication.imageUrl,
        category: publication.category
      });
      
      setSuccess('Newsletter envoyée avec succès !');
      setSelectedPublication('');
      setShowNewsletterForm(false);
      
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'envoi de la newsletter');
    } finally {
      setIsSendingNewsletter(false);
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    try {
      await deleteNewsletterSubscriber(id);
      setSubscribers(prev => prev.filter(sub => sub.id !== id));
      setSuccess('Abonné supprimé avec succès');
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError('Erreur lors de la suppression de l\'abonné');
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Email', 'Prénom', 'Nom', 'Statut', 'Date d\'inscription', 'Dernière modification'].join(','),
      ...filteredSubscribers.map(sub => [
        sub.email_address,
        sub.merge_fields.FNAME || '',
        sub.merge_fields.LNAME || '',
        sub.status,
        new Date(sub.timestamp_signup).toLocaleDateString('fr-BE'),
        new Date(sub.last_changed).toLocaleDateString('fr-BE')
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
      case 'active':
        return sub.status === 'subscribed';
      case 'unsubscribed':
        return sub.status === 'unsubscribed';
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
            <h1 className="text-2xl font-display font-semibold text-gray-900">
              Gestion de la Newsletter
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => loadSubscribers()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Actualiser
              </button>
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="h-5 w-5 mr-2" />
                Exporter CSV
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowNewsletterForm(!showNewsletterForm)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Envoyer une newsletter
                </button>
                
                {showNewsletterForm && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-10 p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Envoyer une newsletter</h3>
                    <form onSubmit={handleSendNewsletter}>
                      <div className="mb-4">
                        <label htmlFor="publication" className="block text-sm font-medium text-gray-700 mb-1">
                          Sélectionner une publication
                        </label>
                        <select
                          id="publication"
                          value={selectedPublication}
                          onChange={(e) => setSelectedPublication(e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                          required
                        >
                          <option value="">Sélectionner une publication</option>
                          {publications.map(pub => (
                            <option key={pub.id} value={pub.id}>
                              {pub.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowNewsletterForm(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          disabled={isSendingNewsletter || !selectedPublication}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark disabled:opacity-50"
                        >
                          {isSendingNewsletter ? (
                            <>
                              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                              Envoi...
                            </>
                          ) : (
                            <>
                              <Send className="h-5 w-5 mr-2" />
                              Envoyer
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowTestEmailForm(!showTestEmailForm)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Tester
                </button>
                
                {showTestEmailForm && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-10 p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Envoyer un email de test</h3>
                    <form onSubmit={handleSendTestEmail}>
                      <div className="mb-4">
                        <label htmlFor="testEmail" className="block text-sm font-medium text-gray-700 mb-1">
                          Email de test
                        </label>
                        <input
                          type="email"
                          id="testEmail"
                          value={testEmail}
                          onChange={(e) => setTestEmail(e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                          placeholder="votre@email.com"
                          required
                        />
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowTestEmailForm(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          disabled={isSendingTest || !testEmail}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark disabled:opacity-50"
                        >
                          {isSendingTest ? (
                            <>
                              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                              Envoi...
                            </>
                          ) : (
                            <>
                              <Send className="h-5 w-5 mr-2" />
                              Tester
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                <option value="all">Tous les abonnés</option>
                <option value="active">Abonnés actifs</option>
                <option value="unsubscribed">Désabonnés</option>
              </select>
            </div>
            <p className="text-sm text-gray-500">
              {filteredSubscribers.length} abonné{filteredSubscribers.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedEmails.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'inscription
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière modification
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Aucun abonné trouvé
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedEmails.includes(subscriber.email_address)}
                        onChange={() => handleSelectSubscriber(subscriber.email_address)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {subscriber.email_address}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subscriber.merge_fields.FNAME || subscriber.merge_fields.LNAME ? (
                        `${subscriber.merge_fields.FNAME || ''} ${subscriber.merge_fields.LNAME || ''}`
                      ) : (
                        <span className="text-gray-400 italic">Non renseigné</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        subscriber.status === 'subscribed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {subscriber.status === 'subscribed' ? 'Abonné' : 'Désabonné'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subscriber.timestamp_signup
                        ? new Date(subscriber.timestamp_signup).toLocaleDateString('fr-BE')
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subscriber.last_changed
                        ? new Date(subscriber.last_changed).toLocaleDateString('fr-BE')
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}