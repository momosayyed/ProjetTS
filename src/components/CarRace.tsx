import { useState, useEffect, useRef } from 'react';
import { Car } from '../models/Car';

const CarRace = () => {
  const [car1] = useState(
    new Car('Mustang', 'Ford', 'red', 2023, 8)
  );
  const [car2] = useState(
    new Car('Camaro', 'Chevrolet', 'blue', 2023, 7)
  );
  
  const [raceStarted, setRaceStarted] = useState(false);
  const [winner, setWinner] = useState<Car | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const [pos1, setPos1] = useState(0);
  const [pos2, setPos2] = useState(0);
  const pos1Ref = useRef(0);
  const pos2Ref = useRef(0);
  const raceDistance = 100;

  const startRace = () => {
    // Reset positions
    car1.position = 0;
    car2.position = 0;
    pos1Ref.current = 0;
    pos2Ref.current = 0;
    setPos1(0);
    setPos2(0);

    car1.start();
    car2.start();
    setRaceStarted(true);
    setWinner(null);
    lastTimeRef.current = null;

    const step = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05); // seconds, capped for stability
      lastTimeRef.current = timestamp;

      const newP1 = Math.min(pos1Ref.current + (car1.started ? car1.speed * dt : 0), raceDistance);
      const newP2 = Math.min(pos2Ref.current + (car2.started ? car2.speed * dt : 0), raceDistance);

      pos1Ref.current = newP1;
      pos2Ref.current = newP2;
      setPos1(newP1);
      setPos2(newP2);

      if (newP1 >= raceDistance || newP2 >= raceDistance) {
        const winnerCar = newP1 >= newP2 ? car1 : car2;
        winnerCar.position = newP1 >= newP2 ? newP1 : newP2;
        setWinner(winnerCar);
        car1.stop();
        car2.stop();
        setRaceStarted(false);
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        return;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    rafRef.current = requestAnimationFrame(step);
  };

  const resetRace = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    car1.stop();
    car2.stop();
    car1.position = 0;
    car2.position = 0;
    pos1Ref.current = 0;
    pos2Ref.current = 0;
    setPos1(0);
    setPos2(0);
    setRaceStarted(false);
    setWinner(null);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6 font-inter">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">🏎️ Car Race</h1>
          <p className="text-lg text-gray-600">Watch the epic battle between two racing cars!</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border-2 border-red-200">
            <div className="flex items-center justify-center mb-2">
              <span className="text-3xl mr-3">🚗</span>
              <div>
                <h3 className="text-xl font-semibold text-red-700">{car1.getInfo()}</h3>
                <p className="text-red-600">Speed: {car1.speed} units/sec</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
            <div className="flex items-center justify-center mb-2">
              <span className="text-3xl mr-3">🚙</span>
              <div>
                <h3 className="text-xl font-semibold text-blue-700">{car2.getInfo()}</h3>
                <p className="text-blue-600">Speed: {car2.speed} units/sec</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-8 relative border-2 border-gray-200">
          <div className="absolute top-3 left-4 text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">START</div>
          <div className="absolute top-3 right-4 text-sm font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">FINISH</div>
          
          <div className="mt-12 space-y-4">
            {/* Car 1 track */}
            <div className="relative h-16 bg-gradient-to-r from-red-100 to-red-50 rounded-lg border-2 border-red-200 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div 
                className="absolute top-2 transition-all duration-100 ease-linear text-2xl"
                style={{ 
                  left: `${(pos1 / raceDistance) * 100}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                🚗
              </div>
              <div className="absolute bottom-1 left-2 text-xs font-medium text-red-700">
                {car1.brand} {car1.model}
              </div>
            </div>
            
            {/* Car 2 track */}
            <div className="relative h-16 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg border-2 border-blue-200 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div 
                className="absolute top-2 transition-all duration-100 ease-linear text-2xl"
                style={{ 
                  left: `${(pos2 / raceDistance) * 100}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                🚙
              </div>
              <div className="absolute bottom-1 left-2 text-xs font-medium text-blue-700">
                {car2.brand} {car2.model}
              </div>
            </div>
          </div>
          
          {/* Finish line */}
          <div className="absolute right-2 top-12 bottom-2 w-1 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full shadow-lg"></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button 
            onClick={startRace} 
            disabled={raceStarted}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform ${
              raceStarted 
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:scale-105 shadow-lg hover:shadow-xl'
            }`}
          >
            {raceStarted ? '🏁 Race in Progress...' : '🚀 Start Race'}
          </button>
          <button 
            onClick={resetRace}
            className="px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            🔄 Reset
          </button>
        </div>

        {winner && (
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-xl p-6 mb-8 text-center animate-pulse">
            <h3 className="text-3xl font-bold text-yellow-700 mb-2">🏆 Winner: {winner.getInfo()}!</h3>
            <p className="text-lg text-yellow-600">Final Position: {Math.round(winner.position)}</p>
          </div>
        )}

        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">📊 Live Race Stats</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-red-100 rounded-lg p-4">
              <p className="text-sm font-medium text-red-600">Car 1 Position</p>
              <p className="text-2xl font-bold text-red-700">{Math.round(pos1)}</p>
            </div>
            <div className="bg-blue-100 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-600">Car 2 Position</p>
              <p className="text-2xl font-bold text-blue-700">{Math.round(pos2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarRace;