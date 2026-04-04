import { useState, useRef, useCallback } from 'react';
import StopCard from './StopCard.jsx';
import PaletteGrid from './PaletteGrid.jsx';
import { PALETTES, THEMES, escHtml } from '../utils/constants.js';

function FormPanel({
  tripTitle, onTripTitleChange,
  tripDate, onTripDateChange,
  tripTheme, onTripThemeChange,
  start, onStartChange,
  startTime, onStartTimeChange,
  end, onEndChange,
  endTime, onEndTimeChange,
  stops,
  onStopChange,
  onDeleteStop,
  onAddStop,
  onMoveStop,
  palette, onPaletteChange,
  onGenerate
}) {
  const [timeError, setTimeError] = useState(false);
  const [showTimeError, setShowTimeError] = useState(false);

  const validateAndGenerate = () => {
    if (startTime && endTime && startTime >= endTime) {
      setShowTimeError(true);
      return;
    }
    setShowTimeError(false);
    onGenerate();
  };

  return (
    <div className="form-panel">
      {/* 기본 정보 */}
      <div className="card">
        <div className="card-title">기본 정보</div>
        <div className="field">
          <label htmlFor="trip-title">여행 제목</label>
          <input
            className="fi"
            id="trip-title"
            placeholder="예: 경주 당일치기 여행"
            value={tripTitle}
            onChange={e => onTripTitleChange(e.target.value)}
            aria-required="true"
          />
        </div>
        <div className="row2">
          <div className="field">
            <label htmlFor="trip-date">날짜</label>
            <input
              className="fi"
              id="trip-date"
              type="date"
              value={tripDate}
              onChange={e => onTripDateChange(e.target.value)}
              aria-required="true"
            />
          </div>
          <div className="field">
            <label htmlFor="trip-theme">테마</label>
            <select
              className="fi"
              id="trip-theme"
              value={tripTheme}
              onChange={e => onTripThemeChange(e.target.value)}
              aria-required="true"
            >
              {THEMES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="row2">
          <div className="field">
            <label htmlFor="start">출발지</label>
            <input
              className="fi"
              id="start"
              value={start}
              onChange={e => onStartChange(e.target.value)}
              aria-required="true"
            />
          </div>
          <div className="field">
            <label htmlFor="start-time">출발 시간</label>
            <input
              className="fi"
              id="start-time"
              type="time"
              value={startTime}
              onChange={e => onStartTimeChange(e.target.value)}
              aria-required="true"
            />
          </div>
        </div>
        <div className="row2">
          <div className="field">
            <label htmlFor="end">도착지</label>
            <input
              className="fi"
              id="end"
              value={end}
              onChange={e => onEndChange(e.target.value)}
              aria-required="true"
            />
          </div>
          <div className="field">
            <label htmlFor="end-time">도착 시간</label>
            <input
              className="fi"
              id="end-time"
              type="time"
              value={endTime}
              onChange={e => onEndTimeChange(e.target.value)}
              aria-required="true"
            />
          </div>
        </div>
        <div className={`error-msg ${showTimeError ? 'show' : ''}`}>
          도착 시간은 출발 시간 이후여야 합니다
        </div>
      </div>

      {/* 경유 장소 */}
      <div className="card">
        <div className="card-title">
          경유 장소 <span style={{ fontWeight: 400, color: 'var(--text3)', fontSize: 10, letterSpacing: 0 }}>≡ 드래그로 순서 변경</span>
        </div>
        <div className="stop-list">
          {stops.map((stop, index) => (
            <StopCard
              key={index}
              stop={stop}
              index={index}
              onChange={(field, value) => onStopChange(index, field, value)}
              onDelete={() => onDeleteStop(index)}
              onMove={onMoveStop}
              totalStops={stops.length}
            />
          ))}
        </div>
        <button className="badd" onClick={onAddStop} aria-label="경유지 추가">
          + 경유지 추가
        </button>
      </div>

      {/* 배경 테마 */}
      <PaletteGrid palette={palette} onPaletteChange={onPaletteChange} />

      <button className="bgen" onClick={validateAndGenerate} aria-label="코스 이미지 생성하기">
        코스 이미지 생성하기 →
      </button>
    </div>
  );
}

export default FormPanel;
