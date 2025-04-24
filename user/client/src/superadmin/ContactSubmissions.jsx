import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../lib/axios';
import { Check, X, MessageCircle, RefreshCw, AlertTriangle, CheckCircle, XCircle, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const ContactSubmissions = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    responded: 0,
    closed: 0
  });

  // Fetch contacts
  const fetchContacts = async () => {
    setLoading(true);
    try {
      // Construct query parameters based on filter
      let queryParams = '';
      if (filter !== 'all') {
        queryParams = `?status=${filter}`;
      }
      
      const response = await axiosInstance.get(`/contact${queryParams}`);
      setContacts(response.data);
      
      // Calculate stats
      const allContacts = response.data;
      setStats({
        total: allContacts.length,
        pending: allContacts.filter(c => c.status === 'pending').length,
        responded: allContacts.filter(c => c.status === 'responded').length,
        closed: allContacts.filter(c => c.status === 'closed').length
      });
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Failed to load contact submissions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [filter]);

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setResponseText(contact.response || '');
  };

  const handleCloseDetails = () => {
    setSelectedContact(null);
    setResponseText('');
  };

  const handleSubmitResponse = async (newStatus) => {
    if (!selectedContact) return;
    
    setSubmitting(true);
    try {
      await axiosInstance.put(`/contact/${selectedContact._id}/respond`, {
        status: newStatus,
        response: responseText
      });
      
      // Update local state
      setContacts(contacts.map(contact => 
        contact._id === selectedContact._id 
          ? { ...contact, status: newStatus, response: responseText } 
          : contact
      ));
      
      setSelectedContact({
        ...selectedContact,
        status: newStatus,
        response: responseText
      });
      
      // Refresh stats
      fetchContacts();
    } catch (err) {
      console.error('Error responding to contact:', err);
      setError('Failed to submit response. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ...existing code...
};