import { useState, useRef, useCallback } from 'react';
import { formatTime } from '../utils/constants.js';

function StopCard({ stop, index, onChange, onDelete, onMove, totalStops }) {
  const [dragOver, setDragOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);
  const startYRef = useRef(0);
  const startTopRef = useRef(0);

  const handleMouseDown = useCallback((e) => {
    if (e.target.classList.contains('sname') || e.target.classList.contains('stime') || e.target.classList.contains('smemo')) return;
    e.preventDefault();
    setIsDragging(true);
    startYRef.current = e.clientY;
    startTopRef.current = cardRef.current.offsetTop;

    const handleMouseMove = (e2) => {
      const delta = e2.clientY - startYRef.current;
      cardRef.current.style.position = 'relative';
      cardRef.current.style.zIndex = '10';
      cardRef.current.style.top = delta + 'px';

      // Check drag over state for other cards
      document.querySelectorAll('.stop-card').forEach((c) => {
        if (c === cardRef.current) return;
        const rect = c.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        c.classList.toggle('drag-over', e2.clientY < mid);
      });
    };

    const handleMouseUp = (e2) => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      cardRef.current.style.position = '';
      cardRef.current.style.zIndex = '';
      cardRef.current.style.top = '';

      // Find target and move
      const target = [...document.querySelectorAll('.stop-card')].find((c) => {
        if (c === cardRef.current) return false;
        const rect = c.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        return e2.clientY < mid;
      });

      if (target) {
        const targetIndex = [...target.parentNode.children].indexOf(target);
        if (targetIndex !== index) {
          onMove(index, targetIndex > index ? targetIndex - 1 : targetIndex);
        }
      }

      document.querySelectorAll('.stop-card').forEach((c) => c.classList.remove('drag-over'));
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [index, onMove]);

  return (
    <div
      ref={cardRef}
      className={`stop-card ${dragOver ? 'drag-over' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={() => setDragOver(false)}
    >
      <div className="stop-top" onMouseDown={handleMouseDown}>
        <span className="dh">≡</span>
        <span className="sidx">{index + 1}</span>
        <input
          className="sname"
          type="text"
          placeholder="장소명"
          value={stop.name}
          onChange={(e) => onChange('name', e.target.value)}
        />
        <input
          className="stime"
          type="time"
          value={stop.time}
          onChange={(e) => onChange('time', e.target.value)}
        />
        <button
          className="bdel"
          onClick={onDelete}
          aria-label="삭제"
        >
          ×
        </button>
      </div>
      <div>
        <input
          className="smemo"
          type="text"
          placeholder="메모 (예: 입장료 무료, 주차 가능)"
          value={stop.memo}
          onChange={(e) => onChange('memo', e.target.value)}
        />
      </div>
      <div className="time-display" style={{ fontSize: 11, color: 'var(--text2)', marginLeft: 25, marginTop: 3 }}>
        {formatTime(stop.time)}
      </div>
    </div>
  );
}

export default StopCard;
