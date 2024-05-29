import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './CompanyLogin.module.css';
import codeplayerslogo from '../assets/logo.png';
import infinitylogo from '../assets/infinityx.png';
const CompanyLogin = () => {
    const { companyId } = useParams();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/company-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, companyId }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('guid', data.guid);
                navigate('/BlankPage');
            } else {
                setError(data.message || 'Failed to login');
            }
        } catch (err) {
            setError('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.code}> 
                <img src={codeplayerslogo} alt='codeplayers logo' className={styles.i}/>
            </div>
            <div className={styles.h}>
                <img src={infinitylogo} alt='infinity erp logo' className={styles.j}/>
                <h1 className={styles.er}>Infinity X</h1>
            </div>
            <div className={styles.f}>
            <div className={styles.g}>
            <h1 className={styles.he}>Company Login</h1>
            <form onSubmit={handleLogin}>
            <div className={styles.m}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.inp}
                    required
                /><br></br>
                </div>
                <div className={styles.e}>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.inp}
                    required
                /><br></br>
                </div>
                <div className={styles.r}>
                <button className={styles.nit} type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Login'}
                </button><br></br>
                <a>Forgot Password</a>
                </div>
                {error && <p className={styles.error}>{error}</p>}
            </form>
            </div>
        </div>
        </div>
    );
};
export default CompanyLogin;
