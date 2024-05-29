import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CompanySelection.module.css';

const CompanySelection = () => {
    const [companies, setCompanies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/companies', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('guid')}`
                    }
                });
                const data = await response.json();

                if (response.ok) {
                    setCompanies(data);
                } else {
                    setError(data.message || 'Failed to fetch companies');
                }
            } catch (err) {
                setError('An error occurred while fetching companies');
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    const handleSearch = () => {
        return companies.filter(company => company.name.toLowerCase().includes(searchQuery.toLowerCase()));
    };

    const handleCompanyClick = (companyId) => {
        navigate(`/CompanyLogin/${companyId}`);
    };

    return (
        <div className={styles.container}>
            <h1>Company Selection Page</h1>
            <input
                type="text"
                placeholder="Search Companies"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
            />
            <button onClick={handleSearch} className={styles.searchButton}>Search</button>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className={styles.error}>{error}</p>
            ) : (
                <ul className={styles.companyList}>
                    {handleSearch().map(company => (
                        <li key={company.id} className={styles.companyItem} onClick={() => handleCompanyClick(company.id)}>
                            {company.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CompanySelection;
