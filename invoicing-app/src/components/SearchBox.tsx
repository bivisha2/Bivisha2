'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBoxProps {
    placeholder?: string;
    onSearch?: (query: string) => void;
    className?: string;
}

const SearchBox = ({
    placeholder = "Search...",
    onSearch,
    className = ""
}: SearchBoxProps) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(query);
        }
    };

    const clearSearch = () => {
        setQuery('');
        if (onSearch) {
            onSearch('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`relative ${className}`}>
            <div className={`relative transition-all duration-200 ${isFocused ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
                {query && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>
        </form>
    );
};

export default SearchBox;