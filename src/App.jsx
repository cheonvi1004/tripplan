import { useState, useCallback, useRef } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import FormPanel from './components/FormPanel.jsx';
import PreviewPanel from './components/PreviewPanel.jsx';
import Footer from './components/Footer.jsx';
import { DEFAULT_STOPS } from './utils/constants.js';
import { generateCanvas, downloadCanvas } from './utils/canvasGenerator.js';

function App() {
  const [tripTitle, setTripTitle] = useState('경주 시내 코스');
  const [tripDate, setTripDate] = useState('2025-05-10');
  const [tripTheme, setTripTheme] = useState('역사/문화');
  const [start, setStart] = useState('서울역');
  const [startTime, setStartTime] = useState('08:00');
  const [end, setEnd] = useState('경주역');
  const [endTime, setEndTime] = useState('20:00');
  const [stops, setStops] = useState(DEFAULT_STOPS);
  const [palette, setPalette] = useState('forest');
  const [activeTab, setActiveTab] = useState('img');
  const [previewCanvas, setPreviewCanvas] = useState(null);

  const canvasRef = useRef(null);

  const handleStopChange = useCallback((index, field, value) => {
    setStops(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  }, []);

  const handleDeleteStop = useCallback((index) => {
    setStops(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddStop = useCallback(() => {
    setStops(prev => [...prev, { name: '', time: '', memo: '' }]);
  }, []);

  const handleMoveStop = useCallback((fromIndex, toIndex) => {
    setStops(prev => {
      const newStops = [...prev];
      const [moved] = newStops.splice(fromIndex, 1);
      newStops.splice(toIndex, 0, moved);
      return newStops;
    });
  }, []);

  const handleGenerate = useCallback(() => {
    if (startTime && endTime && startTime >= endTime) {
      alert('도착 시간은 출발 시간 이후여야 합니다.');
      return;
    }

    const cv = generateCanvas({
      title: tripTitle || '여행 코스',
      dateVal: tripDate,
      theme: tripTheme,
      sName: start || '출발지',
      sTime: startTime,
      eName: end || '도착지',
      eTime: endTime,
      stops,
      palette
    });

    setPreviewCanvas(cv);
    setActiveTab('img');
  }, [tripTitle, tripDate, tripTheme, start, startTime, end, endTime, stops, palette]);

  const handleDownload = useCallback(() => {
    if (previewCanvas) {
      downloadCanvas(previewCanvas);
    }
  }, [previewCanvas]);

  const handleMapOpen = useCallback(() => {
    const all = [
      { name: start, time: startTime },
      ...stops,
      { name: end, time: endTime }
    ];
    window.open('https://map.kakao.com/', '_blank');
  }, [start, startTime, stops, end, endTime]);

  return (
    <>
      <Header />
      <Hero />
      <div className="main">
        <FormPanel
          tripTitle={tripTitle} onTripTitleChange={setTripTitle}
          tripDate={tripDate} onTripDateChange={setTripDate}
          tripTheme={tripTheme} onTripThemeChange={setTripTheme}
          start={start} onStartChange={setStart}
          startTime={startTime} onStartTimeChange={setStartTime}
          end={end} onEndChange={setEnd}
          endTime={endTime} onEndTimeChange={setEndTime}
          stops={stops}
          onStopChange={handleStopChange}
          onDeleteStop={handleDeleteStop}
          onAddStop={handleAddStop}
          onMoveStop={handleMoveStop}
          palette={palette} onPaletteChange={setPalette}
          onGenerate={handleGenerate}
        />
        <PreviewPanel
          canvas={previewCanvas}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onDownload={handleDownload}
          onMapOpen={handleMapOpen}
          stops={stops}
          start={start} startTime={startTime}
          end={end} endTime={endTime}
        />
      </div>
      <Footer />
    </>
  );
}

export default App;
