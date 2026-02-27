import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateProfileRequest } from '../services/userService';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const updated = await updateProfileRequest({ name, avatarUrl });
      setUser(updated);
      setMessage('Profile updated');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Profile</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div>
          <div className="form-label">Name</div>
          <input
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <div className="form-label">Avatar URL</div>
          <input
            className="form-input"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
        </div>
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt="Avatar preview"
            style={{
              width: 80,
              height: 80,
              borderRadius: '999px',
              objectFit: 'cover',
            }}
          />
        )}
        <button className="btn" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
        {message && (
          <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfilePage;

