'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, Trash2, Edit, Pin, User, Clock, CheckCircle } from 'lucide-react';

interface InvoiceNote {
    id: string;
    invoiceId: string;
    author: string;
    authorEmail: string;
    content: string;
    timestamp: string;
    isEdited: boolean;
    editedAt?: string;
    isPinned: boolean;
    isInternal: boolean;
    attachments?: string[];
    mentionedUsers?: string[];
}

interface InvoiceActivity {
    id: string;
    invoiceId: string;
    type: 'created' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'edited' | 'cancelled';
    description: string;
    timestamp: string;
    user?: string;
}

interface InvoiceNotesPanelProps {
    invoiceId: string;
    invoiceNumber: string;
    currentUser: string;
    currentUserEmail: string;
    notes?: InvoiceNote[];
    activities?: InvoiceActivity[];
    onAddNote?: (note: InvoiceNote) => void;
    onEditNote?: (note: InvoiceNote) => void;
    onDeleteNote?: (noteId: string) => void;
}

const InvoiceNotesPanel: React.FC<InvoiceNotesPanelProps> = ({
    invoiceId,
    invoiceNumber,
    currentUser,
    currentUserEmail,
    notes: externalNotes,
    activities: externalActivities,
    onAddNote,
    onEditNote,
    onDeleteNote,
}) => {
    const [notes, setNotes] = useState<InvoiceNote[]>(
        externalNotes || [
            {
                id: 'note-1',
                invoiceId: 'INV-001',
                author: 'John Doe',
                authorEmail: 'john@company.com',
                content: 'Client requested to split payment into two installments. Approved by manager.',
                timestamp: '2025-11-08T10:30:00Z',
                isEdited: false,
                isPinned: true,
                isInternal: true,
            },
            {
                id: 'note-2',
                invoiceId: 'INV-001',
                author: 'Sarah Smith',
                authorEmail: 'sarah@company.com',
                content: 'First payment received. Second installment due on November 20th.',
                timestamp: '2025-11-09T14:15:00Z',
                isEdited: false,
                isPinned: false,
                isInternal: true,
            },
            {
                id: 'note-3',
                invoiceId: 'INV-001',
                author: 'Mike Johnson',
                authorEmail: 'mike@company.com',
                content: 'Followed up with client via email. They confirmed payment will be processed by end of week.',
                timestamp: '2025-11-10T09:45:00Z',
                isEdited: true,
                editedAt: '2025-11-10T10:00:00Z',
                isPinned: false,
                isInternal: true,
            },
        ]
    );

    const [activities, setActivities] = useState<InvoiceActivity[]>(
        externalActivities || [
            {
                id: 'activity-1',
                invoiceId: 'INV-001',
                type: 'created',
                description: 'Invoice created',
                timestamp: '2025-11-05T08:00:00Z',
                user: 'John Doe',
            },
            {
                id: 'activity-2',
                invoiceId: 'INV-001',
                type: 'sent',
                description: 'Invoice sent to client@company.com',
                timestamp: '2025-11-05T08:30:00Z',
                user: 'John Doe',
            },
            {
                id: 'activity-3',
                invoiceId: 'INV-001',
                type: 'viewed',
                description: 'Client viewed invoice',
                timestamp: '2025-11-05T14:20:00Z',
            },
            {
                id: 'activity-4',
                invoiceId: 'INV-001',
                type: 'edited',
                description: 'Payment terms updated',
                timestamp: '2025-11-08T10:35:00Z',
                user: 'Sarah Smith',
            },
            {
                id: 'activity-5',
                invoiceId: 'INV-001',
                type: 'paid',
                description: 'Partial payment received (50%)',
                timestamp: '2025-11-09T16:00:00Z',
                user: 'System',
            },
        ]
    );

    const [newNote, setNewNote] = useState('');
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState('');
    const [activeTab, setActiveTab] = useState<'notes' | 'activity'>('notes');

    // Format relative time
    const formatRelativeTime = (timestamp: string): string => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
        if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
        if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Get activity icon and color
    const getActivityStyle = (type: InvoiceActivity['type']) => {
        const styles: Record<InvoiceActivity['type'], { icon: string; color: string }> = {
            created: { icon: '📝', color: 'bg-blue-100 text-blue-700' },
            sent: { icon: '📧', color: 'bg-purple-100 text-purple-700' },
            viewed: { icon: '👁️', color: 'bg-gray-100 text-gray-700' },
            paid: { icon: '✅', color: 'bg-green-100 text-green-700' },
            overdue: { icon: '⏰', color: 'bg-red-100 text-red-700' },
            edited: { icon: '✏️', color: 'bg-yellow-100 text-yellow-700' },
            cancelled: { icon: '❌', color: 'bg-red-100 text-red-700' },
        };
        return styles[type];
    };

    // Add new note
    const handleAddNote = () => {
        if (!newNote.trim()) return;

        const note: InvoiceNote = {
            id: `note-${Date.now()}`,
            invoiceId,
            author: currentUser,
            authorEmail: currentUserEmail,
            content: newNote,
            timestamp: new Date().toISOString(),
            isEdited: false,
            isPinned: false,
            isInternal: true,
        };

        setNotes((prev) => [note, ...prev]);
        setNewNote('');

        if (onAddNote) {
            onAddNote(note);
        }

        // Add activity for note creation
        const activity: InvoiceActivity = {
            id: `activity-${Date.now()}`,
            invoiceId,
            type: 'edited',
            description: `${currentUser} added a note`,
            timestamp: new Date().toISOString(),
            user: currentUser,
        };
        setActivities((prev) => [activity, ...prev]);
    };

    // Start editing note
    const handleStartEdit = (note: InvoiceNote) => {
        setEditingNoteId(note.id);
        setEditingContent(note.content);
    };

    // Save edited note
    const handleSaveEdit = () => {
        if (!editingNoteId || !editingContent.trim()) return;

        setNotes((prev) =>
            prev.map((note) =>
                note.id === editingNoteId
                    ? {
                          ...note,
                          content: editingContent,
                          isEdited: true,
                          editedAt: new Date().toISOString(),
                      }
                    : note
            )
        );

        const updatedNote = notes.find((n) => n.id === editingNoteId);
        if (updatedNote && onEditNote) {
            onEditNote({
                ...updatedNote,
                content: editingContent,
                isEdited: true,
                editedAt: new Date().toISOString(),
            });
        }

        setEditingNoteId(null);
        setEditingContent('');
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingNoteId(null);
        setEditingContent('');
    };

    // Delete note
    const handleDeleteNote = (noteId: string) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            setNotes((prev) => prev.filter((note) => note.id !== noteId));
            if (onDeleteNote) {
                onDeleteNote(noteId);
            }
        }
    };

    // Toggle pin
    const handleTogglePin = (noteId: string) => {
        setNotes((prev) =>
            prev.map((note) =>
                note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
            )
        );
    };

    // Sort notes (pinned first, then by timestamp)
    const sortedNotes = [...notes].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    Invoice {invoiceNumber} - Notes & Activity
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                    Internal communication and activity timeline
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('notes')}
                    className={`pb-3 px-4 font-medium transition-colors border-b-2 ${
                        activeTab === 'notes'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Notes ({notes.length})
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('activity')}
                    className={`pb-3 px-4 font-medium transition-colors border-b-2 ${
                        activeTab === 'activity'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Activity ({activities.length})
                    </div>
                </button>
            </div>

            {/* Notes Tab */}
            {activeTab === 'notes' && (
                <div>
                    {/* Add Note Form */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Add a note... (visible to team members only)"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={3}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && e.ctrlKey) {
                                    handleAddNote();
                                }
                            }}
                        />
                        <div className="flex items-center justify-between mt-3">
                            <p className="text-xs text-gray-500">
                                Ctrl + Enter to submit • Markdown supported
                            </p>
                            <button
                                onClick={handleAddNote}
                                disabled={!newNote.trim()}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" />
                                Add Note
                            </button>
                        </div>
                    </div>

                    {/* Notes List */}
                    <div className="space-y-4">
                        {sortedNotes.length === 0 ? (
                            <div className="text-center py-8">
                                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No notes yet</p>
                                <p className="text-sm text-gray-400">
                                    Add the first note to start tracking progress
                                </p>
                            </div>
                        ) : (
                            sortedNotes.map((note) => (
                                <div
                                    key={note.id}
                                    className={`border rounded-lg p-4 transition-all ${
                                        note.isPinned
                                            ? 'border-yellow-300 bg-yellow-50'
                                            : 'border-gray-200 bg-white hover:shadow-md'
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="shrink-0 w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                {note.author
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')
                                                    .toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-gray-900">
                                                        {note.author}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {formatRelativeTime(note.timestamp)}
                                                    </span>
                                                    {note.isEdited && (
                                                        <span className="text-xs text-gray-400">
                                                            (edited)
                                                        </span>
                                                    )}
                                                    {note.isPinned && (
                                                        <Pin className="w-3 h-3 text-yellow-600" />
                                                    )}
                                                </div>
                                                {editingNoteId === note.id ? (
                                                    <div>
                                                        <textarea
                                                            value={editingContent}
                                                            onChange={(e) =>
                                                                setEditingContent(e.target.value)
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-2"
                                                            rows={3}
                                                        />
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={handleSaveEdit}
                                                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={handleCancelEdit}
                                                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-700 whitespace-pre-wrap">
                                                        {note.content}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {editingNoteId !== note.id && (
                                            <div className="flex gap-2 ml-2">
                                                <button
                                                    onClick={() => handleTogglePin(note.id)}
                                                    className={`p-1.5 rounded transition-colors ${
                                                        note.isPinned
                                                            ? 'bg-yellow-200 text-yellow-700 hover:bg-yellow-300'
                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                                    title={note.isPinned ? 'Unpin' : 'Pin'}
                                                >
                                                    <Pin className="w-4 h-4" />
                                                </button>
                                                {note.author === currentUser && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStartEdit(note)}
                                                            className="p-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteNote(note.id)}
                                                            className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
                <div>
                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                        {/* Activity Items */}
                        <div className="space-y-6">
                            {activities.length === 0 ? (
                                <div className="text-center py-8">
                                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No activity yet</p>
                                </div>
                            ) : (
                                activities.map((activity, index) => {
                                    const style = getActivityStyle(activity.type);
                                    return (
                                        <div key={activity.id} className="relative flex gap-4">
                                            {/* Icon */}
                                            <div
                                                className={`relative z-10 shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl ${style.color}`}
                                            >
                                                {style.icon}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 pt-1.5">
                                                <p className="text-gray-900 font-medium">
                                                    {activity.description}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-sm text-gray-500">
                                                        {formatRelativeTime(activity.timestamp)}
                                                    </span>
                                                    {activity.user && (
                                                        <>
                                                            <span className="text-gray-300">•</span>
                                                            <span className="text-sm text-gray-600">
                                                                by {activity.user}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvoiceNotesPanel;
