'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import './Home.css'

export default function Home() {
  const [seats, setSeats] = useState([])
  const [seatCount, setSeatCount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const availableCount = seats.filter(seat => !seat.is_reserved).length
  const reservedCount = seats.filter(seat => seat.is_reserved).length


  useEffect(() => {
    fetchSeats()
  }, [])

  const fetchSeats = () => {
    setIsLoading(true)
    // axios.get('http://localhost:5000/api/seats')
    axios.get('https://train-seat-backend.onrender.com/api/seats')
      .then(res => setSeats(res.data))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false))
  }

  const handleBook = async () => {
    const count = parseInt(seatCount)
    if (!count || count < 1 || count > 7) {
      alert("Please enter a valid number of seats (1–7).")
      return
    }

    const availableSeats = seats.filter(seat => !seat.is_reserved)
    if (availableSeats.length < count) {
      alert(`Only ${availableSeats.length} seat(s) are available.`)
      return
    }

    setIsLoading(true)
    try {
      // await axios.post('http://localhost:5000/api/seats/reserve', { count })
      await axios.post('https://train-seat-backend.onrender.com/api/seats/reserve', { count })
      alert(`Successfully reserved ${count} seat(s)!`)
      fetchSeats()
      setSeatCount('')
    } catch (error) {
      console.error(error)
      alert("Error reserving seats.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = async () => {
    if (!window.confirm("Are you sure you want to reset all seats?")) return;
  
    setIsLoading(true)
    try {
      // await axios.post('http://localhost:5000/api/seats/reset')
      await axios.post('https://train-seat-backend.onrender.com/api/seats/reset')
      alert("All seats have been reset!")
      fetchSeats()
      setSeatCount('')
    } catch (error) {
      console.error(error)
      alert("Error resetting seats.")
    } finally {
      setIsLoading(false)
    }
  }
  

  return (
    <main className="main-container">
      <h1 className="title">Train Seat Reservation</h1>

      <div className="layout-container">
        <div className="seat-area">
          <div className="legend">
            <span className="legend-box available"></span> Available
            <span className="legend-box reserved"></span> Reserved
          </div>

          {isLoading ? (
            <div className="loader">Loading seats...</div>
          ) : (
            <div className="seat-grid">
              {seats.map(seat => (
                <div
                  key={seat.id}
                  className={`seat-box ${seat.is_reserved ? 'reserved' : 'available'}`}
                >
                  {seat.id}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sidebar">
          <label className="input-label">How many seats do you want to reserve?</label>
          <input
            type="number"
            min="1"
            max="7"
            value={seatCount}
            onChange={e => setSeatCount(e.target.value)}
            className="input-field"
          />
          <button
            className="btn book-btn"
            onClick={handleBook}
            disabled={!seatCount || isLoading}
          >
            Book
          </button>
          <button
            className="btn reset-btn"
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset
          </button>
        </div>

        <div className="summary-container">
  <div className="summary-field">
    <label>Available Seats:</label>
    <input type="text" readOnly value={availableCount} className="summary-input" />
  </div>
  <div className="summary-field">
    <label>Reserved Seats:</label>
    <input type="text" readOnly value={reservedCount} className="summary-input" />
  </div>
</div>


      </div>
    </main>
  )
}
