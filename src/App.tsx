import { useState, useRef, type FormEvent } from 'react';
import { Upload, CheckCircle2, User, Phone, MapPin, Trophy, Shield, Activity, Image as ImageIcon, Send } from 'lucide-react';
import './index.css';

interface FormData {
  playerName: string;
  contactNumber: string;
  villageName: string;
  playerRole: string;
  battingRole: string;
  bowlingRole: string;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    playerName: '',
    contactNumber: '',
    villageName: '',
    playerRole: '',
    battingRole: '',
    bowlingRole: '',
  });

  const [playerPhoto, setPlayerPhoto] = useState<File | null>(null);
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const paymentInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'payment') => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (type === 'photo') {
        setPlayerPhoto(file);
      } else {
        setPaymentScreenshot(file);
      }
    }
  };

  // Validation for submit button state
  const isFormComplete = 
    formData.playerName.trim() !== '' &&
    formData.contactNumber.trim() !== '' &&
    formData.villageName.trim() !== '' &&
    formData.playerRole !== '' &&
    formData.battingRole !== '' &&
    formData.bowlingRole !== '' &&
    playerPhoto !== null &&
    paymentScreenshot !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!isFormComplete) {
      setError('Please fill all the required fields and upload both images.');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      data.append('playerPhoto', playerPhoto as Blob);
      data.append('paymentScreenshot', paymentScreenshot as Blob);

      const response = await fetch('/api/submit', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        throw new Error('Failed to submit form. Please try again later.');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="app-container">
        <div className="success-message">
          <CheckCircle2 className="success-icon" />
          <h2>Registration Successful!</h2>
          <p>Your details have been submitted to the tournament committee.</p>
          <button 
            className="btn-submit" 
            style={{ marginTop: '2rem' }}
            onClick={() => window.location.reload()}
          >
            Register Another Player
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="header">
        <h1>BPL 2026 SEASON 1</h1>
        <p>Official Player Registration Form</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="playerName">
            <User size={18} /> Player Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="playerName"
            name="playerName"
            className="form-control"
            placeholder="Enter full name"
            required
            value={formData.playerName}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="contactNumber">
            <Phone size={18} /> Contact Number <span className="required">*</span>
          </label>
          <input
            type="tel"
            id="contactNumber"
            name="contactNumber"
            className="form-control"
            placeholder="Enter 10-digit number"
            pattern="[0-9]{10}"
            title="Please enter a valid 10-digit mobile number"
            required
            value={formData.contactNumber}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="villageName">
            <MapPin size={18} /> Village Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="villageName"
            name="villageName"
            className="form-control"
            placeholder="Enter village name"
            required
            value={formData.villageName}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="playerRole">
            <Trophy size={18} /> Player Role <span className="required">*</span>
          </label>
          <select
            id="playerRole"
            name="playerRole"
            className="form-control"
            required
            value={formData.playerRole}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Role</option>
            <option value="Batter">Batter</option>
            <option value="Bowler">Bowler</option>
            <option value="All-rounder">All-rounder</option>
            <option value="Wicket Keeper">Wicket Keeper</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="battingRole">
            <Shield size={18} /> Batting Style <span className="required">*</span>
          </label>
          <select
            id="battingRole"
            name="battingRole"
            className="form-control"
            required
            value={formData.battingRole}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Batting Style</option>
            <option value="Right Hand Batter">Right Hand Batter</option>
            <option value="Left Hand Batter">Left Hand Batter</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="bowlingRole">
            <Activity size={18} /> Bowling Style <span className="required">*</span>
          </label>
          <select
            id="bowlingRole"
            name="bowlingRole"
            className="form-control"
            required
            value={formData.bowlingRole}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Bowling Style</option>
            <option value="Right Arm Bowler">Right Arm Bowler</option>
            <option value="Left Arm Bowler">Left Arm Bowler</option>
            <option value="None">None (Pure Batter/WK)</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <User size={18} /> Player Photo <span className="required">*</span>
          </label>
          <div 
            className="file-upload-wrapper" 
            onClick={() => photoInputRef.current?.click()}
          >
            <input
              type="file"
              ref={photoInputRef}
              className="file-upload-input"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'photo')}
              required
            />
            <div className={`file-upload-content ${playerPhoto ? 'has-file' : ''}`}>
              <ImageIcon size={32} />
              <span>{playerPhoto ? playerPhoto.name : 'Click to upload photo'}</span>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>
            <Upload size={18} /> Payment Screenshot <span className="required">*</span>
          </label>
          <div 
            className="file-upload-wrapper"
            onClick={() => paymentInputRef.current?.click()}
          >
            <input
              type="file"
              ref={paymentInputRef}
              className="file-upload-input"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'payment')}
              required
            />
            <div className={`file-upload-content ${paymentScreenshot ? 'has-file' : ''}`}>
              <ImageIcon size={32} />
              <span>{paymentScreenshot ? paymentScreenshot.name : 'Click to upload screenshot'}</span>
            </div>
          </div>
        </div>

        {error && <div className="error-text">{error}</div>}

        <button type="submit" className="btn-submit" disabled={isSubmitting || !isFormComplete}>
          {isSubmitting ? (
            <div className="spinner"></div>
          ) : (
            <>
              Submit Registration <Send size={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default App;
