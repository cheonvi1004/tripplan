import { useEffect, useRef } from 'react';
import { escHtml } from '../utils/constants.js';

function PreviewPanel({
  canvas,
  activeTab,
  onTabChange,
  onDownload,
  onMapOpen,
  stops,
  start, startTime,
  end, endTime
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvas && canvasRef.current) {
      const container = canvasRef.current;
      container.innerHTML = '';
      const clonedCanvas = document.createElement('canvas');
      clonedCanvas.width = canvas.width;
      clonedCanvas.height = canvas.height;
      const ctx = clonedCanvas.getContext('2d');
      ctx.drawImage(canvas, 0, 0);
      container.appendChild(clonedCanvas);
    }
  }, [canvas]);

  const allPlaces = [
    { name: start, time: startTime },
    ...stops,
    { name: end, time: endTime }
  ].filter(p => p.name);

  const colors = ['#e63946', '#f4a261', '#2a9d8f', '#457b9d', '#e76f51', '#6d6875', '#264653', '#a8dadc', '#e9c46a', '#9b5de5'];

  const buildMapHtml = () => {
    return allPlaces.map((p, i) => {
      const url = 'https://map.kakao.com/link/search/' + encodeURIComponent(p.name);
      return `
        <div class="map-item">
          <span class="map-item-name">
            <span class="map-item-dot" style="background:${colors[i % colors.length]}"></span>
            ${escHtml(p.name)}
            ${p.time ? `<span style="font-size:11px;color:#8b949e"> ${p.time}</span>` : ''}
          </span>
          <a href="${url}" target="_blank" rel="noopener noreferrer">지도 보기 →</a>
        </div>
      `;
    }).join('');
  };

  return (
    <div className="preview-panel">
      {!canvas && (
        <div className="preview-empty">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-3V7m6 10l5.447 2.724A1 1 0 0021 18.618V7.382a1 1 0 00-.553-.894L15 4m0 13V4m-6 3l6-3" />
          </svg>
          <p>왼쪽에서 정보를 입력하고<br />이미지를 생성해보세요</p>
        </div>
      )}

      {canvas && (
        <div>
          <div className="ptabs" role="tablist">
            <button
              className={`ptab ${activeTab === 'img' ? 'active' : ''}`}
              role="tab"
              aria-selected={activeTab === 'img'}
              aria-controls="pp-img"
              onClick={() => onTabChange('img')}
            >
              이미지 미리보기
            </button>
            <button
              className={`ptab ${activeTab === 'map' ? 'active' : ''}`}
              role="tab"
              aria-selected={activeTab === 'map'}
              aria-controls="pp-map"
              onClick={() => onTabChange('map')}
            >
              카카오맵 연동
            </button>
          </div>

          {activeTab === 'img' && (
            <div className="ppanel active" id="pp-img" role="tabpanel" style={{ marginTop: 12 }}>
              <div className="cv-wrap" ref={canvasRef}></div>
              <button className="bdl" onClick={onDownload}>
                PNG 이미지 다운로드
              </button>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="ppanel" id="pp-map" role="tabpanel" style={{ marginTop: 12 }}>
              <div className="map-box">
                <h3>카카오맵에서 장소 검색</h3>
                <p>각 장소 이름을 클릭하면 카카오맵에서 바로 검색됩니다.<br />경로 탐색은 카카오맵 앱에서 더 편리하게 이용하세요.</p>
                <div className="map-items" dangerouslySetInnerHTML={{ __html: buildMapHtml() }} />
                <button className="map-open-btn" onClick={onMapOpen}>
                  카카오맵 열기
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PreviewPanel;
